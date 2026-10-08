# GO Tours website (rebuild)

Static site. The old WordPress site at gotours.org is untouched.

- `node build.js` regenerates every .html page. Edit content in build.js, styles in assets/style.css, behavior in assets/site.js.
- Preview: `python -m http.server 8080` then open http://localhost:8080
- Icons: Lucide (ISC license), inlined as SVG in build.js. Font: Outfit (Google Fonts, OFL).
- Palette: navy #1d2660, orange #bf5700. Orange only on white; white or navy on dark backgrounds. No emojis.

## Popular trip itineraries
- `featured-trips.js` holds full day-by-day trips (copy and photos from our WeTravel trip pages, no prices or dates). Each one builds to `<slug>.html`, shows on the homepage and in the Destinations menu, and its "Schedule this trip for my group" button opens `get-a-quote.html?trip=<slug>` with the form prefilled.
- To add a trip: put its photos in `images/<dir>/`, add an entry to `featured-trips.js`, run `node build.js`.

## Pending integrations
- Zoho forms: contact.html and get-a-quote.html (form[data-zoho], handler in assets/site.js)
- WeTravel reviews API: #wetravel-reviews on index.html and testimonials.html
- Tour overview downloads on each tour page
- Tour page copy is draft, please review
- Founder photo: the old site image (mr.lambert-2.jpg) is a dead link (404). Add images/nathan.jpg and restore the photo card in build.js about page.
- Testimonials: all 31 live in testimonials.json (pulled verbatim from gotours.org).
