# THE BLACK BARN
## Creative Direction Package — Website & Brand World
*Version 1.0 · Handoff-ready for design, development, and AI media production*

---

## 0. ASSUMPTIONS I MADE (so we could move)

- **Season:** Late September → first week of November. Roughly 22 operating nights.
- **Capacity:** ~40 guests per departure, 6 departures a night. Small on purpose. Scarcity is the product.
- **The ride is the ticket.** You do not park at the barn. You park at a gravel lot on a county road and the bus takes you. That transfer is the brand's single most ownable asset.
- **Rating:** 18+. Intense, physical, no nudity, no gore-for-gore's-sake. The horror is psychological, sensory, and social.
- **Price ladder:** three tiers (detailed in §4.6). Premium, not cheap.
- **Legal reality:** it's a licensed entertainment venue with safety staff. The *site* never says that out loud above the fold. The FAQ and footer carry the real information, in voice.

If any of these are wrong, only §4.6 and §5 need rewriting. Everything else holds.

---

# 1. CREATIVE BRIEF

### The single idea
**You are not buying a ticket. You are getting on the bus.**

Every haunted house sells a building. We sell a *transfer* — the eleven minutes between the gravel lot and the barn door, when the doors close and you realize you've given up your ability to leave. The bus is the brand. The barn is the payoff.

### Positioning statement
The Black Barn is a seasonal, invitation-flavored horror ritual held in a decaying rural nowhere. It is not a scare attraction. It is a place that has been operating longer than anyone will confirm, that takes forty people a night, and that has never explained itself.

### Emotional positioning
| We are | We are not |
|---|---|
| Selective, quiet, certain | Loud, promotional, jokey |
| Ambiguous about the threat | Explaining lore |
| Sensual and cold at once | Sexy-horror kitsch |
| Rural, handmade, rusted | Hollywood set-dressed |
| A rumor with a booking page | An event with a marketing campaign |

### The ambiguity doctrine — non-negotiable
Three readings must remain simultaneously supportable and never resolved:
1. **Human.** Rural people doing something to outsiders.
2. **Cult.** A congregation performing an annual rite that requires attendance.
3. **Other.** Something in the barn that the congregation is managing, not worshipping.

**Rule for every writer, designer, and prompt:** never let one reading win a single asset. If a shot proves "it's a cult," it needs a detail that suggests it's a business. If a line proves "it's supernatural," the next line is a liability disclaimer. Dread lives in the gap.

### The audience, honestly
- **The Obsessive** (25%) — horror-literate, will find every hidden page, will screenshot the FAQ. Design for them; everyone else follows them.
- **The Group** (35%) — 4–8 friends, one organizer. They need clarity fast without breaking the spell.
- **The Couple** (20%) — this is a *date*. Charged, tactile, a little erotic. Design the VIP tier for them.
- **The Documentarian** (15%) — creators. Give them a frame that is impossible to shoot badly.
- **The Curious Outsider** (5%) — arrived from a screenshot, doesn't know what this is. The hero has to work for them in four seconds.

### Competitive frame
We are not benchmarked against haunted houses. We're benchmarked against: A24 film sites, *Death Stranding*'s reveal pages, Aesop's product world, Saint Laurent's editorial rhythm, and the visual grammar of a leaked evidence folder.

### Success criteria
1. Someone screenshots the FAQ and posts it with no caption.
2. Someone argues in a comment section about whether the Black Barn is real.
3. Sells out before a single paid ad runs.

---

# 2. VISUAL IDENTITY SYSTEM

## 2.1 Palette

The site is 78% darkness. Color is an event, not a surface.

```yaml
# design tokens — color
color:
  void:        "#060505"   # true page ground; the space between things
  ash:         "#0E0C0B"   # card / panel ground
  soot:        "#1A1614"   # elevated surface, dividers
  wet-wood:    "#2B211B"   # texture mid-tone, image floors
  rust:        "#6B2E19"   # oxidized metal, primary warm structure
  oxblood:     "#4A0F12"   # the only "red" — never bright, never fresh
  tallow:      "#E8DCC4"   # primary type; candle-wax white, never pure
  bone:        "#C9C2B4"   # secondary type, 70% states
  ember:       "#FF8A3D"   # candle/headlight bloom. ≤2% of any screen
  bad-signal:  "#7CFF6B"   # WRONG. see rule below
```

**Usage ratio target per viewport:** void/ash 78% · wet-wood/rust 12% · tallow/bone 8% · ember 2% · bad-signal <0.5%.

