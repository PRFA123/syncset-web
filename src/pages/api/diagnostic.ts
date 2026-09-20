import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;
export const GET: APIRoute = () => new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });

// Payload contract for the "Diagnostic de Automacao" feature. The score and
// report are now computed HERE (direct Anthropic call), not inside Make —
// this endpoint calls Claude itself so the report can be returned to the
// browser immediately, per the original brief. The full payload (answers +
// computed `report`) is still forwarded to the diagnostic-audit-v1 Make.com
// scenario afterwards, which writes the CRM row, pings Telegram, and emails
// the lead a backup copy — but it must stop calling Claude itself, or every
// submission gets billed twice. See CLAUDE.md for the exact `report` shape
// Make now receives.
interface DiagnosticPayload {
  name: string;
  email: string;
  phone: string;
  business: string;
  team_size: string;
  missed_enquiries_2wk: number;
  channel: string;
  after_hours_behavior: string;
  avg_deal_value_aud: number;
  tools_used: string;
  response_time_current: string;
  booking_flow_current: string;
  biggest_frustration: string;
  preferred_next_step: string;
  timestamp: string;
  report: DiagnosticReport;
}

interface DiagnosticReport {
  score: 'Alto potencial' | 'Médio potencial' | 'Baixo potencial';
  estimated_revenue_aud: number;
  summary: string;
  recommendations: string[];
  show_booking_cta: boolean;
}

const MAX_BODY_BYTES = 12 * 1024;
const MAX_FIELD = {
  name: 200,
  email: 254,
  phone: 40,
  business: 200,
  team_size: 40,
  channel: 100,
  after_hours_behavior: 500,
  tools_used: 300,
  response_time_current: 200,
  booking_flow_current: 300,
  biggest_frustration: 1000,
  preferred_next_step: 40,
} as const;
// Enforces Paulo's standing next-step rule: email first, automated WhatsApp
// second, phone/video call framed as last resort — never the default.
const ALLOWED_NEXT_STEPS = ['email', 'whatsapp_bot', 'call'] as const;
// A human needs longer than this between the form rendering and pressing submit.
const MIN_FILL_MS = 3000;
const MAX_MISSED_ENQUIRIES = 100000;
const MAX_DEAL_VALUE = 10000000;

// In-memory per-isolate rate limit: stops a single client/bot from hammering
// this endpoint. Not a global limit (Cloudflare can run several isolates
// concurrently across edge locations) and does not bound total spend — that
// is what MONTHLY_DIAGNOSTIC_CAP below is for. Kept as a cheap first line of
// defence against a single abusive IP on top of the real cap.
const RATE_LIMIT_MAX = 5; // submissions
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // per IP, per hour
const rateLimitBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitBuckets.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitBuckets.set(ip, timestamps);
  // Guard against unbounded growth across many distinct IPs in a long-lived isolate.
  if (rateLimitBuckets.size > 5000) {
    rateLimitBuckets.clear();
  }
  return false;
}

// Hard cap on real Anthropic spend, enforced globally via KV (not per-IP —
// this bounds TOTAL monthly cost regardless of how traffic is distributed).
// 200/month decided by the CEO Agent (see agents/BUDGET.md in the Agent
// Studio repo for the reasoning): current organic traffic is near zero
// pre-first-paying-client, so 200 is far above realistic legitimate demand,
// while bounding worst-case abuse cost to a low, clearly acceptable amount
// on Haiku-tier pricing. Revisit once real traffic data exists.
const MONTHLY_DIAGNOSTIC_CAP = 200;
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

