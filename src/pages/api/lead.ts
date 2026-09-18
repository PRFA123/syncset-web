import type { APIRoute } from 'astro';

export const prerender = false;
export const GET: APIRoute = () => new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });

interface LeadPayload {
  name: string;
  email: string;
  business: string;
  message: string;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  timestamp: string;
}

const MAX_BODY_BYTES = 8 * 1024;
const MAX_FIELD = { name: 200, email: 254, business: 200, message: 5000 } as const;
// A human needs longer than this between the form rendering and pressing submit.
const MIN_FILL_MS = 3000;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Bots get the same response a human gets so they cannot tell they were caught.
const fakeSuccess = () => json({ success: true, message: 'Lead received' }, 200);

export const POST: APIRoute = async ({ request, locals }) => {
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
    const business = str(data.business);
    const message = str(data.message);

    if (!name || !email || !business) {
      return json({ error: 'Missing required fields' }, 400);
    }
    if (
      name.length > MAX_FIELD.name ||
      email.length > MAX_FIELD.email ||
      business.length > MAX_FIELD.business ||
      message.length > MAX_FIELD.message
    ) {
      return json({ error: 'One of the fields is too long.' }, 400);
    }

    // The browser form does the same check, but this endpoint is public and
    // must not trust the client: a bad address still reaches the CRM and the
    // confirmation email just silently bounces.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return json({ error: 'Please enter a valid email address.' }, 400);
    }

    // Not every request carries a referer (privacy settings, no-referrer policy),
    // so UTM extraction must never throw and lose a real lead.
    const referer = request.headers.get('referer') || '';
    let utm_source: string | null = null;
    let utm_medium: string | null = null;
    if (referer) {
      try {
        const urlParams = new URLSearchParams(new URL(referer).search);
        utm_source = urlParams.get('utm_source');
        utm_medium = urlParams.get('utm_medium');
      } catch {
        // Malformed referer header — ignore UTM extraction, still process the lead.
      }
    }

    const payload: LeadPayload = {
      name,
      email,
      business,
      message,
      source: 'syncset.com.au/home',
      utm_source,
      utm_medium,
      timestamp: new Date().toISOString(),
    };

    // Workers bindings live on locals.runtime.env. process.env is only populated
    // when the Pages project has nodejs_compat AND a compat date >= 2025-04-26;
    // outside that window it is an empty object and every submission 500s.
    const webhookUrl = locals.runtime?.env?.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('MAKE_WEBHOOK_URL environment variable not set');
      return json({ error: 'Configuration error' }, 500);
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Make webhook error:', response.status, response.statusText);
      return json({ error: 'Failed to process lead' }, 500);
    }

    return json({ success: true, message: 'Lead received' }, 200);
  } catch (error) {
    console.error('API error:', error);
    return json({ error: 'Internal server error' }, 500);
  }
};
