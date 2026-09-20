/// <reference types="astro/client" />

// Minimal structural type instead of the ambient `KVNamespace` global —
// avoids depending on @cloudflare/workers-types being present/versioned
// right, and this endpoint only ever calls .get/.put.
interface DiagnosticSpendKv {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

type CloudflareEnv = {
  MAKE_WEBHOOK_URL?: string;
  DIAGNOSTIC_WEBHOOK_URL?: string;
  ANTHROPIC_API_KEY?: string;
  DIAGNOSTIC_KV?: DiagnosticSpendKv;
};

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}

// Astro 6 reads Worker bindings via 'cloudflare:workers', not Astro.locals.runtime.env.
declare module 'cloudflare:workers' {
  const env: CloudflareEnv;
  export { env };
}
