import type { APIRoute } from 'astro';

export const prerender = false;

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

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.business) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Extract UTM parameters from headers or form data
    const referer = request.headers.get('referer') || '';
    const urlParams = new URLSearchParams(new URL(referer).search);

    const payload: LeadPayload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      business: data.business.trim(),
      message: data.message?.trim() || '',
      source: 'syncset.com.au/home',
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      timestamp: new Date().toISOString(),
    };

    // Send to Make webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('MAKE_WEBHOOK_URL environment variable not set');
      return new Response(
        JSON.stringify({ error: 'Configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Make webhook error:', response.statusText);
      return new Response(
        JSON.stringify({ error: 'Failed to process lead' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Lead received' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
