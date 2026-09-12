// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/",
    "/_astro/*",
    "/apple-touch-icon.png",
    "/favicon-32.png",
    "/favicon.svg",
    "/llms.txt",
    "/og-image-base.jpg",
    "/og-image.png",
    "/robots.txt",
    "/syncset-mark-source.jpg",
    "/fonts/JetBrainsMono-Regular.woff2",
    "/fonts/PlusJakartaSans-Bold.woff2",
    "/fonts/PlusJakartaSans-Medium.woff2",
    "/fonts/PlusJakartaSans-Regular.woff2",
    "/book",
    "/privacy",
    "/terms"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "C:\\Users\\paulo\\syncset-web\\.wrangler\\tmp\\pages-JbWg8U\\bundledWorker-0.10215063415522296.mjs";
import { isRoutingRuleMatch } from "C:\\Users\\paulo\\syncset-web\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "C:\\Users\\paulo\\syncset-web\\.wrangler\\tmp\\pages-JbWg8U\\bundledWorker-0.10215063415522296.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=uvrs6s5axrs.js.map
