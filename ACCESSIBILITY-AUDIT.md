# PHD Taxi Services - Accessibility Review & Design QA

Audited against **WCAG 2.2 Level AA** in headless Chromium (Playwright + axe-core 4.x),
all 18 pages at desktop 1440×900 and mobile 375×812, served from a sub-path
(`/phdtaxi-services/`) to reproduce a GitHub Pages project URL. Interaction checks
(keyboard, form, menu) were scripted against the real pages, not inferred from source.

The build shipped with the same component patterns as the ZensCars rebuild **before**
that site's audit fixes, so it carried most of the same defects. All are fixed below.

> **Status: all findings fixed and re-verified.** Final run: 0 axe violations across
> 36 page/viewport combinations, 0 broken links or assets in a full-site crawl,
> 0 pages with horizontal overflow, 0 decorative SVGs exposed to assistive tech.

---

## BLOCKER

### 1. ~~Every internal link and asset broke off the root domain~~ - FIXED

All `href`/`src` values were root-absolute (`/assets/css/style.css`, `/transfers/`). On a
GitHub Pages project URL or any sub-folder host the stylesheet, scripts, images and every
nav link 404. Rewritten to depth-relative paths (`../../assets/...`). Verified: full crawl
from `/phdtaxi-services/` reaches all 18 pages, nothing escapes the base path.

### 2. ~~The FAQ accordion could not be operated by keyboard~~ - FIXED

**2.1.1 Keyboard (A)**. `.faq-q` was a `div[role=button]` with only a `click` listener, so
Enter/Space did nothing. Verified before the fix: focus + Enter left `aria-expanded="false"`
and the answer at 0px. `aria-expanded` was also never updated by the script.

Now a real `<button type="button">` with `aria-controls` → `role="region"`
`aria-labelledby` answer, and the script toggles `aria-expanded`. After: Enter opens
(`aria-expanded="true"`, 108px), Enter again closes.

### 3. ~~Collapsed answers stayed in the accessibility tree~~ - FIXED

**1.3.2 / 4.1.2**. `.faq-a` collapsed with `max-height:0` only, so screen readers announced
every closed answer. Now `visibility:hidden` when closed, with a delayed visibility
transition so the collapse still animates. Verified 0 visible closed answers on `/faq/` and
the transfer/tour pages.

### 4. ~~Empty booking form still opened WhatsApp~~ - FIXED

The form carries `novalidate` and the script never checked `required`, so an empty submit
fired a WhatsApp message with every field blank. Now validated in script: inline error
text per field (`aria-describedby`, `aria-invalid`), focus moves to the first error, nothing
is sent until the four required fields are filled. Verified both paths.

## HIGH - fails Level AA

### 5. ~~Copper buttons and text at 3.55:1~~ - FIXED

**1.4.3 Contrast**. Brand copper `#c1652f` is 3.55:1 with cream text on it, 3.52:1 on cream,
4.03:1 on white, 3.06:1 on cream-dim. It was used for every primary button (39 failures on
the homepage alone), eyebrows, card links, price amounts and step numbers.

Added `--copper-deep: #985025` - same hue and saturation, darker: **5.23:1** cream-on-it,
5.23:1 on cream, 5.98:1 on white, 4.50:1 on cream-dim. Used for text and fills. Brand copper
stays on rules, icons and stars (non-text, 3:1 needed). On dark surfaces eyebrows switch to
`--copper-light` (5.86:1 on ink).

### 6. ~~No visible focus indicator anywhere~~ - FIXED

**2.4.7 Focus Visible**. The stylesheet had no `:focus-visible` rule; only form inputs had
an outline. Added a 3px copper-deep outline site-wide, switching to copper-light on the
hero, dark bands, nav, sticky bar and footer.

### 7. ~~Fixed header covered anchor targets~~ - FIXED

**2.4.11 Focus Not Obscured**. `scroll-padding-top` now clears the 78px fixed nav, so the
skip link and in-page anchors land below it.

