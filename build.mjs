#!/usr/bin/env node
// Zero-dependency static site build for frappandcapp.com.
// src/pages/*.html  -> dist/<slug>/index.html (index -> dist/index.html, 404 -> dist/404.html)
// src/layout.html   -> shell with {{placeholders}}
// src/partials/*    -> {{partial:name}}
// assets/, src/css, src/js -> copied
// Also writes sitemap.xml, robots.txt, CNAME, .nojekyll and dist/preview.html (single-file bundle for review).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, statSync, existsSync, rmSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const SRC = join(ROOT, 'src'), DIST = process.env.OUT_DIR ? (process.env.OUT_DIR.startsWith('/') ? process.env.OUT_DIR : join(ROOT, process.env.OUT_DIR)) : join(ROOT, 'dist'), ASSETS = join(ROOT, 'assets');
const site = JSON.parse(readFileSync(join(ROOT, 'content/site.json'), 'utf8'));
const ORIGIN = site.domain;
const today = new Date().toISOString().slice(0, 10);

const read = (p) => readFileSync(p, 'utf8');
const layout = read(join(SRC, 'layout.html'));
const partials = Object.fromEntries(readdirSync(join(SRC, 'partials')).filter(f => f.endsWith('.html')).map(f => [basename(f, '.html'), read(join(SRC, 'partials', f))]));

function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) {
    const s = join(from, f), d = join(to, f);
    if (statSync(s).isDirectory()) copyDir(s, d); else copyFileSync(s, d);
  }
}

function parsePage(file) {
  const raw = read(file);
  const m = raw.match(/^\s*<!--\s*meta\s*(\{[\s\S]*?\})\s*-->/);
  if (!m) throw new Error(`No meta block in ${file}`);
  const meta = JSON.parse(m[1]);
  const content = raw.slice(m[0].length).trim();
  meta.slug ??= basename(file, '.html');
  return { meta, content };
}

function schemaFor(meta) {
  const base = {
    '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', '@id': ORIGIN + '/#cafe',
    name: site.name, url: ORIGIN + '/', description: site.description,
    telephone: site.phone.tel, email: site.email, image: ORIGIN + '/assets/og-home.jpg', priceRange: '$', servesCuisine: 'Coffee',
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.suburb, addressRegion: site.address.state, postalCode: site.address.postcode, addressCountry: site.address.country },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes }],
    hasMenu: ORIGIN + '/menu/', sameAs: [site.instagram, site.facebook, site.parent.url],
    parentOrganization: { '@type': 'Organization', name: site.parent.name, url: site.parent.url },
    foundingDate: site.opened,
  };
  const graph = [base];
  if (meta.schema) graph.push(...[].concat(meta.schema));
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph.map(g => { const { '@context': _, ...rest } = g; return rest; }) }, null, 0);
}

function render(page) {
  const { meta, content } = page;
  const path = meta.slug === 'index' ? '/' : meta.slug === '404' ? '/404.html' : `/${meta.slug}/`;
  const vars = {
    title: meta.title, description: meta.description, canonical: ORIGIN + path,
    ogImage: ORIGIN + (meta.ogImage || '/assets/og-home.jpg'), ogType: meta.ogType || 'website',
    bodyClass: meta.bodyClass || `page-${meta.slug}`, slug: meta.slug, year: String(new Date().getFullYear()),
    schema: schemaFor(meta), extraHead: meta.extraHead || '', content, robots: meta.noindex ? '<meta name="robots" content="noindex">' : '',
    siteName: site.name, phone: site.phone.display, phoneTel: site.phone.tel, email: site.email, instagram: site.instagram, facebook: site.facebook,
    hoursDisplay: site.hours.display, hoursOpens: site.hours.opens, hoursCloses: site.hours.closes, hoursWeekend: site.hours.weekend,
    address: `${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`, street: site.address.street, suburb: site.address.suburb, state: site.address.state, postcode: site.address.postcode,
    mapsUrl: site.mapsUrl, mapsEmbed: site.mapsEmbed, youtubeId: site.video.youtubeId, videoTitle: site.video.title, opened: site.opened, parentName: site.parent.name, parentUrl: site.parent.url,
    formEndpoint: site.formEndpoint || '', gtmId: site.gtmId || '', impactHours: Number(site.impact['valueOn2026-09-07']).toLocaleString('en-AU'),
  };
  const sub = (s) => s.replace(/\{\{([a-zA-Z]+)\}\}/g, (_, k) => vars[k] ?? '');
  vars.content = sub(content);
  let html = layout.replace(/\{\{partial:([a-z0-9-]+)\}\}/g, (_, n) => partials[n] ?? '');
  html = sub(html);
  // current page marker in nav
  html = html.replace(new RegExp(`(<a[^>]*data-nav="${meta.slug}")`), '$1 aria-current="page"');
  return { path, html };
}

