# Frapp & Capp design system: "The Docket"

Every cafe prints a docket. The site is built like one: itemised, honest, and set in the cafe's own paper trail. This document is the contract for anyone building a page. Use only what is here; if a page needs something new, add it to `src/css/site.css` as a reusable component and document it here.

## Files

| Path | Purpose |
|---|---|
| `content/site.json` | Single source of truth for facts (name, address, hours, phone, email, socials, video, impact figure). Fields with `_note` are TODOs to confirm with TLC. Never hard-code a fact a build variable already provides. |
| `content/source-copy.md` | Copy from the live site, page by page. Reuse it; improve it; do not invent facts or prices. |
| `src/layout.html` | The shell: head, fonts, pre-paint reading prefs, header partial, `<main>`, footer partial, scripts. |
| `src/partials/nav.html`, `src/partials/footer.html` | Counter bar and tear-off stub. Shared by every page. |
| `src/css/site.css` | The whole design system. Page-specific CSS goes in `src/css/pages/<slug>.css` and is linked from the page's meta `extraHead`. |
| `src/js/site.js` | Progressive enhancement: nav, reading controls, live open status, print-in, order builder, forms, video facade. |
| `src/pages/<slug>.html` | Page content only (no html/head/body). Starts with a meta block. |
| `build.mjs` | `node build.mjs` writes `dist/` with clean URLs, sitemap, robots, CNAME, `.nojekyll` and `dist/preview.html`. |

## Page meta block

Every page starts with one HTML comment holding JSON:

```html
<!-- meta {"title":"Menu | Frapp & Capp, Bankstown","description":"140 to 155 characters with the suburb, the offer and a reason to click.","priority":0.9,"ogImage":"/assets/og-menu.jpg","extraHead":"<link rel=\"stylesheet\" href=\"/css/pages/menu.css\">","schema":{"@type":"Menu","name":"Frapp & Capp menu","url":"https://frappandcapp.com/menu/"}} -->
```

Fields: `title` (under 60 chars, include a place or offer word), `description` (140 to 155 chars), `priority` (sitemap, 0.5 to 1.0), `ogImage` (one exists per page in `/assets/og-<slug>.jpg`), `extraHead` (optional raw HTML for the head), `schema` (optional object or array merged into the JSON-LD `@graph` beside the site-wide CafeOrCoffeeShop node), `noindex` (true for pages that should not be indexed), `bodyClass` (defaults to `page-<slug>`), `ogType` (defaults to `website`). The slug is the file name; `/menu.html` builds to `/menu/`.

## Build variables (use these instead of typing facts)

`{{siteName}}` `{{address}}` `{{street}}` `{{suburb}}` `{{state}}` `{{postcode}}` `{{hoursDisplay}}` `{{hoursOpens}}` `{{hoursCloses}}` `{{hoursWeekend}}` `{{phone}}` `{{phoneTel}}` `{{email}}` `{{instagram}}` `{{facebook}}` `{{mapsUrl}}` `{{mapsEmbed}}` `{{youtubeId}}` `{{videoTitle}}` `{{opened}}` `{{parentName}}` `{{parentUrl}}` `{{impactHours}}` `{{year}}` `{{slug}}` `{{canonical}}`

They are substituted in page content as well as the layout.

## Rules

