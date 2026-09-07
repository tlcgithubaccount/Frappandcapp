# Frapp & Capp website (rebrand)

Static, dependency-free site for frappandcapp.com. Built as "The Docket": the cafe's order docket is the design system.

## Structure
- `content/site.json`: every business fact (hours, phone, email, address, geo, menu, quotes). Single source of truth. Values marked `_note`/`TODO` need confirming with the cafe.
- `src/layout.html`: page shell. `src/partials/`: header (counter bar) and footer (tear-off stub). `src/pages/*.html`: one file per page, starting with a `<!-- meta {...} -->` block.
- `src/css/site.css`, `src/js/site.js`: the design system and its behaviour. `docs/DESIGN-SYSTEM.md` documents every component.
- `assets/`: photos (WebP), logo mark, icons, Open Graph images. `og/make-og.py` regenerates the OG images.
- `build.mjs`: assembles `dist/` (clean folder URLs, sitemap.xml, robots.txt, CNAME, 404.html, JSON-LD per page) and `dist/preview.html` (single-file bundle for review).
- `tools/`: `audit.sh` (Lighthouse on every page), `htmlcheck.py` (static checks), `shots.sh` and `mobile-frame.html` (screenshots; headless Chrome needs the 390px iframe harness).
- `directions/`: the three round 1 concepts and `audits/r1/scoring.md`, kept for the record.

## Build and check
```
node build.mjs
python3 tools/htmlcheck.py dist/index.html dist/*/index.html
tools/audit.sh "$PWD/dist" "$PWD/audits/r2" / /menu/ /visit/ /shop-beans/ /our-story/ /careers/ /spin-win/
```
Serve locally with `python3 -m http.server 8765 --directory dist`.

## Configure before launch
1. `content/site.json`: confirm `hours`, `phone`, `email` (a branded address is recommended), food items and prices, bean price.
2. `formEndpoint`: create a form endpoint (Formspree, Web3Forms or Basin all work with a plain POST) and paste the URL. Until then, forms fall back to opening the visitor's email app and say so.
3. `gtmId`: paste the Google Tag Manager container id to enable analytics. Add GA4 inside GTM with events for directions clicks, form submissions and Spin & Win.
4. Footer acknowledgement of country wording: confirm with TLC.

## Deploy (GitHub Pages)
The DNS for frappandcapp.com already points at GitHub Pages (`tlcgithubaccount.github.io`).
1. Push this folder to the repository that serves the domain (or a new repo with the custom domain set to frappandcapp.com in Settings, Pages).
2. In Settings, Pages, set Source to "GitHub Actions". The workflow in `.github/workflows/deploy.yml` builds `dist/` and deploys it on every push to `main`.
3. `dist/CNAME` is written by the build so the custom domain sticks.
4. After the first deploy: verify the domain in Google Search Console, submit `https://frappandcapp.com/sitemap.xml`, request indexing for each URL, and update the Instagram bio and Google Business Profile website field.

## Why it is built this way
The previous site was a design-tool export: content only existed after JavaScript ran, pages weighed 1 to 3 MB, and forms went nowhere. This build ships real HTML, under 250 KB a page, with schema, Open Graph images, a working form hook and analytics hook, and passes Lighthouse accessibility at 100. See `audits/` for the numbers.
