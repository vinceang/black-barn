/**
 * The media manifest. Every asset the site ships, with the timing marks the
 * interface needs to read off it.
 *
 * §6.4 names assets by code (A1 = bus hero motion, B1 = barn plate, C1 = the
 * road sequence, E1–E3 = the ritual set). Those codes are kept here so the
 * build and the creative package refer to the same things.
 *
 * Every still passed through scripts/grade-still.sh and every clip through
 * its encode script — §6.2.4 allows no asset in by any other route.
 */

/**
 * §01 — TWO ORIENTATIONS.
 *
 * §01's door beat ("at 4 seconds of dwell, the bus doors open") is the whole
 * point of the section, and it was invisible on phones: a centre crop of the
 * landscape master puts the entry door outside the frame, so the beat played
 * off-screen. Cropping cannot fix that — the door and both headlights cannot
 * fit in the ~26% of frame width a portrait viewport shows.
 *
 * So there are two masters, each composed for its own shape. The portrait one
 * frames the door mid-frame and leaves its lower third dark for type.
 */
export const HERO = {
  code: "A1",
  landscape: {
    poster: {
      avif: "/media/a1-bus-hero-poster.avif",
      jpg: "/media/a1-bus-hero-poster.jpg",
      width: 1600,
      height: 894,
    },
    video: { mp4: "/media/a1-bus-hero.mp4", width: 1920, height: 1072 },
  },
  portrait: {
    poster: {
      avif: "/media/a1-bus-hero-portrait-poster.avif",
      jpg: "/media/a1-bus-hero-portrait-poster.jpg",
      width: 1080,
      height: 1936,
    },
    video: { mp4: "/media/a1-bus-hero-portrait.mp4", width: 1080, height: 1936 },
  },
  /**
   * §01 — "At 4 seconds of dwell, the bus doors open."
   *
   * Dwell is measured from when the Threshold clears at 1.8s, not from page
   * load, so both clips are cut to put the door here.
   */
  doorOpensAt: 5.8,
  /**
   * Once the door is open and still, the tail loops from here indefinitely.
   * Looping the whole clip would shut the door again, and the door opening is
   * a one-way event: nothing gets out, and it does not undo itself.
   */
  loopFrom: 7.6,
  duration: 9.83,
  /**
   * §3.2.2 — what the headlight finds. Identical to the landscape plate except
   * for a second vehicle far back in the fog on the left. Composited onto the
   * locked plate rather than used as generated: the image-to-image pass
   * rescaled the frame very slightly, and a reveal that does not align
   * pixel-for-pixel makes the photograph jump as the beam crosses it.
   *
   * Landscape only — the headlight is a pointer interaction, and the portrait
   * composition has no room in frame for the second bus.
   */
  reveal: "/media/a1-bus-hero-reveal.jpg",
  alt: "A school bus rebuilt from mismatched salvaged panels, idling on a wet gravel road at night. Its door is closed.",
} as const;

export const ROAD = {
  code: "C1",
  video: {
    mp4: "/media/c1-road.mp4",
    width: 1280,
    height: 714,
  },
  poster: {
    avif: "/media/c1-road-poster.avif",
    jpg: "/media/c1-road-poster.jpg",
  },
  duration: 10.04,
  /**
   * §3.2.3 — "Scroll up, and the footage runs backward — but two frames of a
   * different shot are spliced in on the reverse only. Nobody will believe
   * each other about it."
   *
   * A different plate entirely: same road, a second vehicle back in the fog
   * that does not exist in the forward footage.
   */
  splice: {
    avif: "/media/c1-splice.avif",
    jpg: "/media/c1-splice.jpg",
    /** Scroll progress at which the cut sits. Fixed, never random — QA'd. */
    at: 0.62,
    /** Two frames at 24fps. */
    durationMs: 83,
  },
  alt: "The view forward through the windscreen of the bus: a gravel road running between bare trees into darkness, lit only by headlights.",
} as const;

