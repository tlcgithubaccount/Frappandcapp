# Status (7 September 2026)

**Live since 7 Sep 2026.** GitHub Pages serves the `main` branch of tlcgithubaccount/Frappandcapp; the project is on the `source` branch; the previous site is kept on `backup-2026-09-07-design-tool-export`. To publish changes: edit on `source`, run `./deploy.sh "message"`.

## Done
- Audit of the old site (audits/../frapp-capp-audit report in ~/.claude/tmp/frappandcapp-audit and the published artifact).
- Round 1: three homepage directions built in parallel and scored (audits/r1/scoring.md). Winner: The Docket, with reading controls and live open status merged in from The Board.
- Round 2: design system (src/css/site.css, src/js/site.js, docs/DESIGN-SYSTEM.md), layout and partials, all seven pages plus 404, Open Graph images for every page, sitemap, robots, CNAME, GitHub Actions deploy workflow, single-file preview bundle.
- Round 3 polish: photo stamps never overlap captions, print-in animation capped at 600 ms, header handles bigger-text mode at every width, live stamp stays on one line.
- Checks: tools/htmlcheck.py passes on every page; 223 internal references, zero broken; Lighthouse results in audits/r2/lh.

## Confirm with TLC before launch (all in content/site.json)
1. Opening hours: 9:30am to 3pm Monday to Friday is used everywhere. The old site also said 9am in places and 2023 press said Monday to Saturday from 7am.
2. Phone: 1300 998 885 is TLC's main line. Use the cafe's own number if it has one.
3. Email: tlcdisability@gmail.com is live on the site. A branded address (hello@frappandcapp.com) is recommended.
4. Food items and prices (currently "Ask in store"), and the bean price.
5. Acknowledgement of country wording in the footer (currently Darug and Eora peoples, after Canterbury-Bankstown Council's wording).
6. Visit page: walking time from Bankstown station and parking specifics were deliberately left vague.
7. Our Story: "registered NDIS provider working across New South Wales" wording.

## Wire up
- formEndpoint in content/site.json: any endpoint that accepts a JSON POST (Formspree, Web3Forms, Basin). Until set, forms fall back to the visitor's email app and say so.
- gtmId in content/site.json: Google Tag Manager container id. Until set, no analytics loads.

## After deploy
- Search Console and Bing Webmaster Tools: verify, submit sitemap, request indexing for every URL.
- Links from tenderlovingcaredisability.com.au (nav or footer, plus the grand-opening media release), impact.tenderlovingcare.com.au, the Instagram bio and the Google Business Profile website field.
- Ask Hope 103.2 and Local News Plus to add the link to their existing articles.

## Known limitations
- The claude.ai artifact publisher refuses any bundle that includes the site scripts; a script-free stacked preview publishes fine (https://claude.ai/code/artifact/5cb3c939-fe0d-4105-a359-28c436ee6ce1). Interactive preview: python3 -m http.server 8765 --directory dist
- Photos are crops of existing social graphics. A short photo shoot (team at the machine, the shopfront, a bag of beans, the docket printer) would lift every page.
- The impact figure (5,070 hours) is the old site's computed floor. Replace with a real payroll number in content/site.json when available.
