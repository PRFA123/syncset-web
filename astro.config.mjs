import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.syncset.com.au',
  integrations: [sitemap()],
  output: 'server',
  adapter: cloudflare(),
  vite: {
    build: {
      // esbuild ships with Vite already — no extra dependency to install,
      // unlike 'terser' which requires an explicit devDependency.
      minify: 'esbuild',
    },
  },
});
