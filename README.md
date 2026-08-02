# The Black Barn

**[black-barn.vercel.app](https://black-barn.vercel.app)**

The website for a seasonal horror experience that does not exist.

The Black Barn is a fictional brand. No tickets are sold, no seats are real, and
there is no barn — the seat inventory is simulated in the browser and the
calendar counts down to nights that will never run. It is a complete brand world
built as if it were shipping: booking flow, safety copy, refund terms, a live
manifest of guests, and a season that sells out around Halloween.

## The idea

Every haunted house sells a building. This one sells a **transfer**.

You do not drive to the barn. You park at a gravel lot on a county road, and a
bus takes you the rest of the way. The site is built around the eleven minutes
between the two — the moment the doors close and you have given up your ability
to leave. The bus is the brand. The barn is the payoff.

It is benchmarked against A24 film sites and game reveal pages rather than
against other haunted attractions. Prestige and dread first, conversion second.

Three readings of what the Black Barn actually is are kept simultaneously
supportable and never resolved: rural people doing something to outsiders, a
congregation performing an annual rite, or something in the barn that the
congregation is managing rather than worshipping. No single asset is allowed to
prove any one of them.

## The journey

The homepage is one continuous scroll, and the scroll is the trip — lot, road,
arrival, barn, rite, after. It has a departure time.

| | | |
|---|---|---|
| **00** | The Threshold | Black screen, one line of type. A schedule and a capacity, before you know what either is for. |
| **01** | The Bus | A locked-off wide of the bus, idling. Nothing moves but fog. Four seconds in, the doors open and nothing gets out. |
| **02** | The Summons | Thirty words, enormous, on a screen that has begun quietly transmitting static. |
| **03** | The Road | The ride. The road runs at you continuously and scrolling accelerates it. |
| **04** | Arrival | The one moment of stillness. The barn, fog to the knees, one lit window that changes while you watch. |
| **05** | The Rite | Three chambers, full bleed. Suddenly everything is symmetrical, which is how the site tells you it is a ritual without using the word. |
| **06** | Passage | Boarding, not booking. Three tiers as stencilled passes; a calendar where sold-out nights stay visible, struck through. |
| **07** | The Manifest | A live list of who is coming. Signing up ends in a full-screen seat number. |
| **08** | Recovered | A folder of material somebody else collected. Damaged, timestamped, unexplained. |
| **09** | The Questions | The FAQ as an internal document you were not meant to read. Every answer is useful and none of them are reassuring. |
| **10** | The Notice | The footer as a posted warning. |

Two more routes: `/nine` — the Ninth Seat, one per departure, not for sale — and
a 404 for when you have gone off the road.

## Details worth finding

- **`SEAT 07 — OCCUPIED`** appears on every departure in the manifest. No name.
  It is never explained anywhere on the site, and the FAQ's answer to "What is
  Seat 7?" is one word.
- **The headlight.** On a pointer device a beam follows the cursor across the
  hero and reveals a second vehicle back in the fog that is not otherwise
  rendered — it exists nowhere else on the page.
- **The reverse splice.** Scrolling back up through the road crosses a frame
  from a shot that is not in the forward footage.
- **The engine.** Sound is off by default and opt-in, because the opting in is
  the ritual. A bell rings on a 47-second interval, deliberately synced to
  nothing.
- **Reduced motion is a second design, not a fallback** — built alongside each
  section rather than after it. Nothing is withheld from it; what it loses is
  performance, not content.

The safety and logistics answers are written flatly and completely. Ambiguity is
for the horror; it is never for the practical information. In a real version of
this, people would need to know where to park.

---

## Build

Astro, static output, React only inside islands. Three hydration boundaries, on
purpose.

| Route | First-load JS (gz) |
|---|---|
| `/` | 75KB |
| `/nine` | 56KB |
| 404 | **0KB** |

The scroll journey (§00–§05) is **one** `client:load` island — the timeline is
continuous and splitting it would mean several hydration boundaries settling
against it at different times. Booking (§06–§07) is a second island, hydrated on
visibility, so the journey never pays for seat inventory it does not read. The
documents (§08–§10) are static Astro with no JS at all.

Pinning is CSS sticky rather than ScrollTrigger, so GSAP is not in the bundle.
OGL is a separate chunk fetched on idle, never on load.

```
docs/creative-direction.md   Full creative direction package — source of truth
tokens/design-tokens.json    Colour, type, motion, texture tokens — the only place values live
CLAUDE.md                    Stack, island rules, and the constraints that are easy to violate

src/components/journey/      §00–§05, one hydrated island (the scroll timeline)
src/components/booking/      §06–§07, a second island (seat inventory + the ritual)
src/components/document/     §08–§10, static Astro. Zero JS.
src/lib/seats/               The seat domain — types, seed, and the four async API functions
src/lib/                     Season calendar, media manifest, FAQ and tier copy
scripts/                     Token compiler, media encoders, audio synthesis, JS budget meter
```

### Commands

```
npm run dev        Astro dev server (regenerates tokens first)
npm run build      Static build to dist/
npm run typecheck  astro check
npm run budget     Per-route first-load JS, gzipped — record this in every PR
```

### The seat domain

Four async functions with the signatures a real inventory service would have:
`getDeparture`, `getManifest`, `holdSeat`, `claimSeat`. Swapping to a backend
means replacing four function bodies in `src/lib/seats/api.ts` and nothing else —
no component reads the seed data or touches a seat map synchronously.

Seat 7 is a genuine `occupied` row generated on every departure, never a
render-time special case. The manifest for the next departure is resolved at
build time, so it is real content in the HTML before any JavaScript runs.

### Media pipeline

No asset enters `public/media` except through one of these.

```
scripts/grade-still.sh      <src> <name> [w] [crf]   The shared still grade
scripts/encode-hero.sh      <src.mp4> [name] [w] [trim]   §01 — two orientations
scripts/encode-road.sh      <src.mp4>                §03 — the ride
scripts/grade-recovered.sh  <src> <name> <treatment> §08 — the rejects, degraded
scripts/build-audio.sh                               The three sound beds
```

All of them share one green-isolation pass, so the sickly green of the bus dome
light reads as a contained point source everywhere rather than as ambient
lighting. Read the comment block in `encode-hero.sh` before changing it — the
obvious approach to that grade is wrong in a way that is not obvious.

The audio is synthesised rather than recorded, which is what makes the engine
loop seamless: every partial completes a whole number of cycles inside the
eight-second loop, so the waveform is continuous across the join by
construction.

§08 is built entirely from takes that lost their selection pass, put through
five damage treatments. Nothing was generated for it.

### Known gaps

- The Blink darkens the viewport at three fixed scroll depths but does not yet
  change anything behind it. The intent is that one element has moved when the
  light returns; doing that honestly needs real state to move, so it waits on
  live inventory rather than shipping a CSS nudge that fakes it.
- One line of placeholder copy in the manifest is not in the creative direction
  and needs replacing in-voice.
- §01 has not been verified on a real mid-tier Android over 4G. That is the
  go/no-go gate, and touch-dependent behaviour — native scrolling, the
  gyroscope headlight, tap targets — can only be confirmed there.
