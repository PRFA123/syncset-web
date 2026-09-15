// Computed-style snapshot for before/after comparison of the Tailwind removal.
// Usage in page: await snap('before'|'after') -> summary; diff('before','after') -> changed elements.
(() => {
  const PROPS = [
    'display','position','box-sizing','margin-top','margin-right','margin-bottom','margin-left',
    'padding-top','padding-right','padding-bottom','padding-left','border-top-width','border-right-width',
    'border-bottom-width','border-left-width','border-top-style','border-top-color','font-family','font-size',
    'font-weight','line-height','letter-spacing','color','background-color','text-decoration-line',
    'list-style-type','vertical-align','max-width','width','height','cursor','resize','opacity','text-transform',
    'text-align','gap','flex-direction','align-items','justify-content','overflow-x','overflow-y','outline-style',
  ];
  const path = (el) => {
    const parts = [];
    while (el && el !== document.body) {
      let s = el.tagName.toLowerCase();
      if (el.id) s += '#' + el.id;
      else if (el.classList.length) s += '.' + [...el.classList].filter(c => !c.startsWith('astro-')).slice(0, 2).join('.');
      const p = el.parentElement;
      if (p) { const idx = [...p.children].indexOf(el); s += ':nth-child(' + (idx + 1) + ')'; }
      parts.unshift(s); el = p;
    }
    return parts.join('>');
  };
  window.snap = async (label) => {
    const out = {};
    const els = document.body.querySelectorAll('*');
    for (const el of els) {
      if (el.closest('script,style,noscript')) continue;
      const cs = getComputedStyle(el);
      const vals = PROPS.map(p => cs.getPropertyValue(p));
      // rects are noisy inside animated regions; keep them elsewhere
      const animated = el.closest('svg,.app-track,.contact-form__status,[data-cal-namespace],iframe') || el.getAnimations().length;
      if (!animated) {
        const r = el.getBoundingClientRect();
        vals.push([r.x, r.y, r.width, r.height].map(v => Math.round(v)).join(','));
      }
      out[path(el)] = vals.join('|');
    }
    const key = `snap:${label}:${location.pathname}:${innerWidth}`;
    localStorage.setItem(key, JSON.stringify(out));
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(out)));
    return { key, count: Object.keys(out).length, hash: [...new Uint8Array(buf)].slice(0, 6).map(b => b.toString(16).padStart(2, '0')).join('') };
  };
  window.diffSnap = (a, b) => {
    const A = JSON.parse(localStorage.getItem(`snap:${a}:${location.pathname}:${innerWidth}`) || '{}');
    const B = JSON.parse(localStorage.getItem(`snap:${b}:${location.pathname}:${innerWidth}`) || '{}');
    const changes = [];
    for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
      if (A[k] === B[k]) continue;
      if (!A[k] || !B[k]) { changes.push({ el: k, note: !A[k] ? 'added' : 'removed' }); continue; }
      const av = A[k].split('|'), bv = B[k].split('|');
      const d = {};
      PROPS.forEach((p, i) => { if (av[i] !== bv[i]) d[p] = av[i] + ' -> ' + bv[i]; });
      if (av[PROPS.length] !== bv[PROPS.length]) d.rect = av[PROPS.length] + ' -> ' + bv[PROPS.length];
      changes.push({ el: k, d });
    }
    return { total: Object.keys(B).length, changed: changes.length, changes: changes.slice(0, 40) };
  };
  return 'snapshot helpers installed';
})();
