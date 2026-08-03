import { useEffect, useState } from "react";
import { BrokenHex } from "@/components/BrokenHex";
import { EngineToggle } from "./EngineToggle";
import { cn } from "@/lib/cn";
import styles from "./Header.module.css";

/** Below this the header is simply transparent over the hero. */
const VEIL_AT = 80;
/** Ignore jitter — a header that flickers on every micro-scroll is worse than none. */
const THRESHOLD = 8;

/**
 * THE HEADER.
 *
 * Transparent over §01, veiled once the page moves, withdrawn while scrolling
 * down and returned on the way up — so the journey is never framed by a bar,
 * and there is always a way back to the top without one taking up residence.
 *
 * It carries the engine toggle. §3.2.7 wants that control persistent, but on
 * its own in a corner it read as the site's primary action; docked in the
 * header it stays reachable and stops competing with §01's CTA.
 */
export function Header() {
  const [veiled, setVeiled] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const tick = () => {
      const y = window.scrollY;
      const delta = y - last;

      setVeiled(y > VEIL_AT);

      if (Math.abs(delta) > THRESHOLD) {
        // Never withdraw at the very top: there is nothing above to go back to,
        // and the hero should not be entered by something sliding away.
        setWithdrawn(delta > 0 && y > VEIL_AT * 2);
        last = y;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header
      className={cn(styles.header, veiled && styles.veiled, withdrawn && styles.withdrawn)}
    >
      <a className={styles.brand} href="#the-bus" aria-label="The Black Barn — top">
        <BrokenHex className={styles.mark} size="auto" />
        <span className={cn("t-signage", styles.wordmark)}>The Black Barn</span>
      </a>

      <div className={styles.actions}>
        <a className={cn("t-signage", styles.claim)} href="#passage">
          Claim a seat
        </a>
        <EngineToggle />
      </div>
    </header>
  );
}
