# PHD Taxi Services - static site

18-page static site for PHD Taxi Services, pre-booked private hire based near Bodmin and
Luxulyan, Cornwall. No build step, no framework, no dependencies.

**Preview (GitHub Pages):** see repo Settings → Pages
**Production domain (when DNS is pointed):** https://www.phdtaxiservices.com/

## Structure

```
/                                 Home
/transfers/                       Transfers hub
  newquay-airport/ exeter-airport/ bristol-airport/
  plymouth/ southampton/ london-airports/
/day-tours/                       Day tours hub
  coastal/ historic/ custom/
/pricing/                         Guide prices & booking policies
/discover-cornwall/               Local-knowledge pillar page
/about/  /reviews/  /faq/  /contact/
assets/css/style.css              Single stylesheet, all components
assets/js/main.js                 Nav, scroll reveals, counters, accordion, booking form
llms.txt                          Plain-language business summary for AI crawlers
robots.txt                        Explicitly allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot
sitemap.xml                       Absolute URLs on www.phdtaxiservices.com
```

## Paths

Internal links and assets use **depth-relative** paths (`../../assets/...`), so the site renders
correctly from a GitHub Pages project URL, Cloudflare Pages, a subfolder, or the root domain
without any rewriting.

Canonical URLs, `og:url`, `og:image`, JSON-LD and `sitemap.xml` stay **absolute on
`https://www.phdtaxiservices.com/`**, with clean trailing-slash URLs (never `/index.html`).
That is deliberate: the preview tells search engines the real page lives on the production
domain, so the preview does not get indexed and compete with the live site.

There is **no `CNAME`** in this repo yet. `phdtaxiservices.com` still serves the Wix site;
add the CNAME only on go-live day, when DNS moves.

## Deploying elsewhere

Drag the repo contents into Cloudflare Pages (no build command, output directory `/`).
Clean URLs work out of the box - every page is `index.html` inside its own folder.

## Contact form

No backend. The booking form checks the four required fields, then composes a pre-filled
WhatsApp message via a `wa.me` deep link to 07494 073111. Nothing to host, nothing to
maintain.

## QA

See `ACCESSIBILITY-AUDIT.md` (WCAG 2.2 AA, verified in Chromium) and `UX-COPY-REVIEW.md`.
