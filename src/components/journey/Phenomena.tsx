import { useEffect, useState } from "react";
import styles from "./Phenomena.module.css";

/** §3.2.4 — 84ms total. Matches --dur-splice. */
const SPLICE_MS = 84;
/** §3.2.5 — 130ms. Matches --dur-blink. */
const BLINK_MS = 130;
/** §3.2.6 — "After 24 seconds of no input". */
const IDLE_MS = 24_000;
/** §3.2.6 — the title holds for six seconds, then goes back. */
const IDLE_TITLE_MS = 6_000;
const IDLE_TITLE = "still there?";

/**
 * §3.2.5 — "At three fixed scroll depths (not random — QA'd, deterministic)".
 *
 * Fractions of total page height. Fixed values, not random, so that two people
 * comparing notes are describing the same three moments — which is the point
 * of an effect nobody is ever told about.
 */
const BLINK_DEPTHS = [0.28, 0.52, 0.79] as const;

/** Section boundaries the splice fires on, in document order. */
const SPLICE_TARGETS = ["#summons", "#the-road", "#arrival", "#the-rite", "#passage"] as const;

/**
 * §3.2.4–6 — THE SPLICE, THE BLINK, THE IDLE.
 *
 * All three are disabled entirely under prefers-reduced-motion. §3.2.5 says so
 * explicitly for the Blink; the same reasoning covers the other two, and the
 * §3.4 second design is a still, typographic site with no interruptions in it.
 *
 * The Blink deliberately does not change anything on the page. §3.2.5 wants an
 * element to have moved when the light returns, and the honest way to build
 * that is against real state — a seat count that actually drops, a door plate
 * that actually differs. Faking it with a CSS nudge would be a trick played on
 * the viewer rather than a detail they caught, so the darkness ships and the
 * change waits for §07's live inventory to drive it. See the note in README.
 */
export function Phenomena() {
  const [splicing, setSplicing] = useState(false);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let spliceTimer = 0;
    let blinkTimer = 0;

    // ---------------------------------------------------------- the splice --
    const sections = SPLICE_TARGETS.map((id) => document.querySelector(id)).filter(
      (el): el is Element => Boolean(el),
    );

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only on the way in, and only once each. A cut that repeats every
          // time you scroll past is a flicker, not an edit.
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          setSplicing(true);
          window.clearTimeout(spliceTimer);
          spliceTimer = window.setTimeout(() => setSplicing(false), SPLICE_MS);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const section of sections) observer.observe(section);

    // ----------------------------------------------------------- the blink --
    const fired = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = window.scrollY / max;

      BLINK_DEPTHS.forEach((mark, i) => {
        if (fired.has(i) || Math.abs(depth - mark) > 0.006) return;
        fired.add(i);
        setBlinking(true);
        window.clearTimeout(blinkTimer);
        blinkTimer = window.setTimeout(() => setBlinking(false), BLINK_MS);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ------------------------------------------------------------ the idle --
    // §3.2.6 — "One time per session."
    let idleTimer = 0;
    let idleUsed = false;
    const title = document.title;

    const goIdle = () => {
      if (idleUsed) return;
      idleUsed = true;
      document.title = IDLE_TITLE;
      window.setTimeout(() => {
        document.title = title;
      }, IDLE_TITLE_MS);
    };

    const resetIdle = () => {
      window.clearTimeout(idleTimer);
      if (!idleUsed) idleTimer = window.setTimeout(goIdle, IDLE_MS);
    };

    const INPUTS = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    for (const event of INPUTS) window.addEventListener(event, resetIdle, { passive: true });
    resetIdle();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      for (const event of INPUTS) window.removeEventListener(event, resetIdle);
      window.clearTimeout(spliceTimer);
      window.clearTimeout(blinkTimer);
      window.clearTimeout(idleTimer);
      document.title = title;
    };
  }, []);

  return (
    <>
      {splicing ? <div className={`${styles.layer} ${styles.splice}`} aria-hidden="true" /> : null}
      {blinking ? <div className={`${styles.layer} ${styles.blink}`} aria-hidden="true" /> : null}
    </>
  );
}
