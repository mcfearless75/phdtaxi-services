# PHD Taxi Services - UX Copy Review

Scope: voice, consistency, clarity and CTA quality across all 18 pages. Prices, policies
and distances are locked by the brief's facts table and were not re-litigated here.

---

## 1. One action, several labels - FIXED

| Action | Before | After |
|---|---|---|
| WhatsApp, primary CTA | `Book with WhatsApp` ×17 | **`Book on WhatsApp`** - natural British phrasing; "book *with* WhatsApp" reads as booking the app |
| WhatsApp, compact (nav, sticky bar) | `WhatsApp` ×55 | unchanged |
| Phone, compact | `Call` ×19, `Call Now` ×18 | **`Call`** ×37 |
| Phone, full | `Call 07494 073111` ×17, bare `07494 073111` ×28 | **`Call 07494 073111`** ×45 |

The 28 bare-number links had no verb; with the icon now `aria-hidden`, a screen reader
announced only a string of digits. Context-specific CTAs (`Get a guide price`,
`Book this tour`, `Ask about this tour`) are deliberate and kept.

## 2. "Ready to book newquay airport?" - template artefact - FIXED

Nine CTA headings were generated from the route name and lowercased it
("Ready to book exeter airport &amp; st davids?"). Rewritten by hand:

| Page | Copy |
|---|---|
| Newquay Airport | Ready to book your Newquay Airport transfer? |
| Exeter | Ready to book your Exeter transfer? |
| Bristol | Ready to book your Bristol Airport transfer? |
| Plymouth | Ready to book your Plymouth transfer? |
| Southampton | Ready to book your cruise transfer? |
| London | Ready to book your London airport transfer? |
| Coastal | Ready to book the Coastal Tour? |
| Historic | Ready to book the Historic &amp; Film Locations tour? |
| Custom | Ready to plan your own day? |

## 3. Long dashes - FIXED

Replaced with spaced hyphens across all pages, JSON-LD and `llms.txt`, matching the house
style set on ZensCars.

## 4. Booking form - FIXED

Added a one-line "All fields except the last are required" and specific inline errors
("Add a pickup location.") instead of a silent failure. The existing lede - *"it opens
straight into WhatsApp, ready to send"* - already sets the right expectation and is kept.

## 5. "What you actually get" ×6 - client's call

Same H2 on all six transfer pages. "Actually" is faintly defensive and it is the one heading
a reader meets six times. Suggest **"What's included"**, or vary per route
("What the Bristol run includes"). Low priority.

## 6. About page stays service-led - client's call

Per the brief: no owner name or years trading is claimed anywhere. A named-owner narrative
(the driver "Roger" appears in TripAdvisor reviews) would make About and the whole voice
far stronger, but needs PHD to confirm name and role first.

## What is already strong

- **Answer-first openers** on transfer and tour pages (distance, time, guide price before any
  pitch) - liftable whole into an AI answer. Keep.
- **`Published prices, no surprises`** on `/pricing/` - specific, and the differentiator
  competitors don't have.
- **`Questions, answered directly`** on `/faq/`.
- Form placeholders are real examples (`e.g. Fri 3 Oct, 6:30am`), not restated labels.

## Priority

| # | Finding | Impact | Status |
|---|---|---|---|
| 1 | Multiple labels per action | High | Fixed |
| 2 | Lowercased template headings | High, visible | Fixed |
| 3 | Long dashes | Low | Fixed |
| 4 | Silent form failure | High | Fixed |
| 5 | "What you actually get" ×6 | Low | Client |
| 6 | Owner narrative | High, upside | Client |
