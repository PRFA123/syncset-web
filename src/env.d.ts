/// <reference types="astro/client" />

type CloudflareEnv = {
  MAKE_WEBHOOK_URL?: string;
  DIAGNOSTIC_WEBHOOK_URL?: string;
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
