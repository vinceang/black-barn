import { useEffect, useRef, useState } from "react";
import { Signal } from "@/components/texture/Signal";
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
 * §02 THE SUMMONS
 *
 * No image, no media, no scroll trickery — a section made entirely of
 * typography and patience. The reveal uses an IntersectionObserver rather than
 * ScrollTrigger on purpose: this is a one-shot entrance, not a scrubbed
 * timeline, and it should not make the site pay for GSAP before §03 genuinely
 * needs it.
 */
export function Summons() {
  const sectionRef = useRef<HTMLElement>(null);
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

  return (
    <section id="summons" ref={sectionRef} className={styles.summons}>
      {/* The void is transmitting. */}
      <Signal />

      <div className={cn(styles.lines, "signal-tear")}>
        {LINES.map((line, i) => (
          <p
            key={line}
            className={cn("t-invitation", styles.line, revealed ? styles.shown : styles.hidden)}
            style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
          >
            {line}
          </p>
        ))}

        <p
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