function currentMonthKey(): string {
  const now = new Date();
  return `diagnostic:spend:${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

// Score thresholds (AUD estimated recovered revenue) are a starting point,
// not something Paulo specified exactly — tune here if real data suggests
// otherwise. Only Alto/Médio show the booking CTA, per the standing rule:
// don't push a call on a business too small for it to be worth either side's
// time.
function scoreFromRevenue(revenueAud: number): DiagnosticReport['score'] {
  if (revenueAud >= 3000) return 'Alto potencial';
  if (revenueAud >= 800) return 'Médio potencial';
  return 'Baixo potencial';
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Bots get the same response a human gets so they cannot tell they were caught.
const fakeSuccess = () => json({ success: true, message: 'Diagnostic received' }, 200);

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) {
    return json({ error: 'Too many requests. Please try again in a bit.' }, 429);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ error: 'Unsupported media type' }, 415);
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: 'Payload too large' }, 413);
  }

  try {
    // Content-Length can be absent or lie (chunked encoding), so measure the
    // bytes actually read before parsing.
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ error: 'Payload too large' }, 413);
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return json({ error: 'Invalid JSON' }, 400);
    }

    // Anti-spam, checked before validation so bots never learn which field failed.
    if (typeof data.company_website === 'string' && data.company_website.trim() !== '') {
      return fakeSuccess();
    }
    const formTs = Number(data.form_ts);
    if (!Number.isFinite(formTs) || Date.now() - formTs < MIN_FILL_MS) {
      return fakeSuccess();
    }

    const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
    const name = str(data.name);
    const email = str(data.email).toLowerCase();
    const phone = str(data.phone);
    const business = str(data.business);
    const team_size = str(data.team_size);
    const channel = str(data.channel);
    const after_hours_behavior = str(data.after_hours_behavior);
    const tools_used = str(data.tools_used);
    const response_time_current = str(data.response_time_current);
    const booking_flow_current = str(data.booking_flow_current);
    const biggest_frustration = str(data.biggest_frustration);
    const preferred_next_step = str(data.preferred_next_step);

    const missed_enquiries_2wk = Number(data.missed_enquiries_2wk);
    const avg_deal_value_aud = Number(data.avg_deal_value_aud);

    if (!name || !email || !business || !channel || !after_hours_behavior || !preferred_next_step) {
      return json({ error: 'Missing required fields' }, 400);
    }
    if (!Number.isFinite(missed_enquiries_2wk) || missed_enquiries_2wk < 0 || missed_enquiries_2wk > MAX_MISSED_ENQUIRIES) {
      return json({ error: 'Missed enquiries must be a valid number' }, 400);
    }
    if (!Number.isFinite(avg_deal_value_aud) || avg_deal_value_aud < 0 || avg_deal_value_aud > MAX_DEAL_VALUE) {
      return json({ error: 'Average deal value must be a valid number' }, 400);
    }
    if (!ALLOWED_NEXT_STEPS.includes(preferred_next_step as typeof ALLOWED_NEXT_STEPS[number])) {
      return json({ error: 'Invalid preferred next step' }, 400);
    }

    const fieldChecks: Array<[string, string, number]> = [
      [name, 'name', MAX_FIELD.name],
      [email, 'email', MAX_FIELD.email],
      [phone, 'phone', MAX_FIELD.phone],
      [business, 'business', MAX_FIELD.business],
      [team_size, 'team_size', MAX_FIELD.team_size],
      [channel, 'channel', MAX_FIELD.channel],
      [after_hours_behavior, 'after_hours_behavior', MAX_FIELD.after_hours_behavior],
      [tools_used, 'tools_used', MAX_FIELD.tools_used],
      [response_time_current, 'response_time_current', MAX_FIELD.response_time_current],
      [booking_flow_current, 'booking_flow_current', MAX_FIELD.booking_flow_current],
      [biggest_frustration, 'biggest_frustration', MAX_FIELD.biggest_frustration],
      [preferred_next_step, 'preferred_next_step', MAX_FIELD.preferred_next_step],
    ];
    for (const [value, field, max] of fieldChecks) {
      if (value.length > max) {
        return json({ error: `Field ${field} is too long.` }, 400);
      }
    }

    // The browser form does the same check, but this endpoint is public and
    // must not trust the client: a bad address still reaches the CRM and the
    // confirmation email just silently bounces.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return json({ error: 'Please enter a valid email address.' }, 400);
    }

    // Workers bindings come from the 'cloudflare:workers' module. Astro 6 removed
    // Astro.locals.runtime.env (it now throws instead of returning undefined) and
    // process.env stays empty on Workers regardless of compat settings.
    const webhookUrl = env.DIAGNOSTIC_WEBHOOK_URL;
    const anthropicKey = env.ANTHROPIC_API_KEY;
    const spendKv = env.DIAGNOSTIC_KV;
    if (!webhookUrl || !anthropicKey || !spendKv) {
      console.error(
        'diagnostic: missing configuration —',
        !webhookUrl ? 'DIAGNOSTIC_WEBHOOK_URL' : '',
        !anthropicKey ? 'ANTHROPIC_API_KEY' : '',
        !spendKv ? 'DIAGNOSTIC_KV' : ''
      );
      return json({ error: 'Configuration error' }, 500);
    }

    // Global monthly spend cap, enforced before the paid API call. Fails
    // closed: if KV read/write itself errors, we do not fall through to an
    // uncapped Anthropic call — that would defeat the whole point of the cap.
    const monthKey = currentMonthKey();
    let monthCount: number;
    try {
      monthCount = Number((await spendKv.get(monthKey)) || '0');
    } catch (error) {
      console.error('diagnostic: KV read failed, refusing to proceed uncapped', error);
      return json({ error: 'Internal server error' }, 500);
    }
    if (monthCount >= MONTHLY_DIAGNOSTIC_CAP) {
      console.error('diagnostic: monthly cap reached', monthKey, monthCount);
      return json(
        { error: "We've hit our diagnostic capacity for this month. Please email contact@syncset.com.au and we'll run yours by hand." },
        429
      );
    }

    // Deterministic score/revenue math happens in code, never trusted to the
    // model — an LLM asked to "do the arithmetic" is the wrong tool for a
    // fixed formula. Claude is only asked for the qualitative narrative,
    // grounded in the already-computed numbers.
    const estimated_revenue_aud = Math.round(missed_enquiries_2wk * 0.3 * avg_deal_value_aud);
    const score = scoreFromRevenue(estimated_revenue_aud);
    const show_booking_cta = score !== 'Baixo potencial';

    let summary: string;
    let recommendations: string[];
    try {
      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 800,
          system:
            'You write short, specific automation diagnostic reports for Australian small ' +
            'businesses, based on answers from a 2-minute intake chat. You are given an ' +
            'already-computed score and estimated recovered revenue (over the last 2 weeks) ' +
            '— never recalculate or contradict those numbers. Write exactly: a 1-2 sentence ' +
            'summary of their situation, and 2-3 recommendations. Every recommendation must ' +
            'reference something specific from their actual answers (their channel, their ' +
            'after-hours behaviour, their tools, their stated frustration) — never a generic ' +
            'tip that could apply to any business. Australian English. No invented statistics ' +
            'beyond the numbers you were given. Never use an em dash (—) or en dash (–) ' +
            'anywhere in your output. Write in plain sentences with commas, periods, or ' +
            '"and"/"but" instead. Avoid other tells of AI-generated writing too (no ' +
            '"furthermore", "in today\'s fast-paced world", triple-adjective lists, or ' +
            'unnecessary hedging). Write like a person who knows this business, not like a ' +
            'report generator.',
          messages: [
            {
              role: 'user',
              content: JSON.stringify({
                business,
                team_size: team_size || 'not given',
                channel,
                missed_enquiries_2wk,
                after_hours_behavior,
                avg_deal_value_aud,
                tools_used: tools_used || 'not given',
                response_time_current: response_time_current || 'not given',
                booking_flow_current: booking_flow_current || 'not given',
                biggest_frustration: biggest_frustration || 'not given',
                computed_score: score,
                computed_estimated_revenue_aud: estimated_revenue_aud,
              }),
            },
          ],
          tool_choice: { type: 'tool', name: 'submit_diagnostic_report' },
          tools: [
            {
              name: 'submit_diagnostic_report',
              description: 'Submit the written diagnostic report.',
              input_schema: {
                type: 'object',
                properties: {
                  summary: { type: 'string' },
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 2,
                    maxItems: 3,
                  },
                },
                required: ['summary', 'recommendations'],
              },
            },
          ],
        }),
      });

      if (!anthropicRes.ok) {
        const errText = await anthropicRes.text().catch(() => '');
        console.error('diagnostic: Anthropic API returned non-OK status', anthropicRes.status, errText);
        return json({ error: 'Internal server error' }, 500);
      }

      const anthropicJson = (await anthropicRes.json()) as {
        content?: Array<{ type: string; input?: { summary?: string; recommendations?: string[] } }>;
      };
      const toolUse = anthropicJson.content?.find((c) => c.type === 'tool_use');
      summary = toolUse?.input?.summary || '';
      recommendations = toolUse?.input?.recommendations || [];
      if (!summary || recommendations.length < 2) {
        console.error('diagnostic: Anthropic response missing expected fields', JSON.stringify(anthropicJson));
        return json({ error: 'Internal server error' }, 500);
      }
    } catch (error) {
      console.error(
        'diagnostic: fetch to Anthropic threw',
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined
      );
      return json({ error: 'Internal server error' }, 500);
    }

    // Only count spend against the cap for a call that actually succeeded and
    // billed. KV writes here are best-effort per-isolate — under concurrent
    // load two requests can both read the same starting count before either
    // writes (a known KV race, not a strict lock) — acceptable at this
    // traffic level since the cap is a cost ceiling, not a precise quota;
    // revisit if volume ever makes the race meaningfully underrun 200/month.
    try {
      await spendKv.put(monthKey, String(monthCount + 1), { expirationTtl: 60 * 60 * 24 * 40 });
    } catch (error) {
      console.error('diagnostic: KV write failed (report already generated, proceeding anyway)', error);
    }

    const report: DiagnosticReport = {
      score,
      estimated_revenue_aud,
      summary,
      recommendations,
      show_booking_cta,
    };

    const payload: DiagnosticPayload = {
      name,
      email,
      phone,
      business,
      team_size,
      missed_enquiries_2wk,
      channel,
      after_hours_behavior,
      avg_deal_value_aud,
      tools_used,
      response_time_current,
      booking_flow_current,
      biggest_frustration,
      preferred_next_step,
      timestamp: new Date().toISOString(),
      report,
    };

    // The report is already generated at this point — a Make/CRM failure
    // below must not throw it away. The visitor gets their report either
    // way; only the Notion row / Telegram ping / backup email might be
    // missing, logged here so it's visible in `wrangler tail`, not silently
    // lost.
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error('diagnostic: Make webhook returned non-OK status', response.status, response.statusText);
      }
    } catch (error) {
      console.error(
        'diagnostic: fetch to Make webhook threw (report still returned to visitor)',
        error instanceof Error ? error.message : String(error)
      );
    }

    return json({ success: true, report }, 200);
  } catch (error) {
    console.error(
      'diagnostic: unexpected error',
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined
    );
    return json({ error: 'Internal server error' }, 500);
  }
};