// ---- build ----
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
copyDir(ASSETS, join(DIST, 'assets'));
if (existsSync(join(SRC, 'css'))) copyDir(join(SRC, 'css'), join(DIST, 'css'));
if (existsSync(join(SRC, 'js'))) copyDir(join(SRC, 'js'), join(DIST, 'js'));

const pages = readdirSync(join(SRC, 'pages')).filter(f => f.endsWith('.html')).map(f => parsePage(join(SRC, 'pages', f)));
const built = [];
for (const page of pages) {
  const { path, html } = render(page);
  const out = path === '/' ? join(DIST, 'index.html') : path === '/404.html' ? join(DIST, '404.html') : join(DIST, page.meta.slug, 'index.html');
  mkdirSync(join(out, '..'), { recursive: true });
  writeFileSync(out, html);
  built.push({ path, slug: page.meta.slug, title: page.meta.title, html, noindex: !!page.meta.noindex, priority: page.meta.priority ?? 0.7 });
  console.log('built', path, `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

// sitemap, robots, CNAME, .nojekyll
const sm = built.filter(p => p.slug !== '404' && !p.noindex).map(p => `  <url><loc>${ORIGIN}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm}\n</urlset>\n`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
writeFileSync(join(DIST, 'CNAME'), ORIGIN.replace(/^https?:\/\//, '') + '\n');
writeFileSync(join(DIST, '.nojekyll'), '');

// ---- single-file preview bundle (for review artifacts) ----
const mime = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const dataUri = (p) => { const f = join(DIST, p.replace(/^\//, '')); if (!existsSync(f)) return null; const ext = extname(f).toLowerCase(); if (!mime[ext]) return null; return `data:${mime[ext]};base64,${readFileSync(f).toString('base64')}`; };
const inlineAssets = (s) => s.replace(/(["'(])\/(assets\/[^"')\s]+)/g, (m, q, p) => { const d = dataUri('/' + p); return d ? q + d : m; });
const home = built.find(p => p.slug === 'index');
let css = existsSync(join(DIST, 'css/site.css')) ? inlineAssets(read(join(DIST, 'css/site.css'))) : '';
if (existsSync(join(DIST, 'css/pages'))) for (const f of readdirSync(join(DIST, 'css/pages')).filter(f => f.endsWith('.css'))) css += '\n/* ' + f + ' */\n' + inlineAssets(read(join(DIST, 'css/pages', f)));
const js = existsSync(join(DIST, 'js/site.js')) ? read(join(DIST, 'js/site.js')) : '';
const head = home.html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<link[^>]+rel="stylesheet"[^>]+href="\/css\/site\.css"[^>]*>/, `<style>${css}</style>`)
  .replace(/<script[^>]+src="\/js\/site\.js"[^>]*><\/script>/, '')
  .replace(/<link rel="canonical"[^>]*>/, '').replace(/<meta property="og:[^>]*>/g, '').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
const shellBody = home.html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
const headerPart = shellBody.match(/([\s\S]*?)<main[\s>]/)[1];
const footerPart = shellBody.match(/<\/main>([\s\S]*)$/)[1].replace(/<script[^>]+src="\/js\/site\.js"[^>]*><\/script>/, '');
const idCounts = {};
for (const p of built.filter(p => p.slug !== '404')) for (const id of new Set([...(p.html.match(/<main[\s\S]*?<\/main>/)[0]).matchAll(/ id="([^"]+)"/g)].map(m => m[1]))) idCounts[id] = (idCounts[id] || 0) + 1;
const dupIds = new Set(Object.keys(idCounts).filter(k => idCounts[k] > 1));
const mains = built.filter(p => p.slug !== '404').map(p => {
  let main = p.html.match(/<main[\s\S]*?<\/main>/)[0];
  // de-duplicate ids across bundled pages (id="x" -> id="x-slug", and same-page references to it)
  const ids = [...new Set([...main.matchAll(/ id="([^"]+)"/g)].map(m => m[1]))].filter(id => dupIds.has(id));
  for (const id of ids) main = main.replace(new RegExp(`(id|for|aria-labelledby|aria-describedby|aria-controls)="${id}"`, 'g'), `$1="${id}-${p.slug}"`).replace(new RegExp(`href="#${id}"`, 'g'), `href="#${id}-${p.slug}"`);
  const scripts = (p.html.match(/<\/main>([\s\S]*)<\/body>/)?.[1] || '').match(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/g) || [];
  return `<div class="pv-page" data-page="${p.slug}" data-title="${p.title.replace(/"/g, '&quot;')}" hidden>${main}${scripts.join('')}</div>`;
}).join('\n');
const router = `<script>
(function(){
  var pages=[].slice.call(document.querySelectorAll('.pv-page'));
  function slugFromHash(){ var h=location.hash.replace(/^#\\/?/,'').replace(/\\/$/,''); return h===''?'index':h.split('#')[0].split('?')[0]; }
  function show(){ var s=slugFromHash(); var found=false;
    pages.forEach(function(p){ var on=p.dataset.page===s; p.hidden=!on; if(on){found=true; document.title=p.dataset.title;} });
    if(!found){ pages.forEach(function(p){ p.hidden=p.dataset.page!=='index'; }); }
    document.body.className=document.body.className.replace(/page-[a-z0-9-]+/g,'')+' page-'+s;
    document.querySelectorAll('[data-nav]').forEach(function(a){ if(a.dataset.nav===s) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    var nav=document.querySelector('[data-nav-panel]'); if(nav){ nav.hidden=true; var b=document.querySelector('[aria-controls="'+nav.id+'"]'); if(b) b.setAttribute('aria-expanded','false'); }
    window.scrollTo(0,0);
  }
  document.addEventListener('click',function(e){ var a=e.target.closest('a[href]'); if(!a) return; var h=a.getAttribute('href');
    if(/^\\/(?!\\/)/.test(h)&&!/\\.(xml|txt|pdf|jpg|png|webp|ico)$/.test(h)){ e.preventDefault(); var slug=h.replace(/^\\//,'').replace(/\\/$/,''); location.hash= slug ? '#/'+slug+'/' : '#/'; } });
  window.addEventListener('hashchange',show); show();
})();
</script>`;
const preview = `<!doctype html>\n<html lang="en-AU">\n<head>${head}<meta name="robots" content="noindex"></head>\n<body class="page-index preview">${inlineAssets(headerPart)}\n${inlineAssets(mains)}\n${inlineAssets(footerPart)}\n<script>${js}</script>\n${router}\n</body>\n</html>`;
writeFileSync(join(DIST, 'preview.html'), preview);
console.log('preview.html', `${(Buffer.byteLength(preview) / 1024).toFixed(0)} KB`);
console.log('done:', built.length, 'pages');
