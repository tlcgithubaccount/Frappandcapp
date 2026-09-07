# Round 2 page briefs

Every page: follow docs/DESIGN-SYSTEM.md exactly (components, tokens, meta block, build vars). Content facts from content/site.json only; copy from content/source-copy.md, improved per the audit. Clean URLs. One h1. Title under 60 chars with "Bankstown" or "Frapp & Capp"; description 140 to 155 chars. Each page's OG image exists at /assets/og-<slug>.jpg; set "ogImage" in meta. No em dashes. Australian English. Do not invent facts, prices or names. Page-specific CSS goes in src/css/pages/<slug>.css linked via meta extraHead; page-specific JS inline at the end of the page content, guarded so it does nothing when its elements are absent (the preview bundle loads every page's script at once).

## menu (priority 0.9, schema: Menu with MenuSection and MenuItem for every item, offers with AUD prices)
- h1 in the docket voice ("Small menu. Big craft." works). The whole menu is one long docket: sections Coffee, Tea, Cold drinks, Food, Milks and dietary. Every item a docket line with price in tabular mono. Size and alt-milk rules as docket notes. Food section uses "Ask in store" where the price is unknown, with a short line inviting people to ask about today's toastie.
- A "skill in the cup" note on three or four items (from B's skills map) as small print lines.
- Cross-links: Shop Beans (house blend card), Visit (hours line with live status), Careers (one line).
- Optional: a "print this menu" button that triggers window.print with a print stylesheet that shows the docket only.

## visit (priority 0.9, schema: none beyond the base cafe; add "hasMap" via extra property in base if easy)
- h1 "First coffee's a good excuse." or "Come in, sit down, stay a while."
- Docket with address, hours table for all seven days (Sat and Sun closed), live status, phone (tel link), email, Get directions (mapsUrl), and the Google Maps embed (mapsEmbed) in an iframe with title, loading="lazy", 16:10 frame, below the docket so it never blocks first paint.
- "Getting here" block: Bankstown station is a short walk (do not state minutes unless certain; say "a short walk from Bankstown station"), parking: say "street parking nearby" only; public transport: buses and trains at Bankstown interchange. Keep claims modest and mark anything uncertain in an HTML comment for TLC to confirm.
- Access block from site.json (barrier-free, calm boards, take your time). Link to Spin & Win as an in-store extra.

## shop-beans (priority 0.8, schema: Product "The House Blend" with brand Frapp & Capp, description, image /assets/og-shop-beans.jpg, offers availability InStoreOnly, no invented price)
- h1 "The House Blend." Docket of bean facts (Arabica, roast, notes, bag). Photo-latte frame with stamp "Roasted in-house".
- Why-buy block (funds paid hours, TLC Impact Foundation line), wholesale and events, stock it in your store.
- Enquiry form (data-form): name, email, message, subject hidden field "House Blend enquiry". Success and error states per the design system. Honest fallback copy when no endpoint.

## our-story (priority 0.7, schema: VideoObject for the Helping Hands feature: name, description, thumbnailUrl https://i.ytimg.com/vi/{{youtubeId}}/hqdefault.jpg, uploadDate unknown so omit, embedUrl https://www.youtube-nocookie.com/embed/{{youtubeId}})
- h1 "Coffee was never really the point." Opening paragraph from source. Pathway as a numbered docket (this is a true sequence). Two quotes as docket "notes from the team". Video: a click-to-load facade (thumbnail image from assets/photo-latte or the YouTube thumbnail, a real button "Watch the Helping Hands feature", loads the youtube-nocookie iframe on click; no autoplay, no third-party request before click). Press mentions (Hope 103.2, Local News Plus, Helping Hands) as a short docket of links, rel noopener. Parent organisation line and link. Close with the careers line.

## careers (priority 0.8, schema: JobPosting is only allowed if a real vacancy exists, so do not add it; add a FAQPage with three or four real questions answered from site.json content: who it is for, wages, training, how to apply)
- h1 "Your first real job could start with a shift here." What you get (training, award wages, support), how to apply as a three-step docket, an FAQ using details/summary, and the application form (data-form): name, email, phone, message, plus an optional "Best way to contact me" select (email, phone, text). Plain-language throughout, no jargon, sentences short. Say support workers and family are welcome to help with the form.

## spin-win (priority 0.5, noindex false, schema none)
- Port content/spin-win-source.html into the design system: same prizes and odds logic, wheel drawn in brand colours, keyboard operable (a real button to spin, result in an aria-live region), reduced-motion path shows the result without the long spin. The result card is a docket ("PRIZE DOCKET") the barista can read. Keep the "show the barista" instruction and the back link to Visit.
