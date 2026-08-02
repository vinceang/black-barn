import { useEffect, useRef, useState } from "react";
import { Signal } from "@/components/texture/Signal";
import { BrokenHex } from "@/components/BrokenHex";
import { cn } from "@/lib/cn";
import styles from "./Summons.module.css";

/**
 * §02 — copy is final (§5). Do not paraphrase, do not add to it.
 * The first three lines are Invitation; the fourth is Record, and the shift
 * between the two is the scare.
 */
const LINES = [
  "Every autumn the barn opens.",
  "Forty people are driven out to it.",
  "Everyone comes back.",
] as const;

const ASIDE = "that has always been true.";

/** §02 — "each line arriving with a 240ms delay". */
const STAGGER_MS = 240;

/**
 * How far each line travels as the section passes, in px, and in what
 * direction. Nearest line moves most. The aside moves against the others —
 * it is the one that disagrees with them, so it should not travel with them.
 */
const DRIFT = [110, 64, 26] as const;
const ASIDE_DRIFT = -70;

/**
 * §02 THE SUMMONS
 *
 * No image, no media, no scroll trickery — a section made of typography and
 * patience. The entrance is an IntersectionObserver rather than ScrollTrigger:
 * it is a one-shot, not a scrubbed timeline, and it should not make the site
 * pay for GSAP before §03 genuinely needs it.
 *
 * The drift afterwards is what stops it going dead. Each line travels at its
 * own rate as the section crosses the viewport, so the block is never twice in
 * the same arrangement and the type reads as suspended in the dark rather than
 * printed on it.
 */
export function Summons() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const asideRef = useRef<HTMLParagraphElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Reduced motion has nothing to wait for — the finished state is the state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Well inside the viewport: the lines should begin once the section is
      // committed to, not the instant its top edge clips the fold.
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const tick = () => {
      const rect = node.getBoundingClientRect();
      // -1 when the section is entering from below, +1 when it has left above.
      const centre = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const t = Math.max(-1, Math.min(1, centre));

      lineRefs.current.forEach((line, i) => {
        if (line) line.style.transform = `translate3d(0, ${t * DRIFT[i]}px, 0)`;
      });
      if (asideRef.current) {
        asideRef.current.style.transform = `translate3d(0, ${t * ASIDE_DRIFT}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="summons" ref={sectionRef} className={styles.summons}>
      {/* The void is transmitting. */}
      <Signal />
      <BrokenHex className={styles.mark} size="auto" />

      <div className={cn(styles.lines, "signal-tear")}>
        {LINES.map((line, i) => (
          <p
            key={line}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className={cn("t-invitation", styles.line, revealed ? styles.shown : styles.hidden)}
            style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
          >
            {line}
          </p>
        ))}

        <p
          ref={asideRef}
          className={cn("t-record", styles.aside, revealed ? styles.shown : styles.hidden)}
          // Arrives after the last Invitation line has fully settled, so the
          // change of voice lands on its own rather than inside the rhythm.
          style={{ transitionDelay: `${LINES.length * STAGGER_MS + 400}ms` }}
        >
          {ASIDE}
        </p>
      </div>
    </section>
  );
}
