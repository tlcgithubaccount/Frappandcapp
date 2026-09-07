# Frapp & Capp rebrand: design brief (round 1, homepage directions)

## Why we are doing this
The current site (frappandcapp.com) is a design-tool export: invisible to crawlers, 1 to 3 MB per page, 13 s mobile paint, mailto-only forms, no analytics. The full audit is at ~/.claude/tmp/frappandcapp-audit/frapp-capp-audit.html. The client wants a complete rebrand that is "blue ocean": a cafe site that does not look or behave like any other cafe site, and is of the highest quality. Three directions are being built in parallel by three designers. A review panel will score them against the rubric below and one will be built out into the full site. Build only your own direction.

## The business (facts, do not change)
See content/site.json for every fact, the menu, hours, address, geo, quotes and the training pathway. Source copy from the live site is in content/source-copy.md; you may rewrite it, but keep every fact and keep the voice: warm, plain, confident, never pitying. The people are colleagues with careers, not beneficiaries.

- Frapp & Capp is a specialty coffee cafe at 1 West Terrace, Bankstown NSW 2200, opened 10 May 2023, run by TLC Disability Services as a social enterprise. It trains and employs people with disability as baristas at award wages.
- Hours: Mon to Fri 9:30am to 3pm (flagged TODO to confirm). Phone 1300 998 885 (TLC main line, TODO confirm). Email tlcdisability@gmail.com. Instagram @frappandcapp. Hashtag #FrappAndCapp.
- Impact figure: 5,070 hours of paid employment (a computed conservative floor; label it as such).
- Do not invent prices, names of staff, awards, statistics, or quotes. Where a figure is unknown, use "Ask in store" or a clearly marked placeholder.
- No em dashes anywhere (client rule). Use commas, full stops or colons. Australian English spelling.

## Brand assets (all in ../../assets/ relative to your directions/X/index.html)
- logo-mark.png 498x836 (also logo-mark.webp 200x336): the mark is two figures, one light-blue body and one yellow body with orange heads, that together form the silhouette of a coffee bean. Two people, one bean. This is the strongest idea the brand owns.
- icon-32/180/192/512.png, favicon.ico: the mark on a transparent square.
- photo-barista.webp 463x785: a barista in a black Frapp & Capp T-shirt, arms on hips, smiling behind the counter with the espresso machine and tip jar. Portrait orientation.
- photo-team.webp 425x785: two baristas (aprons read Eileen and Salim) at the machine, one placing lids on cups. Portrait.
- photo-latte.webp 780x720: hands holding a cappuccino as a rosetta is poured. Landscape.
- bean.webp 240x324: a single roasted bean, transparent background.
- The three photos are the only real photography. Do not use stock. Where a layout needs more images, use typographic or illustrated (inline SVG) treatment, or repeat the real photos with different crops via object-fit and object-position.

Live-site brand colours (use, extend, or deliberately depart from them, but say why in NOTES.md): navy #10284A, orange #EA7424, deep orange #DC7A2A, soft orange #EF9B44, sky blue #8AD0EA, tan #DCC9A3, yellow #F4C24C, cream #FBF0DA, espresso #33210F, mocha #9C7B4F, open-now green #3F9550. Live-site type: Outfit (display) and Plus Jakarta Sans (body). You may keep or replace them; Google Fonts only; at most two families and five font files.

## Hard constraints (every direction)
1. One self-contained file: directions/X/index.html with inline CSS and minimal vanilla JS. No frameworks, no CDN scripts. Google Fonts via one link tag with display=swap and a preconnect. Assets referenced as ../../assets/....
2. Semantic HTML: html lang="en-AU", skip link, header/nav/main/section/footer, exactly one h1, no skipped heading levels, every img with alt (empty alt only for decoration) and width and height attributes, loading="lazy" below the fold.
3. Accessibility: text contrast 4.5:1 or better (3:1 for large text), visible focus styles, 44px tap targets, keyboard-operable nav, prefers-reduced-motion respected, no content that only appears on hover.
4. Mobile first: nav collapses to a button under 768px (use a real button with aria-expanded, no checkbox hacks), the hero fits within the first screen on a 390x844 phone without a 100vh trick, no horizontal scroll at 320px.
5. Performance: total transfer under 350 KB excluding fonts, no layout shift, no blocking scripts, animations on transform and opacity only.
6. Head: title under 60 chars with "cafe" and "Bankstown" in it, meta description 140 to 155 chars, canonical https://frappandcapp.com/, Open Graph and Twitter card tags with og:image ../../assets/og-home.jpg (a 1200x630 image will be generated later), theme-color, icons. JSON-LD CafeOrCoffeeShop with name, url, telephone, email, image, address, geo, openingHoursSpecification, priceRange, servesCuisine, sameAs (Instagram and Facebook), parentOrganization, hasMenu (https://frappandcapp.com/menu/).
7. Links: the full site will use clean folder URLs. Link to /menu/, /visit/, /shop-beans/, /our-story/, /careers/, /spin-win/ and / for home.
8. Content the homepage must carry, in whatever order and form your thesis dictates: a hero with the value proposition and primary actions (directions or visit, menu, careers or enquiry), the impact figure with its "conservative floor" caveat, the training pathway or craft story, a menu preview of at least three items, a people or story moment (quote or photo), a visit block (address, hours, directions link), and a footer with site nav, contact, Instagram, parent organisation and an acknowledgement line placeholder.
9. Copy quality: specific, active, no marketing filler, no generic "welcome to our website". Headlines earn their size.
10. Show the page at rest: nothing important hidden behind scroll-triggered opacity.

## Rubric the panel will score (1 to 5 each)
1. Distinctiveness: could this be mistaken for a template cafe site? Is there a mechanic, structure or visual system no competitor has?
2. Brand truth: does it express "great coffee, real careers" with people first and coffee credible, without pity framing?
3. Conversion clarity: are directions, menu, careers and beans reachable within one glance and one tap on mobile?
4. Legibility and accessibility: contrast, type size, hierarchy, keyboard, reduced motion.
5. Performance and build quality: weight, CLS, clean HTML, no hacks.
6. Mobile: first screen, nav, tap targets, rhythm at 390px.
7. Craft: type scale, spacing, alignment, consistency of repeated elements, restraint.
8. Content completeness and accuracy: all required blocks, correct facts, schema, OG.

## Process for each designer
- Read content/site.json and content/source-copy.md first.
- Write a short design plan in directions/X/NOTES.md before coding: thesis in two sentences, the one unique mechanic, palette (named hex), type pairing and scale, layout concept, what you deliberately rejected.
- Build index.html.
- Look once: render a screenshot with headless Chrome and fix what it shows. Command that works on this machine (run it in the foreground; it exits on its own):
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --timeout=15000 --virtual-time-budget=4000 --window-size=1440,900 --screenshot=/full/path/directions/X/shot-desktop.png file:///full/path/directions/X/index.html
  and again with --window-size=390,844 --screenshot=.../shot-mobile.png. Do not loop on screenshots; one look, one fix pass.
- Finish NOTES.md with a self-score against the rubric and known risks. Report back with the thesis, the unique mechanic, and anything the panel should know.
