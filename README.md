# Signal Nine — sample product launch page

A self-contained sample launch site for a screenless desk clock: oversized type,
a drawn aluminium device whose hands show your actual local time, a press row,
a scrolling spec band, three design features, a real spec table and a preorder
form. It is a **portfolio template** — the hardware is fictional and no order or
email is processed.

- Sector: Product launch / hardware landing page
- Stack: static HTML, CSS and vanilla JS. No build step, no webfonts, no CDN, no renders or photos.
- Run: `python3 -m http.server 3000` in this folder.
- Files: `index.html`, `styles.css`, `main.js`.

## The brand, as written

| Item | Value |
| --- | --- |
| Name | Signal Nine |
| One-liner | Time, without a screen. |
| Product | A desk clock: one hand, machined aluminium, 72-hour battery, passive radio sync. |
| Audience | Design-literate desk workers, 25–45; first run of 500 pieces. |
| Tone | Short sentences, confident, a little severe. No "revolutionary". |
| Palette | Ink `#08090A`, off-white `#F2F3EE`, acid lime `#C8FF4D` |
| Type | Helvetica Neue / Arial Narrow in caps, huge and tight; serif italic for the accent line; monospace for labels |
| Shape | 6px plates, 999px pills, 1px hairlines |

### Screen inventory

1. **Fixed nav** — wordmark, section links, lime preorder pill, solid on scroll.
2. **Hero** — huge three-line headline, product explanation, two CTAs, three hero stats, drawn device with live hands.
3. **Press row** — fictional publications, text only, no fake logos.
4. **Spec band** — scrolling marquee of four promises; pauses on hover and stops under reduced motion.
5. **The idea** — two-column rationale.
6. **Design** — three numbered features with drawn detail plates.
7. **In the wild** — three drawn scenes with captions.
8. **Specs** — dimensions, weight, body, battery, movement, sync, box, price.
9. **Preorder** — first-run story, terms, validated email form.
10. **Footer** — nav and sample disclosure.

### Sample copy worth reusing

- "A clock should tell the time, then get out of the way."
- "One hand moves once a minute. There is no screen to glow at night, no firmware to update."
- Specs: 92 × 92 × 38 mm, 380 g, 6061 aluminium, Swiss quartz ±10 s/month, $180, ships March 2027.

## What to show it for

Pitch this at hardware founders and product marketers: it demonstrates a scroll
story, a CSS/SVG product render that behaves (the hands track real time), a spec
table that is genuinely readable, motion with a reduced-motion off switch, and a
form that does not pretend to take money.

## Motion

The motion layer is dependency-free. The dial's hands move on a
`requestAnimationFrame` loop, the hero tilts toward the pointer, the feature
plates animate on their own cycles, a lime time rail tracks scroll progress,
the nav marks the section in view, and sections reveal as they enter the
viewport. Everything is skipped under `prefers-reduced-motion`.

## Make it yours

- Brand: `.logo`, the lime token, `<title>` and the legal footer line.
- Product: replace the inline SVG device in `index.html` — keep `#hourHand` / `#minuteHand` and their `rotate(... 180 196)` transform-origin if you want live time.
- Specs: edit the `<dl class="spec-list">` rows; it is plain definition markup.
- Preorder: replace the submit handler with a real endpoint, then test validation and the success state.

## Limits

Fixed launch page with no routing, CMS or analytics, and no real checkout. The
device is a drawing; there is no photography to swap. Ship it after a client's
product exists, not before.
