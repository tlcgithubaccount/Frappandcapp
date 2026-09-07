# Direction A: The Board

## Thesis
The cafe's own menu boards are high-contrast, large-type, with a simple illustration beside every item, made so the team can read them calmly. The website adopts that signage language as its entire visual system: the most legible cafe site in Australia, where legibility is the brand story because the site is built the way the cafe is built, for everyone.

## The unique mechanics
1. Today's board: a navy signboard in the hero that reads Sydney time (Intl, Australia/Sydney) and shows Open now until 3pm / Opens today at 9:30am / Closed, opens Monday 9:30am, plus the toastie slot and directions. Renders a correct static state without JS.
2. Reading controls in the header: Bigger text and High contrast, real buttons with aria-pressed, persisted in localStorage, applied before first paint by a two-line inline script. The default page already passes AA; these are for readers who want more.
3. Menu drawn as a board: navy panel, cream type, consistent 2.25px round-cap inline SVG line icons, dotted leaders and tabular numerals.

## Palette
- Cream ground #FBF0DA, espresso ink #33210F (13.9:1)
- Board navy #10284A with cream type (13:1), sky blue #8AD0EA (8.6:1 on navy) and orange #EA7424 (4.9:1 on navy) as accents on boards only
- Orange is never used as text on cream (2.7:1 fails); on cream it is a fill with espresso text (5.1:1) or a rule
- Status green: brand #3F9550 as a dot, darker #2A6E38 for text on cream (4.9:1)
- High contrast mode: white ground, black ink, black boards with white type, orange deepened to #B4500A (5.1:1 on white)

## Type
- Display: Lilita One (one weight, one file). Chosen over Fredoka (reads as a kids brand at scale) and Outfit (too corporate for painted signage). Lilita has the heavy, rounded, hand-painted stroke of a chalk-and-paint shop sign and stays crisp on navy.
- Body: Atkinson Hyperlegible 400 and 700, designed for low-vision readers. Three font files total.
- Scale (rem, base 18px): 1 / 1.111 / 1.333 / 1.777 / 2.4 / clamp display 2.8 to 5.2rem. Body line-height 1.6, min 18px, footer meta 17px.

## Layout
A stack of boards. Full-width panels alternate cream and navy; each board has a painted heading, an icon rail, and one action. Two columns on desktop where a board pairs with a photo or the Today's board; single column under 900px. Nav collapses to a Browse button under 768px.

## Deliberately rejected
- Moody dark photography hero: it is what every cafe does and it hides the people.
- Scroll-triggered reveals and parallax: they fight the calm the cafe promises.
- Orange text on cream: brand-faithful but fails contrast; moved orange to fills and to navy boards.
- A wheelchair glyph for the access block: replaced with a wide-door icon; the cafe's language is barrier-free, not medical.

## Build notes
- index.html is 44 KB. Images referenced: photo-barista (62 KB), photo-team (24 KB), photo-latte (24 KB), bean (17 KB), logo-mark (9 KB). Total transfer about 180 KB before fonts. Three font files.
- Head: title 57 chars, description 154 chars, canonical, OG and Twitter, theme-color, icons, full CafeOrCoffeeShop JSON-LD.
- Mobile check: Chrome headless enforces a minimum window width of about 500 px, so a direct 390 px screenshot is invalid. harness.html embeds the page in 390 px and 560 px iframes; shot-mobile.png is that harness. Panel should use the same trick.
- Fixed after the one look: grid-item min-width overflow, header wrapping on phones, impact tiles at 480 px, reading-bar label hidden under 600 px.

## Self-score against the rubric
1. Distinctiveness: 4. No cafe site uses signage legibility as its identity, with a live Today's board and reader controls. It is calmer than "blue ocean" usually implies; the risk is that it reads as sensible rather than daring.
2. Brand truth: 5. People and craft first, coffee credible through the menu board and bean facts, no pity framing; the access block turns the cafe's own signage story into the site's story.
3. Conversion clarity: 5. Menu, Find us, Join the team are the first three taps; directions is in the Today's board and again in Visit; Shop beans has its own board.
4. Legibility and accessibility: 5. 18 px body minimum, all text pairs computed at 4.5:1 or better, skip link, real toggle buttons with aria-pressed, Escape closes nav, reduced motion honoured.
5. Performance and build: 5. About 180 KB plus three font files, no scripts before content, sized images, no scroll-triggered opacity.
6. Mobile: 4. Single column with the board directly under the hero actions; reading bar costs 48 px at the top of every page.
7. Craft: 4. One display face used with restraint, consistent icon stroke, dotted leaders. Lilita One can tip towards playful; the navy boards keep it grounded.
8. Content and accuracy: 5. Every required block, hours and phone as flagged in site.json, TODO placeholders marked.

## Risks for the panel
- Lilita One is a strong flavour; if the client wants something quieter, Outfit 800 drops in with no layout change.
- The reading bar is a real commitment: it must ship on every page and its state must persist site-wide (it does, via localStorage).
- Today's board hard-codes 9:30am to 3pm in JS; when hours are confirmed both the JS constants and the schema must change together (make it one config value in the scaffold).
- No Saturday state beyond "closed, opens Monday"; if the cafe adds Saturday trading, the logic needs a table, not constants.
