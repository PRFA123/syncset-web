/// <reference types="astro/client" />

type CloudflareEnv = {
  MAKE_WEBHOOK_URL?: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
