import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;
export const GET: APIRoute = () => new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });

// Payload contract for the "Diagnostic de Automacao" feature. Forwarded as-is
// to the diagnostic-audit-v1 Make.com scenario, which runs it through Claude
// (forced JSON-schema output: score/estimated_revenue_aud/summary/report_html/next_steps),
// writes a "Diagnostic"-type row to the CRM SyncSet - Leads Notion data source,
// pings Telegram internally, and emails the lead their report.
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

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Bots get the same response a human gets so they cannot tell they were caught.
const fakeSuccess = () => json({ success: true, message: 'Diagnostic received' }, 200);

export const POST: APIRoute = async ({ request }) => {
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
    };

    // Workers bindings come from the 'cloudflare:workers' module. Astro 6 removed
    // Astro.locals.runtime.env (it now throws instead of returning undefined) and
    // process.env stays empty on Workers regardless of compat settings.
    const webhookUrl = env.DIAGNOSTIC_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('diagnostic: DIAGNOSTIC_WEBHOOK_URL environment variable not set');
      return json({ error: 'Configuration error' }, 500);
    }

    let response: Response;
    try {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(
        'diagnostic: fetch to Make webhook threw',
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined
      );
      return json({ error: 'Internal server error' }, 500);
    }

    if (!response.ok) {
      console.error('diagnostic: Make webhook returned non-OK status', response.status, response.statusText);
      return json({ error: 'Failed to process diagnostic' }, 500);
    }

    return json({ success: true, message: 'Diagnostic received' }, 200);
  } catch (error) {
    console.error(
      'diagnostic: unexpected error',
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined
    );
    return json({ error: 'Internal server error' }, 500);
  }
};