**The bad-signal rule.** The chemical green appears in exactly three places on the entire site: the bus's interior dome light, the "seats remaining" counter, and the cursor state when you hover something you shouldn't. Nowhere else. Ever. It is the color of the thing that isn't part of the aesthetic — the intrusion of something modern and wrong into a hand-built world. If it starts showing up in buttons, we've lost it.

**Never used:** pure black (#000), pure white (#FFF), bright blood red, purple, Halloween orange, any gradient that reads as a "gradient."

## 2.2 Typography — three voices

The site speaks in three registers, and the register tells you who's talking.

**1. THE INVITATION** — high-contrast display serif. Used for hero lines, section titles, and the words the Barn says to you. Set enormous, tight, tallow, with generous space around it. This is the elegance that makes the horror expensive.
- *Licensed:* Canela Deck, GT Sectra Fine, or Ogg.
- *Open alternative:* Instrument Serif (display), Newsreader (long-form).

**2. THE SIGNAGE** — condensed, heavy, slightly industrial sans. Used for wayfinding, tier names, dates, prices, buttons, the manifest. This is the voice of the operation — practical, painted on a board, unbothered.
- *Licensed:* Druk Condensed, Grtsk Peta, or Compressa.
- *Open alternative:* Archivo Narrow (Black), Anton for peaks only.

**3. THE RECORD** — typewriter mono. Used for the FAQ, waivers, timestamps, seat numbers, form labels, error states, and anything that pretends to be a document. This is the voice of whoever writes things down afterward.
- *Licensed:* Pitch, ABC Diatype Mono.
- *Open alternative:* Courier Prime, Martian Mono.

**Rules:**
- Never mix Invitation and Signage in the same line. They are different mouths.
- The Record is always ≤14px, always letterspaced +0.06em, always bone not tallow.
- Display type is set at optical sizes: hero at `clamp(3.25rem, 13vw, 11rem)`, `letter-spacing: -0.03em`, `line-height: 0.88`.
- No italics anywhere except the single line "*it does not.*" (§5.3). Scarcity makes it land.
- All Signage text is uppercase. All Invitation text is sentence case. The contrast between a shouting sign and a whispering invitation *is* the brand.

## 2.3 The mark

**The Broken Hex.** Pennsylvania Dutch barn stars are protective — hex signs painted to keep something out. Ours is a six-point barn star drawn in a single weight, with one arm truncated. The protection has failed, or it was never installed correctly, or it was installed backwards on purpose.

- Renders at 24px (favicon), 200px (hero), and 40ft (painted on the barn).
- Never on a colored fill. Only tallow on void, or burned/branded into a texture.
- **Secondary mark:** the seat number. Every guest's number set in Signage, stencil-style. It becomes the merch, the ticket, the social object.

## 2.4 Texture doctrine

Three textures only. Everything else is an accident.

1. **Halide grain** — a single 4K animated grain plate, 24fps, overlaid at 6–9% on every image and video, screen blend. Same plate everywhere. This is what unifies AI-generated assets more than any other single decision.
2. **Emulsion damage** — sparse, hand-placed: a scratch, a hair, a chemical bloom at one frame edge. Used on maybe 20% of assets. Too much reads as a filter.
3. **Xerox** — for documents only (FAQ, waiver, manifest). Toner speckle, one degree of rotation, a fold shadow.

**Prohibited:** drop shadows (light blooms instead), glassmorphism, blurred color orbs, cobwebs, spiders, cartoon blood, dripping-font logos, jack-o'-lanterns, anything that says "Halloween."

## 2.5 Composition rules

- **The empty half.** Every hero and section-break image leaves 40–60% of the frame in near-black negative space, with type living in that dark. It reads as luxury editorial *and* as room for something to walk into frame.
- **Subject low or edge.** Figures sit in the lower third or press against the frame edge. Never centered — *except* in the Rite section, where perfect symmetry suddenly appears. Symmetry = ritual = you are inside it now.
- **One light source.** Every image is lit by one practical: a headlight, a bare bulb, a candle, a road flare, the dome light. If you can't name the source, regenerate it.
- **Wet.** Every surface has moisture on it. Wood, metal, skin, glass, gravel. This is the difference between "spooky render" and "place."
- **Depth in three layers:** foreground occlusion (a post, a shoulder, a chain-link edge) / subject / fog-separated background. This is also what makes parallax work.

## 2.6 The figures — handling the "seductive/ominous" line

The site's human presence is a small recurring cast we call **the Ushers**: figures in a hybrid of Sunday church dress and slaughterhouse apron — starched cotton, oilcloth, work boots, hair pinned severely, faces obscured by veil, shadow, or crop.

- **Sensuality comes from posture, fabric, and stillness.** A wet cotton sleeve, a hand resting on a door frame, a spine turned away, a bare heel on gravel. Never skin-as-content.
- **Faces are a resource we spend rarely.** Obscure by default. One full face in the entire site, appearing once, near the end. It should feel like a violation that we saw her.
- **Hard line:** nothing explicit, nothing that reads as sexualized violence, no restraint imagery. The brand is *charged*, not exploitative. Elegance is what makes it feel expensive and what keeps it from feeling like a roadside attraction.

---

# 3. MOTION & INTERACTION DESIGN

## 3.1 Global physics

- **Everything is slightly too slow.** Base easing `cubic-bezier(0.16, 1, 0.3, 1)`, base duration 900ms. The site never feels snappy. It feels like it's deciding.
- **Smooth scroll** (Lenis) with a lerp of 0.075. Scroll has weight, like a heavy door.
- **Breathing.** The hero, and any full-bleed image, has a permanent 1.00 → 1.015 scale oscillation on a 9-second sine. Imperceptible individually; alive cumulatively.

## 3.2 The seven signature interactions

**1. THE THRESHOLD (page load).**
Black screen. A single line of Record type, centered: `DEPARTURE 7 OF 22 · 40 SEATS`. Two seconds. Then a diesel engine turns over in the audio bed (if enabled) and the hero doesn't fade in — it **cuts** in, hard, mid-motion. No logo animation. No loading bar. The absence of a normal preloader is the first signal that this site is not like other sites.

**2. THE HEADLIGHT (desktop cursor).**
A soft elliptical light mask follows the cursor at 60% lag. In dark sections, it reveals detail that isn't otherwise visible — a figure in a treeline, writing on a wall, a second face. Implemented as a WebGL displacement + luminance mask, not a CSS radial gradient. **Mobile equivalent:** gyroscope. Tilt the phone and the light moves. Users discover this by accident and it is the single most-shared moment on the site.

**3. THE RIDE (scroll-scrubbed video).**
Section 03 is a 14-second clip of the bus ride, scrubbed by scroll position. Scroll down, you go forward. Scroll *up*, and the footage runs backward — but two frames of a different shot are spliced in on the reverse only. Nobody will believe each other about it.

**4. THE SPLICE (section transitions).**
Sections don't fade. They cut: 2 frames of pure void, one frame of overexposed ember bloom, then the new section. Like a projector. 84ms total.

**5. THE BLINK.**
At three fixed scroll depths (not random — QA'd, deterministic), the viewport goes fully black for 130ms. When it returns, one element has changed: a figure has moved closer, a door that was shut is open, the seat count dropped by one. Never acknowledged. Disabled under `prefers-reduced-motion`.

**6. THE IDLE.**
After 24 seconds of no input, ambient motion in the current section increases slightly and the tab title changes to `still there?` for six seconds, then back. One time per session.

**7. THE ENGINE (sound).**
Sound is off by default with a persistent, beautiful toggle in the corner reading `TURN ON THE ENGINE`. When enabled: a low diesel idle bed, wind, gravel, and one distant bell that rings on a 47-second interval — deliberately not synced to anything, so it always feels like it came from outside the site. Scroll velocity modulates wind volume. **Do not autoplay audio.** The opt-in *is* the ritual.

## 3.3 Micro-interactions

- **Buttons** don't hover-lift. They get warmer — a 400ms ember bloom behind the label, like something heating up.
- **Links** underline by drawing left-to-right, then the line *drips* 2px before settling.
- **Form fields** are Record type on a hairline rule. On focus, the rule ignites from left to right in ember.
- **The seat counter** ticks down live. When it changes, it flickers in bad-signal green for 200ms.
- **Cursor states:** default (headlight), on-link (headlight contracts, tightens), on-restricted (headlight goes bad-signal green and the label reads `NOT FOR YOU`).

## 3.4 The quality floor (non-negotiable)

- `prefers-reduced-motion`: the site becomes a still, typographic, editorial version of itself. It must be *beautiful in this mode*, not degraded — high-contrast stills, big type, full copy. Roughly 6% of visitors will only ever see this. Treat it as a second design, not a fallback.
- Full keyboard navigation with a visible ember focus ring. The FAQ and ticketing are semantic HTML and screen-reader complete.
- LCP < 2.5s on a mid-tier Android over 4G. The hero poster frame is a 90KB AVIF that loads before any video byte.
- iOS: use frame-sequence or `playsinline` muted HEVC; never rely on autoplay behavior you haven't tested on a real device.
- Total JS budget: 180KB gzipped. WebGL layer lazy-loads after LCP.

---

# 4. HOMEPAGE ARCHITECTURE

The scroll *is* the journey: lot → road → arrival → barn → rite → after. Numbering the sections is justified here because the content genuinely is a sequence — it's a trip with a departure time.

```
┌──────────────────────────────────────────────────┐
│ 00  THE THRESHOLD        black / one line        │
├──────────────────────────────────────────────────┤
│ 01  THE BUS              full-bleed hero video   │
│     [ THE BLACK BARN ]                           │
│     "You will be picked up."                     │
│                          ↓ CLAIM A SEAT          │
├──────────────────────────────────────────────────┤
│ 02  THE SUMMONS          30 words. huge type.    │
├──────────────────────────────────────────────────┤
│ 03  THE ROAD             scroll-scrubbed ride    │
│     ░░░ parallax ░░░ 11 minutes ░░░              │
├──────────────────────────────────────────────────┤
│ 04  ARRIVAL              the barn reveal         │
├──────────────────────────────────────────────────┤
│ 05  THE RITE             3 chambers, symmetric   │
├──────────────────────────────────────────────────┤
│ 06  PASSAGE              tiers / booking         │
├──────────────────────────────────────────────────┤
│ 07  THE MANIFEST         live names + seat #s    │
├──────────────────────────────────────────────────┤
│ 08  RECOVERED            evidence gallery        │
├──────────────────────────────────────────────────┤
│ 09  THE QUESTIONS        FAQ as document         │
├──────────────────────────────────────────────────┤
│ 10  THE NOTICE           footer                  │
└──────────────────────────────────────────────────┘
```

### 00 — THE THRESHOLD
Pre-hero. Void ground. One line of Record type. Departure number and remaining seats, pulled live. Holds for 1.8s or until first input. **Purpose:** establishes that this thing has a schedule and a capacity before it establishes what it is.

### 01 — THE BUS *(the thesis)*
Full-viewport, 100dvh. Locked-off wide of the school bus at night on a gravel road: welded panels, mismatched sheet metal, plywood over three windows, one headlight brighter than the other, engine idling, exhaust dragging sideways in the fog. Interior dome light is bad-signal green. Doors closed.

Type sits in the dark lower-left third. On desktop, a headlight-mask reveals a second vehicle further back in the fog that is not visible otherwise.

At 4 seconds of dwell, the bus doors open. Nothing gets out.

- **H1 (Invitation):** *You will be picked up.*
- **Eyebrow (Record):** `OCT 2 — NOV 8 · UNDISCLOSED COUNTY ROAD · 40 SEATS PER DEPARTURE`
- **Primary CTA (Signage):** `CLAIM A SEAT`
- **Secondary (Record, underlined):** `what is this`

### 02 — THE SUMMONS
Void. No image. Just enormous Invitation type, revealed line by line on scroll, each line arriving with a 240ms delay like someone deciding whether to tell you.

> Every autumn the barn opens.
> Forty people are driven out to it.
> Everyone comes back.
>
> `that has always been true.`

That last line in Record, small, tucked under. The tonal shift from Invitation to Record is the scare.

### 03 — THE ROAD
The scroll-scrubbed ride. Pinned viewport, 300vh of scroll drives 14 seconds of footage: POV through a scratched bus window, dark fields, one mailbox, a figure standing at a fence line who does not turn to watch, the treeline closing in.

Overlaid at intervals, Record type, small, left-aligned like a log:
`00:00 you get on` · `03:40 the pavement ends` · `07:15 phones stop working` · `11:00 you arrive`

Parallax: three depth layers (window frame / passing field / far treeline) at 1.0 / 0.6 / 0.2 scroll ratios.

### 04 — ARRIVAL
The reveal. The full-bleed exterior of the barn, shot from bus-door height, low, looking up. Fog to the knees. One lit window. Broken hex painted large and faded on the black boards.

This is the site's **one moment of stillness** — 40vh of pure void above the image and below it, so the barn arrives in silence. No copy for the first 60% of the section. Then, small, centered, Record:

`you are here now`

### 05 — THE RITE
Three chambers presented as a horizontal-scroll (desktop) / snap-carousel (mobile) sequence. Suddenly, symmetrical composition. This is where the site tells you it's a ritual without ever saying the word.

| Chamber | Title (Invitation) | Line (Record) |
|---|---|---|
| I | The Sorting | `you will be separated from your group. this is not optional.` |
| II | The Congregation | `they have been waiting a full year. be gracious.` |
| III | The Return | `not everyone rides back in the same seat.` |

Each chamber: one hero still, one texture plate, one detail macro. No explanation of what happens. **Withhold everything.**

### 06 — PASSAGE
Booking, but framed as boarding. Three tiers as stenciled boarding passes, Signage type, oxblood rules.

- **PASSENGER** — $89. `A seat. The full route.`
- **FRONT SEAT** — $165. `First on, last off. You will see things the others are told not to look at.` *(the couples/VIP tier)*
- **THE NINTH SEAT** — $?. `One per departure. It is not sold. It is offered.` — no price, no button. A single Record link: `request consideration`. Leads to §11's hidden flow.

Below: `SELECT A DEPARTURE` — a calendar of nights, each showing seats remaining in Signage. Sold-out nights are not removed; they're struck through in oxblood and labeled `FULL`. Scarcity you can see.

### 07 — THE MANIFEST
The most important social mechanic on the site. A live, slowly auto-scrolling list of booked guests: first name, last initial, seat number, departure.

```
SEAT 04   MARISOL V.   OCT 12
SEAT 05   —            OCT 12   [ available ]
SEAT 06   D. HALE      OCT 12
SEAT 07   OCCUPIED     OCT 12
SEAT 08   JONAH R.     OCT 12
```

`SEAT 07 — OCCUPIED` appears on **every** departure. No name. It is never explained anywhere on the site. This costs nothing to build and will generate more discussion than any paid campaign.

The signup form itself is a ritual, not a form:
1. `WRITE YOUR NAME` — full-width Record input, hairline rule ignites on focus.
2. `WHO IS COMING WITH YOU` — optional, up to 7.
3. `WHY` — a free-text field with no validation and no explanation. Placeholder: `there is no wrong answer.`
4. Button: `ADD ME TO THE MANIFEST`

On submit: the screen goes to void for 900ms. Then, in Signage, enormous: **`SEAT 23`**. Below it, Record: `we know where the lot is. we will send the road.`

### 08 — RECOVERED
Gallery, framed as a folder of material someone else collected. Mixed formats deliberately: 4:3 stills, a vertical phone clip, a scanned polaroid, a thermal frame, one image that is just a smear. Each captioned in Record with a date and nothing else — `10.28 · 02:14`.

During the season, **one new item appears per week.** Returning traffic is the point.

### 09 — THE QUESTIONS
See §5.4. Presented as a xeroxed internal document: fold shadow, toner speckle, 0.7° rotation, Record type throughout, question numbers in the margin. Accordion behavior, but the panels open with a paper-unfolding motion rather than a slide.

### 10 — THE NOTICE
Footer as a posted warning. Broken hex, large, low-opacity. Real information in Record: dates, county, contact, accessibility, age policy, safety line, refund policy. Then a final line in Invitation, alone:

*The barn was here before the road was.*

---

# 5. COPY

## 5.1 Voice rules

- **Short. Declarative. Present or future tense.** "You will be picked up," not "Guests will be transported."
- **Second person, always.** The site talks to one individual, even though forty are going.
- **Never use:** terrifying, scariest, nightmare, blood-curdling, you'll scream, dare you, are you brave enough, ultimate. These are the words of a competitor.
- **Never explain the threat.** The most frightening sentence is a practical instruction about an event that hasn't been described.
- **Real information is delivered flatly and completely.** Ambiguity is for the horror; it is never for the logistics. People need to know where to park.

## 5.2 Hero & CTA variants

**Hero H1 options:**
- *You will be picked up.* ← recommended
- *The bus leaves at dark.*
- *Forty seats. One road in.*

**CTAs:**
- `CLAIM A SEAT` (primary)
- `ADD ME TO THE MANIFEST` (waitlist)
- `SELECT A DEPARTURE` (calendar)
- `REQUEST CONSIDERATION` (the Ninth Seat)
- `TURN ON THE ENGINE` (audio)

## 5.3 Story fragments (section breaks & cards)

> The county stopped maintaining the road in 1991. The barn did not stop receiving people.

> Bring shoes you can walk in. The ground is uneven and it is usually wet.

> You may ask the Ushers questions. You may not ask them twice.

> There is a word you can say if you need it to stop. *it does not.* — you will be given the word anyway.

> If you become separated from your group, stand still. Someone will come for you.

## 5.4 The FAQ — creepy internal document

Header, Record, top of page:
`ORIENTATION NOTES — READ BEFORE DEPARTURE — DO NOT REMOVE FROM VEHICLE`

**01 · Is it scary?**
That has not been the most common complaint.

**02 · Will I be touched?**
Yes. Contact is part of the experience — guiding, holding, moving you between spaces. You will be asked to consent at boarding. You may withdraw that consent at any point by returning your wristband to any Usher. They will not argue with you. *(Real policy, stated plainly, in voice.)*

**03 · Can I leave?**
The bus returns at the end of the experience, approximately 90 minutes after arrival. If you need to leave sooner, tell any Usher and one will walk you back to the lot. It takes about twenty minutes on foot. Most people wait for the bus.

**04 · What is wrong with the bus?**
It was built out of three other buses. Everything on it works. Two of the seats are original.

**05 · How long does it take?**
Two hours and forty minutes, door to door. Eleven minutes out. Ninety minutes there. Eleven minutes back. The remainder is spent waiting, which is intentional.

**06 · Can we stay together as a group?**
No.

**07 · What should I wear?**
Closed shoes. Layers — it is colder at the barn than at the lot, by more than the distance explains. Nothing you would be upset to have ruined.

**08 · Are there strobes, loud sounds, or confined spaces?**
Yes to all three. There is also fog, darkness, water, uneven ground, and a section with no artificial light of any kind. If you are pregnant, have a heart condition, or are prone to seizures, do not book. *(Real safety copy. Do not soften.)*

**09 · Is it real?**
The barn is real. The road is real. The bus is real, and you can hear it from the lot before you see it. Everything else is a matter of what you are willing to accept about what happened to you.

**10 · What is Seat 7?**
Taken.

**11 · Can I photograph inside?**
No. Phones are collected at boarding and returned to you at the lot. This is enforced. It is also for your benefit — every account we have of that night was written down afterward, from memory, and none of them agree.

**12 · What is the Ninth Seat?**
If you have to ask, the answer is that there isn't one.

## 5.5 Microcopy

| Moment | Copy |
|---|---|
| Empty manifest | `no one has claimed a seat on this night yet. someone will.` |
| Form error | `that name will not do. try the one you were given.` (invalid) · `we need a way to reach you.` (email) |
| Sold out | `FULL. the seats do not increase.` |
| Loading | `bringing the bus around` |
| 404 | `you have gone off the road. / there is nothing out here. / [ RETURN TO THE LOT ]` |
| Email confirmation subject | `Seat 23 — your route` |
| Email body opener | `Do not reply to this message. Directions will follow at dusk on the day of your departure. Bring the confirmation. Bring shoes.` |
| Newsletter opt-in | `TELL ME WHEN IT OPENS AGAIN` |
| Audio toggle (on state) | `THE ENGINE IS RUNNING` |
| Cookie notice | `we keep a record of who comes here. accept / no` |

---

# 6. HIGGSFIELD MEDIA GENERATION PLAN

## 6.1 The core technique: the locked Style DNA string

Every prompt in this production ends with the same suffix, unchanged, no exceptions. This is what makes 60 assets from a generative model read as one photographer, one camera, one night.

**STYLE DNA (append to every prompt):**

> `shot on 35mm anamorphic, Kodak Vision3 500T pushed one stop, single practical light source, heavy atmospheric haze, deep crushed blacks with lifted shadow detail, desaturated palette of warm rust and cold bone, wet surfaces with specular highlights, visible film grain, subtle halation on highlights, shallow depth of field, night exterior, no text, no signage, no lens flare artifacts, no digital sharpening`

**NEGATIVE / avoid list (every prompt):**

> `no cgi look, no octane render, no HDR, no oversaturation, no purple or teal cast, no Halloween decorations, no jack-o-lanterns, no cobwebs, no clowns, no visible blood, no smiling, no symmetrical AI faces, no text, no watermark, no plastic skin`

## 6.2 Consistency protocol

1. **Lock the camera before the subject.** Generate the environment plates first (barn, road, interior), lock the seeds that work, and derive every subsequent shot from those environments. The world exists before the people do.
2. **One character reference sheet per Usher.** Generate 3 Ushers, front/three-quarter/back, lock references, and reuse across all figure shots. Three recurring silhouettes is what makes a "cast" instead of a crowd of strangers.
3. **Composite, don't generate, anything with text.** Signage, license plates, painted numbers, the hex mark — all added in post from real type. Generative text is the single fastest tell.
4. **Unify in post, always.** Every asset — 100% of them — passes through one shared grade: a single LUT, the shared grain plate, a 2% halation pass, and a subtle vignette. This step is not optional and it is what buys the whole set its coherence.
5. **Generate 20, use 1.** Budget for a 20:1 ratio. The look comes from ruthless selection, not from good prompting.
6. **One real element per hero composite.** Photograph one thing yourself — a real hand, real gravel, a real piece of rusted metal, a real fog plate — and composite it into each hero asset. The human eye finds the real element and extends its credibility to the rest of the frame. This is the highest-leverage trick in the entire package.

## 6.3 Asset categories & prompt directions

**A · HERO MOTION (2 assets, 8–12s loops)**

> `A64 school bus rebuilt from mismatched salvaged panels, welded seams, plywood covering three windows, one headlight brighter than the other, idling on a wet gravel road at night, exhaust drifting sideways through fog, sickly green interior dome light glowing through dirty glass, doors closed, locked-off wide shot, camera static, fog moving slowly through frame, [STYLE DNA]`

> Motion direction: minimal. Fog drift, exhaust, one slow flicker of the dome light. **Camera does not move.** Stillness in the hero is the flex — everyone else's hero is a drone shot.

**B · ENVIRONMENT PLATES (6 stills)**
Barn exterior wide (low angle from bus-door height) · barn exterior at distance across a field · gravel lot with cars and no people · the road at the point pavement ends · barn interior, one lit window from inside · the treeline.

> `A black-painted wooden barn, boards swollen with moisture, standing alone in a dead field at night, knee-high ground fog, a single window lit warm from within, low camera angle looking up, 60 percent of frame in darkness, [STYLE DNA]`

**C · THE ROAD SEQUENCE (1 asset, 14s, scroll-scrubbed)**

> `POV from inside a moving bus, looking through a scratched and fogged window, dark empty farmland passing, headlights raking a fence line, a single figure standing motionless at the fence facing away, handheld micro-vibration from the vehicle, [STYLE DNA]`

**D · FIGURE / USHER SHOTS (5 stills, 2 motion)**
Silhouette in a doorway backlit · hand on a door frame, macro · figure walking away down a hallway of hanging fabric · group of four standing in a field at distance, evenly spaced · the one face (used once, §2.6).

> `A woman in a starched high-collar cotton dress and an oilcloth apron, standing in a barn doorway, backlit by warm interior light, face fully in shadow, hair pinned severely, hands relaxed at her sides, completely still, wet ground reflecting the doorway light, [STYLE DNA]`

**E · RITUAL SPACE (3 stills)**
Perfectly symmetrical. This is the only symmetry in the package.

> `Interior of a barn, symmetrical one-point perspective, forty candles arranged in a precise geometric pattern on a dirt floor, empty wooden chairs facing away from camera, hanging chains, dust suspended in candlelight, absolutely centered composition, [STYLE DNA]`

**F · DETAIL MACROS (8 stills — the connective tissue)**
Rust on a bolt head · wet wood grain · a chain link · candle wax on dirt · a boot in mud · condensation on bus glass · a hand-painted number on metal · frayed rope. These are the cheapest assets to generate and the ones that make the site feel *tactile*. Use them as section dividers, card backgrounds, and hover states.

**G · TEXTURE PLATES (5, for overlay)**
Grain plate (shot or sourced, not generated) · fog/atmosphere plate with alpha · light leak · water on glass · paper/xerox scan.

**H · THE UNCANNY SET (3 — deploy sparingly)**
The surreal accents. One image per major section maximum.
> Direction: something almost-right. A field of chairs facing one direction. A hallway that is one degree off-level. Forty pairs of shoes arranged in a row. Nothing monstrous — *arrangement* is the horror.

## 6.4 Sequencing generated assets into the scroll

| Section | Primary asset | Supporting | Repurpose |
|---|---|---|---|
| 01 Hero | A1 (bus motion) | Fog plate, grain | Poster frame → OG image, ads |
| 02 Summons | — (type only) | Grain only | — |
| 03 Road | C1 (scrub) | F: condensation macro | Extract 3 frames → email header |
| 04 Arrival | B1 (barn low) | Fog plate | → Merch, poster, ticket back |
| 05 Rite | E1–E3 (symmetric) | F macros ×3 | Chamber cards |
| 06 Passage | D2 (hand macro) | Texture: xerox | Tier card grounds |
| 07 Manifest | — (type only) | Xerox plate | — |
| 08 Recovered | H1–H3 + rejects | All | **Use the near-misses here** |

**The rejects strategy:** the generations that are 90% right but slightly wrong — a hand with bad geometry, a face that doesn't resolve, a spatial error — go in §08 Recovered, treated as degraded found footage with heavy compression and a timestamp. AI's failure modes become the aesthetic when they're framed as damaged evidence. This is how you turn your waste into your most unsettling section.

---

# 7. MUST-HAVE MOMENTS (the award reel)

These are the seven things that get this site into an awards shortlist. If budget gets cut, cut anything else first.

1. **The hero that doesn't move.** In a category of drone shots and jump-scares, a static locked-off wide of an idling bus, holding, with the doors opening at 4 seconds. Restraint reads as confidence.
2. **The headlight cursor / gyroscope tilt.** Reveals content that exists nowhere else. Works on phones. Discovered by accident.
3. **The reverse-scroll splice.** Two frames that only exist when you scroll up. Unverifiable by design.
4. **`SEAT 07 — OCCUPIED`.** A five-character detail, never explained, on every departure. Free to build. Enormous to talk about.
5. **The seat-number reveal on signup.** A form submission that ends in a full-screen number is a moment of *identity*, not a confirmation. It's also instantly screenshottable.
6. **The FAQ as a document you weren't supposed to read.** The single most-shared page. Written so that every answer is functionally useful and tonally wrong.
7. **The reduced-motion version being genuinely beautiful.** Nobody does this. Doing it is both an accessibility win and a craft signal that juries notice.

---

# 8. BOLD IDEAS

**The Closed State.** For ten months of the year the site is not a "coming soon" page. It is a single full-screen shot of the barn in daylight — mundane, empty, unremarkable, almost disappointing — with one line: `not yet.` and a field: `TELL ME WHEN IT OPENS AGAIN`. The off-season is the longest-running brand asset you have. Make it the best page on the internet for eleven months and the season sells itself.

**The Route.** The location is never published. 48 hours before your departure, ticket holders receive a text with coordinates for a gravel lot. That's it. The secrecy is operationally trivial and narratively enormous — and it makes the site's job "prepare you," not "inform you."

**The Ninth Seat.** One seat per departure is not for sale. It's requested via a hidden route (`/nine`) discoverable only through the headlight cursor on §05. The request form asks one question: *why should it be you?* Selected guests get the seat free, are boarded separately, and have a materially different night. Cost to the business: 22 tickets a season. Value: an entire mythology and a stream of first-person accounts you didn't have to write.

**Nobody agrees.** Because phones are collected, every guest account is written from memory. Lean in: the Recovered section publishes contradictory guest accounts side by side, same night, incompatible details. The brand's most credible marketing is its guests disagreeing about what happened.

**One physical artifact.** Every guest leaves with something small, cheap, and specific — a stamped metal seat tag with their number. It costs under a dollar. It lives on keychains for years and it is a walking, permanent, offline ad.

**The bell.** One sound, 47-second interval, on the site all season. In the last week before opening, it starts ringing eleven seconds faster each day. Nobody will be able to prove it changed. Everyone who noticed will tell someone.

---

# 9. EXECUTION ROADMAP

**Stack:** Next.js (App Router) · Lenis + GSAP ScrollTrigger · OGL or Three.js for the headlight mask and grain shader · Mux or Cloudflare Stream for adaptive video · Vercel · Shopify Headless or Stripe + a seat-inventory service for ticketing · Resend for transactional email.

| Phase | Duration | Output | Owner |
|---|---|---|---|
| **1 · Lock the world** | Week 1 | This document approved. Style DNA string frozen. Palette + type licensed. Broken Hex drawn. | CD |
| **2 · Media sprint** | Weeks 2–3 | Environment plates generated & locked. Usher reference sheets locked. Shared LUT + grain plate built. 20:1 selection pass. | AI media lead + retoucher |
| **3 · Hero proof** | Week 3 | Build §01 only, production quality, tested on a real mid-tier Android. **Go/no-go gate.** If the hero doesn't work on a phone, nothing else matters. | Dev + CD |
| **4 · Copy lock** | Week 3 | All copy final, including the legal/safety FAQ answers reviewed by ops and counsel. Voice is not editable after this. | Writer |
| **5 · Scroll build** | Weeks 4–6 | §02–05 with scrub, parallax, splices, blinks. Reduced-motion version built in parallel, not after. | Dev |
| **6 · Commerce** | Weeks 5–6 | Passage, seat inventory, manifest, transactional email, the `/nine` route. | Dev |
| **7 · Sound & polish** | Week 7 | Audio bed, the bell, idle states, micro-interactions, 404. | Sound + dev |
| **8 · Hardening** | Week 8 | Perf budget, a11y audit, device matrix (iOS Safari is the risk), load test the on-sale. | QA |
| **9 · Closed State live** | Week 8 | Ship the off-season page and the newsletter capture *before* announcing. Build the list in the dark. | — |
| **10 · Season** | Ongoing | One new Recovered item weekly. Manifest live. Bell accelerating in week 8. | CD |

**Critical path risk:** iOS video autoplay and scroll-scrub performance. Prototype this in week 1, not week 5. If scrub is unreliable on target devices, fall back to a 60-frame AVIF sequence — it will look nearly identical and it will never stutter.

**Measure:** seats sold before first paid impression · manifest signups per session · scroll depth to §07 · FAQ share rate · returning visitors during season (Recovered is working or it isn't).

---

*The barn was here before the road was.*
