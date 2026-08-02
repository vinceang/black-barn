# The Black Barn

Website for a fictional seasonal haunted house experience. Cinematic, scroll-driven, mobile-first.

## Repo

```
docs/creative-direction.md   Full creative direction package — source of truth
tokens/design-tokens.json    Colour, type, motion, texture tokens — the only place values live
CLAUDE.md                    Stack, build order, and the constraints that are easy to violate

src/components/journey/      §00–§05, one hydrated island (the scroll timeline)
src/components/booking/      §06–§07, a second island (seat inventory + the ritual)
src/components/document/     §08–§10, static Astro. Zero JS.
src/lib/seats/               The seat domain — types, seed, and the four async API functions
src/lib/                     Season calendar, media manifest, FAQ and tier copy
scripts/                     Token compiler, media encoders, JS budget meter
```

## Start here

1. Read `docs/creative-direction.md` end to end. §2 (visual system), §3 (motion), §4 (homepage architecture) and §5 (copy) are binding.
2. `CLAUDE.md` has the stack, island rules, and the constraints that are easy to violate.
3. `§01 The Bus` still needs verifying on a real mid-tier Android over 4G. That is the go/no-go gate.

## Commands

```
npm run dev        Astro dev server (regenerates tokens first)
npm run build      Static build to dist/
npm run typecheck  astro check
npm run budget     Per-route first-load JS, gzipped — record this in every PR
```

### Media pipeline

No asset enters `public/media` except through one of these. §6.2.4 allows no other route.

```
scripts/grade-still.sh      <src> <name> [w] [crf]   The shared still grade
scripts/encode-hero.sh      <src.mp4>                §01 — cut, graded, poster from frame 0
scripts/encode-road.sh      <src.mp4>                §03 — all-intra, for scrubbing
scripts/grade-recovered.sh  <src> <name> <treatment> §08 — the rejects, degraded
```

All four share one green-isolation pass so the bad-signal green reads as a point
source everywhere. Read the comment block in `encode-hero.sh` before changing it.

## Status

**Built** — §00–§10, plus `/nine` and the 404. Reduced-motion designs throughout.
Seat domain is simulated behind real async signatures; swapping to a backend is
four function bodies in `src/lib/seats/api.ts`.

**Interactions** — all seven of §3.2 are in: the Threshold, the Headlight
(WebGL, lazy-loaded after LCP), the Ride, the Splice, the Blink, the Idle and
the Engine. Plus §3.3's cursor states and micro-interactions.

GSAP is deliberately still not in the bundle — §03 and §05 pin with CSS sticky
and drive their own rAF loops, which is smaller and cannot fall out of sync
with the scroller.

**Known gap** — §3.2.5's Blink darkens the viewport but does not yet change
anything behind it. The brief wants one element to have moved when the light
returns; doing that honestly needs real state to move (a seat count that drops,
a plate that differs), so it waits on live inventory rather than shipping a
CSS nudge that fakes it.

**Audio** — `scripts/build-audio.sh` synthesises the three beds. They are
generated, not recorded, so the engine loop is seamless by construction: every
partial completes a whole number of cycles inside the 8s loop.

First-load JS: **74.7KB gz** on `/`, 56.4KB on `/nine`, **0KB** on the 404.
Budget 200KB. OGL is a separate 48KB chunk fetched on idle, never on load.
