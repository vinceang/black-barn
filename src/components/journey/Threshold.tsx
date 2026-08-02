import { useEffect, useState } from "react";
import { clearThreshold } from "@/lib/signals";
import styles from "./Threshold.module.css";

/** §00 — "Holds for 1.8s or until first input." */
const HOLD_MS = 1800;

const DISMISS_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/**
 * §00 THE THRESHOLD
 *
 * Purpose, per the brief: "establishes that this thing has a schedule and a
 * capacity before it establishes what it is."
 *
 * Rendered on the server so it is on screen in the first paint — a preloader
 * that appears late is just a flash of content.
 */
export function Threshold({ line }: { line: string }) {
  const [held, setHeld] = useState(true);

  useEffect(() => {
    const dismiss = () => {
      setHeld(false);
      clearThreshold();
    };

    const timer = window.setTimeout(dismiss, HOLD_MS);
    for (const event of DISMISS_EVENTS) {
      window.addEventListener(event, dismiss, { passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const event of DISMISS_EVENTS) {
        window.removeEventListener(event, dismiss);
      }
    };
  }, []);

  /*
   * The scroll lock is keyed on `held`, NOT on mount.
   *
   * Returning null does not unmount this component — it stays in the tree, so
   * a cleanup registered in a mount-only effect never runs and the lock is
   * never released. That shipped, and it was invisible on desktop: Lenis
   * intercepts wheel events and scrolls programmatically, which is unaffected
   * by overflow:hidden. Touch devices get native scrolling, which is exactly
   * what overflow:hidden blocks — so the page was simply dead on a phone.
   */
  useEffect(() => {
    if (!held) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [held]);

  if (!held) return null;

  return (
    <div className={styles.threshold} role="status" aria-live="polite">
      <p className={`t-record ${styles.line}`}>{line}</p>
    </div>
  );
}
