# CLAUDE.md

Project instructions for Claude Code. Read `docs/creative-direction.md` before writing any UI.

## What this is

The website for **The Black Barn** — a fictional seasonal haunted house experience. A cinematic, scroll-driven, mobile-first marketing and ticketing site. Prestige and dread first, conversion second.

The full creative direction lives in `docs/creative-direction.md`. It is the source of truth for palette, typography, copy, motion, and section architecture. **Do not invent visual decisions that contradict it.** If something is genuinely unspecified, propose the choice before building it.

## Stack

- Next.js (App Router), TypeScript
- Lenis (smooth scroll) + GSAP ScrollTrigger (scroll orchestration)
- OGL or Three.js for the headlight mask + grain shader — lazy-loaded after LCP
- Tailwind, configured from `tokens/design-tokens.json`. No arbitrary hex values in components.
- Video via Mux or Cloudflare Stream, with an AVIF frame-sequence fallback path
- Vercel

## Build order

Follow this sequence. Do not build sections out of order — each one depends on the physics established by the last.

1. Token system + Tailwind config + font loading
2. Layout shell, Lenis, the global grain overlay
3. `§01 The Bus` hero — **stop here and verify on a real mid-tier Android before continuing.** This is the go/no-go gate.
4. `§02 Summons` → `§05 The Rite` (scroll scrub, parallax, splice transitions)
5. `§06 Passage` → `§07 Manifest` (commerce + form ritual)
6. `§08 Recovered` → `§10 Notice`
7. Sound layer, idle states, the Blink, 404

## Hard constraints

- **`prefers-reduced-motion` is a second design, not a fallback.** Build it in the same commit as the animated version, never afterward. It must be beautiful: stills, large type, full copy.
- **No autoplaying audio.** Sound is opt-in via the `TURN ON THE ENGINE` toggle.
- Total JS budget: **180KB gzipped**. LCP under 2.5s on 4G.
- Full keyboard nav with a visible `ember` focus ring. FAQ and ticketing are semantic HTML, screen-reader complete.
- Every image and video gets the shared grain overlay at 6–9%, screen blend. One plate, used everywhere.
- iOS Safari is the primary risk surface. Test scroll-scrub and `playsinline` video there early and often.

## Style rules that are easy to get wrong

- The `bad-signal` green appears in exactly **three** places sitewide: the bus dome light, the seats-remaining counter, and the restricted-cursor state. Nowhere else.
- No drop shadows. Light blooms only.
- Display serif and condensed sans never appear in the same line.
- All Signage-role text is uppercase. All Invitation-role text is sentence case.
- Base easing `cubic-bezier(0.16, 1, 0.3, 1)`, base duration 900ms. The site is deliberately slow.

## Copy

Copy in `docs/creative-direction.md` §5 is final. Do not paraphrase it, do not "improve" it, do not add microcopy in a different voice. If a state needs copy that isn't written yet, flag it rather than writing it.

The safety and logistics answers in the FAQ (items 02, 03, 08, 11) carry real information. Never soften or stylize those beyond what's already written.

## Placeholder media

Media assets don't exist yet. Use solid `void` blocks with a Record-type label naming the intended asset (e.g. `[ A1 — BUS HERO LOOP ]`) so the layout is honest about what's missing. Do not substitute stock imagery.
