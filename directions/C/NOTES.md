# Direction C: Two People, One Bean

## Design plan (written before code)

**Thesis.** The Frapp & Capp mark is two people whose bodies make one coffee bean. That is also how the cafe works: every cup is a pair, a barista building a craft and a customer who came in for a coffee. This direction turns the mark into the page's layout system so the mission is told by structure, not by a paragraph.

**Unique mechanic.** The duet: every major section is a two-panel composition with a seam between them and the mark sitting on the seam. Hero pairs photo with statement, pathway pairs trainer with trainee, menu pairs each cup with the skill it teaches, story pairs a quote with a photo, visit pairs the counter with the access promise. On load the two figures of the mark drift together into the bean (transform only, 0.9 s, skipped under reduced motion). Photos are tinted in the mark's blue and yellow so the three real images read as one series; hover or focus reveals full colour.

**Palette.**
- Cream ground #FBF3E3, second ground #F4E8CF
- Espresso ink #2B1B0E, muted ink #6B4E2E (6.5:1 on cream)
- Logo blue #8AD0EA and pale blue field #E4F3FA; navy #10284A for text on blue
- Logo yellow #F4C24C and pale yellow field #FBEFCF
- Orange #EA7424 for actions only, with espresso text on orange fills (5.9:1)

**Type.** Fraunces (display, optical size and weight axes, 600 and 700) for headlines: a warm, slightly wonky serif that feels like a cafe chalkboard hand without pastiche, and it sets numerals with character for the impact figure. Figtree (400, 500, 600) for body and UI: geometric-humanist, very legible at 16 to 18px, friendly rather than corporate. Scale: 15 / 17 / 20 / 26 / 34 / 48 / 72 with fluid clamps.

**Layout.** 1200px container. Sections alternate cream, pale blue and pale yellow fields with asymmetric bean-curve top edges. Every duet is a CSS grid of two panels with a hairline seam; on mobile the panels stack and the seam becomes a short curved divider carrying the mark.

**Deliberately rejected.** A photographic full-bleed hero (only three real photos exist, and a big mood shot is what every cafe does). Orange as a page colour (it is loud; reserved for the four actions). Numbered section markers everywhere (only the pathway is a true sequence). Parallax and scroll-triggered reveals.

## Self-audit after the one look

Rendered at 1440 and at a true 390px viewport (headless Chrome enforces a 500px minimum window, so the mobile capture was taken through a 390px iframe). Everything reads at rest; the mark settles in 0.9 s and is static under reduced motion. One fix pass: added a tap toggle for the duotone reveal so the caption's promise holds on touch screens.

| Rubric | Score | Note |
|---|---|---|
| Distinctiveness | 5 | The duet grid, seam marks, bean-curve fields and blue and yellow photo series come straight from the logo; no cafe template looks like this. |
| Brand truth | 5 | People and craft carry every section; "the skill in the cup" makes the mission concrete without pity. |
| Conversion clarity | 4 | Menu, directions and careers are in the first screen on both sizes; beans are only in nav and footer. |
| Legibility and accessibility | 4 | All text pairs pass 4.5:1 (ink on cream 13:1, muted ink 6.5:1, espresso on orange 5.9:1, white on navy 12:1). Skip link, one h1, ordered headings, alt text, sized images, focus rings, reduced motion. Not yet screen-reader tested. |
| Performance and build | 5 | HTML 33 KB, images 108 KB, two variable fonts. No layout shift risk: every image has dimensions. No frameworks. |
| Mobile | 4 | Nav collapses to a real button; hero fits 844px; duets stack with the curved seam. Long pathway list makes the mobile page tall. |
| Craft | 4 | Consistent 1px seams, one radius family, two type faces on a fixed scale. Hero text column could use one more beat of air above the buttons. |
| Content completeness | 5 | Every required block, JSON-LD with all fields, OG and Twitter tags, canonical, icons. |

## Known risks
- The three real photos are crops of social graphics; the tint hides some softness but full-colour reveal shows it. A proper photo shoot would lift this direction most.
- Fraunces is a variable font (about 90 KB per subset); acceptable, but if the budget tightens, swap to a static 600 weight only.
- mix-blend-mode multiply is unsupported in forced-colours mode and old Android WebViews; the tint layer is simply hidden there and full colour shows.
- The "skill in the cup" copy is plausible but should be checked with the trainers so it is true, not just nice.
