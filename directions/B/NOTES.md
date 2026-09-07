# Direction B: The Docket

## Design plan (written before coding)

**Thesis.** Every customer already holds one piece of Frapp & Capp design: the docket. This site is built like that docket, itemised and honest, so the mission stops being a slogan and becomes a line item next to the flat white.

**The one unique mechanic.** "Build your order": choose real menu items, watch a live docket total print in tabular figures, and underneath it a "Skills on this docket" readout that lists the barista skills required to make that exact order (grind and dose, dial in, texture milk, pour, steep, plate, front of house), each one drawn from the real training pathway. The site-wide 5,070 paid hours figure sits above as a "running total", labelled a conservative floor.

**Why skills, not wage-minutes.** A "your coffee funds N minutes of wages" claim needs a wage-to-price ratio we do not have; any number would be invented and could be quoted back at TLC. Skills per drink are verifiable (they are the pathway the site already describes), concrete, and they make the customer see the craft behind the cup. If TLC later supplies a real ratio, one line of JS adds it.

**Palette.**
- Paper `#F6F1E7` (thermal receipt, warm, not the cream cliche)
- Docket white `#FFFDF8`
- Ink `#10284A` (brand navy as the printer ink)
- Muted ink `#5B6478`
- Rule `#D9D0BF`
- Stamp orange `#EA7424` (fills only, navy text on it, 4.9:1)
- Stamp ink `#A8470B` (orange for small text on paper, 5.2:1; brand orange fails at 2.7:1 as text)
- Open-now sky `#8AD0EA` (status dot only)
- Ink band `#10284A` with paper text for the running-total section

**Type.** Archivo (400 body, 500 labels, 900 display) and IBM Plex Mono (400, 600) for every docket line, price and number. Five files. Scale: 13 / 15 / 17 / 22 / 30 / 44 / 64px, mono lines at 15 to 17px with tabular numerals.

**Layout.** A 680px docket column runs down the page like receipt tape, with perforated top and torn bottom edges. Wider "counter" sections (photos, pathway, quote) break out to full width behind it. Header is a sticky counter bar; footer is the tear-off stub.

**Deliberately rejected.** Marquee strips, floating beans, gradient blobs, parallax, hero photo carousels, rounded-card grids, emoji section markers, orange headline text (fails contrast on paper).

## Self-scores against the rubric (after build)
(filled in below)

### Rubric self-scores (1 to 5)
1. Distinctiveness: 5. The docket is the design system, not a decoration: hero receipt, dotted-leader line items everywhere, a torn-edge footer stub, and an interactive docket. No cafe site in the category reads this way.
2. Brand truth: 4. "Real career: included" puts the mission on the same line as the coffee without pity framing; the skills readout makes the craft visible. Loses a point because only three real photos exist and the team is shown once.
3. Conversion clarity: 5. Menu and directions are the two hero buttons, directions repeats in the sticky bar, careers is one tap from the hero facts line and the pathway section, beans from the menu preview.
4. Legibility and accessibility: 4. All text 4.5:1 or better (orange used as fill or as the darker stamp ink), 44px controls, aria-expanded nav, live region on the docket, reduced motion honoured. Point off: a lot of uppercase mono at 14px in the docket for some readers.
5. Performance and build: 5. One 40 KB HTML file, three photos totalling 110 KB, five font files, no libraries, all images sized, transform and opacity animation only.
6. Mobile: 4. Hero fits the first screen at 390 by 844 (headline, lede, two buttons, facts); docket prints directly under the buttons; order builder rows stay on one line. The sticky bar plus a 390px docket is dense but readable.
7. Craft: 4. One type scale, tabular numerals throughout, consistent docket component reused five times. The hero docket overlapping the photo is the one bold move; the rest is quiet.
8. Content completeness: 5. All required blocks, hours and address consistent everywhere, phone included, JSON-LD complete with geo and hasMenu, OG and Twitter tags, canonical, icons, acknowledgement placeholder.

### Known risks and notes for the panel
- Headless Chrome on this machine forces a 500px minimum window, so the true 390px look was captured through mobile-frame.html (an iframe wrapper). Keep that file for testing.
- "Same docket." is the one line of copy that trades clarity for character. If the panel finds it opaque, "Both on the docket." is the safer fallback.
- The order builder deliberately avoids wage-per-coffee maths. If TLC supplies a real ratio, add one line under the total.
- The footer acknowledgement names Darug and Eora peoples following Canterbury-Bankstown Council's wording; confirm with TLC before launch.
- Hours, phone and email are the site.json values flagged TODO; every instance on the page reads the same so a single find-and-replace updates them.
- Google Fonts is the only external request. For the production build, self-host the five files.