1. Clean URLs everywhere: `/menu/`, `/visit/`, `/shop-beans/`, `/our-story/`, `/careers/`, `/spin-win/`, `/`. Never link to `.html`.
2. One `h1` per page, then `h2`, `h3` in order. The page hero owns the `h1`.
3. Every `img` has `alt` (empty only when decorative), `width` and `height`. Real photos live in `/assets/`: `photo-barista.webp` (463x785), `photo-team.webp` (425x785), `photo-latte.webp` (780x720), `logo-mark.webp` (26x44 at display size, intrinsic 118x200), `bean.webp` (240x324). Lazy-load anything below the fold.
4. Type floor: running text 1rem (18px). Docket lines 0.9rem. Mono uppercase labels 0.72rem minimum and only for labels (eyebrows, stamps, group headings, column titles), never for sentences.
5. Colour: orange is a fill or an outline, never body text. Text on orange is navy. `--stamp-ink` (#A8470B) is the only orange allowed as text. Muted copy uses `--ink-2`, nothing lighter.
6. Australian English. No em dashes anywhere (use commas, full stops, colons). No invented facts, prices, names or quotes; anything uncertain is marked `<!-- TODO: confirm with TLC -->` in the source.
7. Motion is transform and opacity only, and only through `.print`. Nothing is hidden before it animates.
8. Interactive things need a 44px target, a visible focus state (inherited from `:focus-visible`), and must work without JS.
9. Forms use the `.form` markup below with `data-form`. Never hand-roll a mailto form.
10. Run `node build.mjs` then `python3 tools/htmlcheck.py dist/<slug>/index.html` before finishing. Both must pass. Look once with `tools/shots.sh http://localhost:PORT/<slug>/ audits/r2/<slug>` while `python3 -m http.server PORT --directory dist` is running.


> Type rule (client direction, 7 Sep): Fredoka for headings, the brand and buttons; Nunito for all supporting text; IBM Plex Mono stays inside dockets (lines, prices, stamps, running total) and nowhere else.

## Tokens

| Token | Light (default) | High contrast | Use |
|---|---|---|---|
| `--paper` | #F6F1E7 | #FFFFFF | page ground |
| `--docket` | #FFFDF8 | #FFFFFF | dockets, counter band, inputs |
| `--ink` | #10284A | #000000 | text, borders, buttons |
| `--ink-2` | #5B6478 | #000000 | secondary copy |
| `--rule`, `--rule-2` | #D9D0BF, #C9BEA8 | #000000 | rules, leaders |
| `--stamp` | #EA7424 | #A8470B | fills and stamp outlines |
| `--stamp-ink` | #A8470B | #A8470B | orange as text |
| `--sky` | #8AD0EA | #8AD0EA | open-now dot only |
| `--band`, `--band-text`, `--band-muted` | #10284A, #F6F1E7, #B7C0D1 | #000, #fff, #fff | ink band and footer |

Fonts: Fredoka 500/600/700 (headings, brand, buttons), Nunito 400/600/700/800 (body, nav, labels, forms, footer), IBM Plex Mono 400/600 (dockets, docket lines, prices, stamps, the running-total number only). Loaded once in the layout. `html[data-text="big"]` raises the root size 15 percent; `html[data-contrast="high"]` swaps the tokens. Both are set by the header toggles and remembered.

## Components (copy these exactly)

### Page hero (inner pages)
```html
<section class="page-hero" aria-labelledby="h1">
  <div class="wrap grid-2 wide-left center">
    <div>
      <p class="eyebrow">The menu</p>
      <h1 id="h1">Small menu. Made with care.</h1>
      <p class="lede">One or two sentences, under 52ch wide.</p>
      <div class="actions"><a class="btn btn-primary" href="{{mapsUrl}}" rel="noopener">Get directions</a><a class="btn" href="/visit/">Plan your visit</a></div>
    </div>
    <!-- optional: a .docket, .photo or nothing -->
  </div>
</section>
```

### Sections and grids
`<section class="section">` (80px padding), `.section-tight` (48px), `.section-flush` (bottom padding only), `.band` (ink band, light text), `.counter` (docket-white band with rules). Inside, `.wrap` (1200px), `.wrap-narrow` (680px, a single docket column), `.wrap-prose` (760px). Grids: `.grid-2`, `.grid-2.wide-left`, `.grid-2.wide-right`, add `.center` to vertically centre, `.grid-3`. Section intro: `<div class="section-head"><p class="eyebrow">..</p><h2>..</h2><p>..</p></div>`.

### Docket
```html
<div class="docket">                       <!-- add .tilt to rotate, .plain for a bordered flat version, .print for print-in -->
  <img class="docket-mark" src="/assets/logo-mark.webp" alt="" width="18" height="30">
  <div class="hd">Opening hours</div>     <!-- .hd.left for left-aligned -->
  <div class="sub">{{address}}</div>
  <hr class="rule">
  <div class="line"><span class="q">1</span><span class="lbl">Flat white</span><span class="dots"></span><span class="amt">4.90</span></div>
  <p class="desc">Optional one-line description under a line item.</p>
  <div class="line"><span class="lbl plain">Saturday</span><span class="dots"></span><span class="amt">Closed</span></div>   <!-- .lbl.plain keeps case; .line.closed mutes -->
  <div class="line total"><span class="lbl">Total</span><span class="dots"></span><span class="amt">4.90</span></div>
  <div class="fine">Small centred note.</div>   <!-- .fine.left -->
  <div class="thanks">Thank you. See you tomorrow.</div>
  <div class="body"><p>Running sans-serif text inside a docket when needed.</p></div>
</div>
```
`.amt.note` prints orange ("incl."). `.stamp-corner` positions a stamp top-right inside a docket. Several dockets in a column: wrap in `<div class="docket-list">`.

### Hours docket (live "today" marker)
Use `.docket.hours` with one `.line` per day carrying `data-day="1"` (Monday) to `data-day="0"` (Sunday); JS adds `.today`. Put a status span in the `.sub`: `<span class="status" data-open-status data-opens="{{hoursOpens}}" data-closes="{{hoursCloses}}" data-days="1,2,3,4,5">{{hoursDisplay}}</span>`. See the home page for the full block.

### Stamps
`<span class="stamp">Poured in Bankstown</span>` (rotated), `.stamp.flat`, `.stamp.big` (VOID size), `.stamp.live` with `data-open-status` for a live open dot. Inside `.photo`, a stamp sits bottom-left; add `.tr` for top-right.

### Buttons and links
`.btn` (outline), `.btn.btn-primary` (orange fill, navy text), `.btn.btn-ink` (navy fill), `.btn-sm`, `.btn-block`. Group in `<div class="actions">` (`.actions.tight` for less top margin). Inline mono link with arrow: `<a class="textlink" href="/careers/">Work with us</a>`.

### Steps (only for real sequences)
```html
<ol class="steps">
  <li><div><h3>We start with the person</h3><p>..</p></div></li>
</ol>
```
For non-sequential lists use `<ul class="list-rule">` with the same `li > div > h3 + p` shape, or `.list-rule.icons` with an inline `<svg>` as the first child of each `li` (36px, stroke inherits ink).

### Quote
```html
<blockquote class="quote">Before this job I'd never stood behind an espresso machine.</blockquote>
<cite class="who">Barista, Frapp &amp; Capp</cite>
```

### Photo frame
```html
<figure class="photo tall">    <!-- .tall 520px, default 420px, .short 300px -->
  <img src="/assets/photo-team.webp" alt="..." width="425" height="785" loading="lazy">
  <span class="stamp">On shift</span>
  <figcaption>Eileen and Salim on the machine at West Terrace.</figcaption>
</figure>
```

### Address, map, video
```html
<address class="addr"><b>Frapp &amp; Capp Coffee Shack</b><br>{{street}}<br>{{suburb}} {{state}} {{postcode}}<br><a href="tel:{{phoneTel}}">{{phone}}</a></address>
<div class="map"><iframe src="{{mapsEmbed}}" title="Map showing Frapp &amp; Capp at 1 West Terrace, Bankstown" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
<div class="video" data-video="{{youtubeId}}" data-title="{{videoTitle}}">
  <button class="video-play" type="button" aria-label="Play: {{videoTitle}}">
    <img src="/assets/story-photo.jpg" alt="" width="1280" height="720" loading="lazy">
    <span class="play">Play the film</span>
  </button>
</div>
```

### Chips (short facts)
`<ul class="chips"><li>Strawberry notes</li><li>Low acidity</li></ul>`

### Form (posts JSON to the configured endpoint, honest mailto fallback otherwise)
```html
<form class="form" data-form="careers" data-mailto-subject="Careers enquiry">
  <div class="field"><label for="name">Name</label><input id="name" name="name" type="text" autocomplete="name" required><span class="err" aria-live="polite"></span></div>
  <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="err" aria-live="polite"></span></div>
  <div class="field"><label for="phone">Phone <span class="opt">(optional)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
  <div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea><span class="hint">Tell us a bit about yourself.</span><span class="err" aria-live="polite"></span></div>
  <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
  <div class="form-actions"><button class="btn btn-primary" type="submit">Send enquiry</button><span class="muted">or email <a href="mailto:{{email}}">{{email}}</a></span></div>
  <p class="form-status" role="status" aria-live="polite"></p>
</form>
```
Field ids must be unique per page. The endpoint is `formEndpoint` in `content/site.json` (empty until TLC picks a service such as Formspree, Web3Forms or Basin; then set the URL and every form posts JSON with `form`, `page` and the field names).

### Order builder (home only, but reusable)
`<ul class="menu-list" id="menu-list">` with server-rendered `li.group` and `li.item.simple` rows (so it reads without JS), a `.docket.order-docket` with `#docket-lines`, `#altmilk`, `#docket-total`, `#docket-skills`, and a `<script type="application/json" id="order-items">` block. Static menu lists on other pages use the same `.menu-list` markup without ids.

### Header and footer
Come from the partials. Do not duplicate them in pages. The header carries the reading controls (`#toggle-text`, `#toggle-contrast`) and the mobile `#navtoggle`; the footer carries the live status and every contact fact via build variables.

## Checks before you finish
```
node build.mjs
python3 tools/htmlcheck.py dist/<slug>/index.html
python3 -m http.server 8790 --directory dist &   # then
tools/shots.sh http://localhost:8790/<slug>/ audits/r2/<slug>
```