export const ARRIVAL = {
  code: "B1",
  avif: "/media/b1-barn-arrival.avif",
  jpg: "/media/b1-barn-arrival.jpg",
  width: 1800,
  height: 1004,
  /**
   * §04 is "the site's one moment of stillness", which is not the same as a
   * still image — a photograph of a barn reads as a photograph, and the fog
   * rolling is what makes it read as a place you have arrived at. The camera
   * still does not move. The only event is the lit window flickering once,
   * about two thirds through, as though something passed in front of it.
   */
  video: { mp4: "/media/b1-barn-arrival.mp4", width: 1600, height: 892 },
  /**
   * Seconds. Once the doors are open and the light is out, the tail loops from
   * here. Looping the whole clip would shut them again, and — as with §01's
   * bus — a door that opens is a one-way event. It does not undo itself.
   */
  loopFrom: 7.4,
  alt: "A black-painted wooden barn alone in a dead field at night. Fog to the knees. One upper window is lit.",
} as const;

/**
 * §08 RECOVERED — the rejects.
 *
 * §6.4: "the generations that are 90% right but slightly wrong... go in §08
 * Recovered, treated as degraded found footage. AI's failure modes become the
 * aesthetic when they're framed as damaged evidence. This is how you turn your
 * waste into your most unsettling section."
 *
 * Every plate here is a take that lost its selection pass, put through
 * scripts/grade-recovered.sh. Nothing was generated for this section.
 *
 * Captions are a date and a time and nothing else (§08). Alt text describes
 * only what is visibly in the frame — it must not explain more than the image
 * does, or the screen-reader experience answers questions the page withholds.
 */
export const RECOVERED = [
  {
    stamp: "10.12 · 23:41",
    avif: "/media/r1-lot.avif",
    jpg: "/media/r1-lot.jpg",
    alt: "A bus on gravel at night, overexposed and grainy.",
  },
  {
    stamp: "10.19 · 01:07",
    avif: "/media/r2-aisle.avif",
    jpg: "/media/r2-aisle.jpg",
    alt: "A narrow vertical frame of a bus aisle, badly compressed.",
  },
  {
    stamp: "10.24 · 22:58",
    avif: "/media/r3-field.avif",
    jpg: "/media/r3-field.jpg",
    alt: "A square, faded photograph of a barn in a field.",
  },
  {
    stamp: "10.28 · 02:14",
    avif: "/media/r4-chairs.avif",
    jpg: "/media/r4-chairs.jpg",
    alt: "A high-contrast monochrome frame of empty chairs in a barn.",
  },
  {
    stamp: "10.31 · 03:36",
    avif: "/media/r5-fence.avif",
    jpg: "/media/r5-fence.jpg",
    alt: "A horizontal smear of light and dark. Nothing in it resolves.",
  },
  {
    stamp: "11.02 · 00:19",
    avif: "/media/r6-floor.avif",
    jpg: "/media/r6-floor.jpg",
    alt: "Rows of shoes on a dirt floor, lit by candles, heavily degraded.",
  },
] as const;

/**
 * §05 — three chambers. "Suddenly, symmetrical composition. This is where the
 * site tells you it's a ritual without ever saying the word." The plates are
 * the only perfectly symmetrical images in the package (§6.3 E).
 */
export const CHAMBERS = [
  {
    numeral: "I",
    title: "The Sorting",
    line: "you will be separated from your group. this is not optional.",
    avif: "/media/e1-chamber-sorting.avif",
    jpg: "/media/e1-chamber-sorting.jpg",
    alt: "Forty pairs of worn shoes arranged in two mirrored rows on a dirt floor, leading to two identical doorways.",
  },
  {
    numeral: "II",
    title: "The Congregation",
    line: "they have been waiting a full year. be gracious.",
    avif: "/media/e2-chamber-congregation.avif",
    jpg: "/media/e2-chamber-congregation.jpg",
    alt: "Rows of empty wooden chairs facing away from camera toward a lit doorway, candles set between them on the floor.",
  },
  {
    numeral: "III",
    title: "The Return",
    line: "not everyone rides back in the same seat.",
    avif: "/media/e3-chamber-return.avif",
    jpg: "/media/e3-chamber-return.jpg",
    alt: "The centre aisle of the bus at night, every seat empty, one coat left folded on a seat near the back.",
  },
] as const;
