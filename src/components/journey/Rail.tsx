import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./Rail.module.css";

/**
 * The stops, in scroll order. Numbers match §4's section numbering so the rail
 * and the creative direction refer to the same things.
 */
const STOPS = [
  { id: "the-bus", n: "01", name: "The Bus" },
  { id: "summons", n: "02", name: "The Summons" },
  { id: "the-road", n: "03", name: "The Road" },
  { id: "arrival", n: "04", name: "Arrival" },
  { id: "the-rite", n: "05", name: "The Rite" },
  { id: "passage", n: "06", name: "Passage" },
  { id: "manifest", n: "07", name: "The Manifest" },
  { id: "recovered", n: "08", name: "Recovered" },
  { id: "questions", n: "09", name: "The Questions" },
  { id: "notice", n: "10", name: "The Notice" },
] as const;

/**
 * THE RAIL — a fixed index of the journey.
 *
 * The site is one continuous scroll of eleven parts with no navigation at all,
 * which meant no way to tell how far in you were, how much was left, or that
 * §08–§10 existed. It is also a way back: the only route from the barn to the
 * booking form was to scroll the whole ride again.
 *
 * Position is resolved by asking which section currently covers the middle of
 * the viewport, rather than by IntersectionObserver ratios — §03 and §05 are
 * multiple viewports tall and pinned, so ratio-based observers report them as
 * barely visible exactly when they fill the screen.
 */
export function Rail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Pointer devices only; the CSS hides it elsewhere and there is no reason
    // to run a scroll loop for something nobody can see.
    if (!window.matchMedia("(min-width: 64rem) and (pointer: fine)").matches) return;

    let frame = 0;
    const tick = () => {
      const middle = window.innerHeight / 2;
      let found = 0;

      STOPS.forEach((stop, i) => {
        const el = document.getElementById(stop.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= middle && rect.bottom >= middle) found = i;
      });

      setActive(found);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <nav aria-label="Sections">
      <ol className={styles.rail}>
        {STOPS.map((stop, i) => (
          <li key={stop.id} className={styles.item}>
            <a
              href={`#${stop.id}`}
              className={cn("t-signage", styles.link, i === active && styles.current)}
              aria-current={i === active ? "true" : undefined}
            >
              <span className={styles.name}>
                {stop.n} {stop.name}
              </span>
              <span className={styles.tick} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
