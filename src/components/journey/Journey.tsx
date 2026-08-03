import { useEffect } from "react";
import Lenis from "lenis";
import { Threshold } from "./Threshold";
import { TheBus } from "./TheBus";
import { Summons } from "./Summons";
import { TheRoad } from "./TheRoad";
import { Arrival } from "./Arrival";
import { TheRite } from "./TheRite";
import { Phenomena } from "./Phenomena";
import { Rail } from "./Rail";
import { Cursor } from "./Cursor";
import { Header } from "./Header";
import { motion } from "@/lib/tokens.generated";

/**
 * §00–§05, THE JOURNEY — one island.
 *
 * The scroll is a single continuous timeline: the Threshold hands off to the
 * hero, the hero's dwell clock starts when the Threshold clears, and §03's
 * scrub and §05's pin will share the same Lenis instance and the same
 * ScrollTrigger context. Splitting these across islands would mean several
 * hydration boundaries settling at different times against one timeline, so
 * they stay together deliberately.
 *
 * §06–§07 are separate islands. They are forms and inventory, not scroll.
 */
export function Journey({ thresholdLine, eyebrow }: { thresholdLine: string; eyebrow: string }) {
  // §3.1 — "Smooth scroll (Lenis) with a lerp of 0.075. Scroll has weight,
  // like a heavy door." Never constructed under reduced motion: hijacking
  // scroll is itself motion, and §3.4's second design gets honest scrolling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: motion.lenisLerp });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // ── SCROLLTRIGGER SEAM ────────────────────────────────────────────────
    // When §03's scrub and §05's pin land, they are created here, and
    // ScrollTrigger.refresh() must be called after this island has hydrated
    // and the hero media has settled. Islands hydrate late; ScrollTrigger
    // measures on creation, so it will otherwise cache heights taken before
    // the poster, the fonts, and 100dvh have resolved — which reads as a pin
    // that starts in the wrong place and a scrub that drifts.
    //   lenis.on("scroll", ScrollTrigger.update);
    //   requestAnimationFrame(() => ScrollTrigger.refresh());
    // ──────────────────────────────────────────────────────────────────────

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Threshold line={thresholdLine} />
      <main>
        <TheBus eyebrow={eyebrow} />
        <Summons />
        <TheRoad />
        <Arrival />
        <TheRite />
      </main>

      {/* §3.2.4–6, §3.3, §3.2.7 — the layers that sit over everything. */}
      <Header />
      <Rail />
      <Phenomena />
      <Cursor />
    </>
  );
}
