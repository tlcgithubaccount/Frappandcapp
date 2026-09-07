# Round 1 panel scoring (7 Sep 2026)

Three homepage directions, same content, same assets, same brief. Scored 1 to 5 on eight criteria after reviewing code, desktop and true-390px renders, static HTML checks and Lighthouse (local, uncompressed server).

| Criterion | A: The Board | B: The Docket | C: Two People, One Bean |
|---|---|---|---|
| Distinctiveness | 4 | 5 | 4 |
| Brand truth | 5 | 4 | 5 |
| Conversion clarity | 5 | 5 | 4 |
| Legibility and accessibility | 5 | 4 | 4 |
| Performance and build | 5 | 5 | 5 |
| Mobile | 4 | 4 | 4 |
| Craft | 4 | 5 | 4 |
| Content completeness | 5 | 5 | 5 |
| **Total** | **37** | **37** | **35** |

Lighthouse (mobile / desktop): A 90/98 perf, 100 a11y; B 87/97 perf, 100 a11y; C 87/100 perf, 100/96 a11y. All 100 SEO and best practices. All under 230 KB. Local server has no gzip, so real-world perf will be higher.

## Notes per direction
**A.** The most legible cafe site any of us has seen: 18px Atkinson Hyperlegible body, painted-sign display, navy boards. Two mechanics are genuinely new and on-mission: reading controls (bigger text, high contrast) and a live Today's board. Weakness: the alternating panel layout is familiar, and the header stack is tall on phones.

**B.** The docket is a design system, not a decoration: hero receipt over the photo, dotted-leader lines everywhere, torn stub footer, rubber stamps, and a "build your order" interaction that prints the barista skills behind the order instead of an invented wage figure. "Great coffee. Real careers. Same docket." is a line the brand can keep. Weaknesses: small uppercase mono labels in places, and it reads slightly urban for an organisation whose whole point is inclusion.

**C.** Smart concept (the logo's two figures as a duet layout, duotone photo series, mark settling into a bean on load) and the calmest execution. Weakness: cream ground, serif display and orange buttons sit close to a look people have seen a lot lately, the desktop page underuses 1440px, and the pairing idea is subtle enough that most visitors will not notice it.

## Decision
**Build B, merge in A's two mechanics, and lift the type floor.**
1. Reading controls (Bigger text, High contrast) in the counter bar, persisted, applied before first paint.
2. Live open status in the hero stamp and footer (Sydney time): "Open now, until 3pm" / "Opens 9:30am" / "Opens Monday 9:30am".
3. Minimum sizes: body 18px, docket lines 16px, uppercase labels 13px with letter-spacing only where they are labels, never running text.
4. Keep B's Archivo + IBM Plex Mono, paper and navy palette, stamps and docket components.
5. From C: the mark printed at the top of every docket (real receipts carry the logo), and the acknowledgement of country in the footer stub.
6. The menu page becomes the full docket; the careers and beans pages carry the forms with a real endpoint hook.