### 8. ~~Header WhatsApp button covered the tagline and pushed the menu off-screen~~ - FIXED

At 375px the header CTA overlapped "Professional hired driver" and pushed the menu toggle
past the right edge - mobile users could not open the nav. Phones already get the sticky
Call/WhatsApp bar, so the header button now hides at ≤720px.

### 9. ~~The page panned sideways on mobile~~ - FIXED

Home (69px), About (109px) and Reviews (15px) overflowed at 375px. Causes: grid items
defaulting to `min-width:auto` so images forced the column wider than the screen; inline
`max-width:420px/460px` on images overriding `max-width:100%`; and a `nowrap` button label.
Fixed with `min-width:0` on grid children, `max-width:min(420px,100%)`, and wrapping
buttons at ≤520px. `overflow-x:hidden` on `body` replaced by `overflow-x:clip` on both roots.

### 10. ~~Images could stretch~~ - FIXED

`img` had `max-width:100%` but no `height:auto`, so any image narrowed by its container kept
its `height` attribute and distorted (the same bug as ZensCars 11b). Added `height:auto`.

## MEDIUM

### 11. ~~Desktop nav wrapped onto two lines between 941px and ~1300px~~ - FIXED

At 960px "Day Tours", "Discover Cornwall" and the phone number broke onto two lines and
the header grew to 100px. Nav items are now `nowrap`, the phone link hides below 1320px
(it is in the hero, sticky bar and footer), and the menu takes over at ≤1120px. Verified
single-row, no overlaps at 1100, 1121, 1200, 1321 and 1440px.

### 12. ~~Mobile menu had no Escape key or focus containment~~ - FIXED

**2.1.2 / 2.4.3**. Escape now closes and returns focus to the toggle; Tab is trapped inside
the open panel; the toggle's label flips between "Open menu" and "Close menu".

### 13. ~~Every inline SVG exposed to screen readers~~ - FIXED

44 on the homepage alone, none marked decorative - every icon next to a text label was
announced as an unlabelled image. All now `aria-hidden="true" focusable="false"`. The star
row on Reviews is decorative too; the adjacent "5.0 out of 5" text carries the meaning.

### 14. ~~Footer links under 24px tall~~ - FIXED

**2.5.8 Target Size**. Footer and card links now have a 24px minimum target.

### 15. ~~Stat counter ignored `prefers-reduced-motion`~~ - FIXED

**2.3.3**. The CSS query stopped transitions but the scripted counter still animated. Now
renders the final value immediately under reduced motion.

### 16. ~~White float card inherited cream text on dark bands~~ - FIXED

Found on the second pass: the homepage float card's heading was `#f6efe2` on `#fff` (1.14:1).
The card now sets its own ink colour.

## SEO defects found in passing

- **Canonicals and `og:url` pointed at `/about/index.html`** on all 18 pages, competing with
  the clean `/about/` URLs in the sitemap. All now clean trailing-slash URLs; JSON-LD likewise.
- Pricing table amounts wrapped ("from" / "£95") at 375px; now `nowrap` with tighter
  mobile padding.

## Not changed - client or content calls

- **Card payment claim** on `/pricing/` ("Pay by card on the day, no cash required") - not
  in the brief's verified facts table. Confirm with PHD or remove.
- The self-drawn logo mark is a placeholder until PHD supplies a vector logo.
- Fonts (Cormorant, Work Sans) load from Google Fonts; the audit environment blocked them,
  so layout was verified on fallback fonts. Nav widths were given headroom for that reason.

## Method

`axe-core` run with the `wcag2a`, `wcag2aa`, `wcag21aa` and `wcag22aa` tags after forcing
reveal animations to their end state (otherwise mid-fade text gives false contrast
failures). Overflow measured as `scrollWidth - innerWidth` plus a per-element right-edge
check. Keyboard, form and menu behaviour driven with real key presses in Chromium.
