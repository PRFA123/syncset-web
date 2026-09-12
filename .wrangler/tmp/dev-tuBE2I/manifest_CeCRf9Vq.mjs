globalThis.process ??= {}; globalThis.process.env ??= {};
import { p as decodeKey } from './chunks/astro/server_BFhXsbKs.mjs';
import './chunks/astro-designed-error-pages_BCR_kahh.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_BjJVYAu_.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/paulo/syncset-web/","cacheDir":"file:///C:/Users/paulo/syncset-web/node_modules/.astro/","outDir":"file:///C:/Users/paulo/syncset-web/dist/","srcDir":"file:///C:/Users/paulo/syncset-web/src/","publicDir":"file:///C:/Users/paulo/syncset-web/public/","buildClientDir":"file:///C:/Users/paulo/syncset-web/dist/","buildServerDir":"file:///C:/Users/paulo/syncset-web/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"book/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/book.B9vSY57L.css"},{"type":"inline","content":".booking[data-astro-cid-uk4drrvt]{min-height:calc(100vh - 200px);padding:var(--space-24) var(--gutter);background-color:var(--paper)}.booking__container[data-astro-cid-uk4drrvt]{max-width:var(--max-content);margin:0 auto}.booking__title[data-astro-cid-uk4drrvt]{font-size:var(--text-2xl);font-weight:700;color:var(--ink);margin-bottom:var(--space-4)}.booking__description[data-astro-cid-uk4drrvt]{font-size:var(--text-base);color:var(--graphite);margin-bottom:var(--space-12);line-height:1.6}.booking__embed[data-astro-cid-uk4drrvt]{max-width:800px;margin:0 auto}@media(max-width:768px){.booking[data-astro-cid-uk4drrvt]{padding:var(--space-16) var(--gutter)}.booking__title[data-astro-cid-uk4drrvt]{font-size:var(--text-xl)}}\n"}],"routeData":{"route":"/book","isIndex":false,"type":"page","pattern":"^\\/book\\/?$","segments":[[{"content":"book","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/book.astro","pathname":"/book","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"privacy/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/book.B9vSY57L.css"},{"type":"inline","content":".legal[data-astro-cid-fb3qbcs3]{min-height:calc(100vh - 200px);padding:var(--space-24) var(--gutter);background-color:var(--paper)}.legal__container[data-astro-cid-fb3qbcs3]{max-width:var(--max-content);margin:0 auto;color:var(--graphite);line-height:1.8}.legal__container[data-astro-cid-fb3qbcs3] h1[data-astro-cid-fb3qbcs3]{font-size:var(--text-2xl);font-weight:700;color:var(--ink);margin-bottom:var(--space-12)}.legal__container[data-astro-cid-fb3qbcs3] p[data-astro-cid-fb3qbcs3]{margin-bottom:var(--space-6)}.legal__container[data-astro-cid-fb3qbcs3] strong[data-astro-cid-fb3qbcs3]{color:var(--ink)}@media(max-width:768px){.legal[data-astro-cid-fb3qbcs3]{padding:var(--space-16) var(--gutter)}.legal__container[data-astro-cid-fb3qbcs3] h1[data-astro-cid-fb3qbcs3]{font-size:var(--text-xl)}}\n"}],"routeData":{"route":"/privacy","isIndex":false,"type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"terms/index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/book.B9vSY57L.css"},{"type":"inline","content":".legal[data-astro-cid-y5py4vqc]{min-height:calc(100vh - 200px);padding:var(--space-24) var(--gutter);background-color:var(--paper)}.legal__container[data-astro-cid-y5py4vqc]{max-width:var(--max-content);margin:0 auto;color:var(--graphite);line-height:1.8}.legal__container[data-astro-cid-y5py4vqc] h1[data-astro-cid-y5py4vqc]{font-size:var(--text-2xl);font-weight:700;color:var(--ink);margin-bottom:var(--space-12)}.legal__container[data-astro-cid-y5py4vqc] p[data-astro-cid-y5py4vqc]{margin-bottom:var(--space-6)}.legal__container[data-astro-cid-y5py4vqc] strong[data-astro-cid-y5py4vqc]{color:var(--ink)}@media(max-width:768px){.legal[data-astro-cid-y5py4vqc]{padding:var(--space-16) var(--gutter)}.legal__container[data-astro-cid-y5py4vqc] h1[data-astro-cid-y5py4vqc]{font-size:var(--text-xl)}}\n"}],"routeData":{"route":"/terms","isIndex":false,"type":"page","pattern":"^\\/terms\\/?$","segments":[[{"content":"terms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/terms.astro","pathname":"/terms","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/book.B9vSY57L.css"},{"type":"external","src":"/_astro/index.BbbOXg-l.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/lead","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/lead\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"lead","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/lead.ts","pathname":"/api/lead","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.syncset.com.au","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/paulo/syncset-web/src/pages/book.astro",{"propagation":"none","containsHead":true}],["C:/Users/paulo/syncset-web/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/paulo/syncset-web/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["C:/Users/paulo/syncset-web/src/pages/terms.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/api/lead@_@ts":"pages/api/lead.astro.mjs","\u0000@astro-page:src/pages/book@_@astro":"pages/book.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"pages/privacy.astro.mjs","\u0000@astro-page:src/pages/terms@_@astro":"pages/terms.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CeCRf9Vq.mjs","C:/Users/paulo/syncset-web/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CDbwEC4W.mjs","C:/Users/paulo/syncset-web/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/book.B9vSY57L.css","/_astro/index.BbbOXg-l.css","/apple-touch-icon.png","/favicon-32.png","/favicon.svg","/llms.txt","/og-image-base.jpg","/og-image.png","/robots.txt","/syncset-mark-source.jpg","/fonts/JetBrainsMono-Regular.woff2","/fonts/PlusJakartaSans-Bold.woff2","/fonts/PlusJakartaSans-Medium.woff2","/fonts/PlusJakartaSans-Regular.woff2","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/chunks/astro-designed-error-pages_BCR_kahh.mjs","/_worker.js/chunks/astro_C0inWvlJ.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/Footer_C4WxC-6m.mjs","/_worker.js/chunks/image-endpoint_CjRPBgqD.mjs","/_worker.js/chunks/noop-middleware_BjJVYAu_.mjs","/_worker.js/chunks/path_CH3auf61.mjs","/_worker.js/chunks/remote_CVXTZJrr.mjs","/_worker.js/chunks/render-context_D3wLvHAm.mjs","/_worker.js/chunks/sharp_CDbwEC4W.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_DTeJ3oNr.mjs","/_worker.js/pages/book.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/privacy.astro.mjs","/_worker.js/pages/terms.astro.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/_astro/book.B9vSY57L.css","/_worker.js/_astro/index.BbbOXg-l.css","/_worker.js/chunks/astro/server_BFhXsbKs.mjs","/_worker.js/pages/api/lead.astro.mjs","/book/index.html","/privacy/index.html","/terms/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"/5SUPJiyzPj8fKNl7cCLIgVGGdmOYcWrrkp5gvXzI+s=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
