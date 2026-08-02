import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./Cursor.module.css";

/** §3.3 — copy is final. */
const RESTRICTED_LABEL = "NOT FOR YOU";

type State = "idle" | "link" | "restricted";

/**
 * §3.3 CURSOR STATES.
 *
 * "Restricted" is not decorative: it marks the things the site will not sell
 * you — a departure that is FULL, or one the bus has already made. §06 renders
 * those as disabled buttons, and a disabled control gives no hover feedback of
 * its own, so this is what tells you the refusal was deliberate rather than
 * broken.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      setVisible(true);

      const el = event.target as Element | null;
      if (el?.closest?.("[data-restricted], button:disabled")) setState("restricted");
      else if (el?.closest?.("a, button, summary, input, textarea")) setState("link");
      else setState("idle");
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      // §3.2.2's lag, applied to the pointer ring as well — the light is heavy
      // wherever it appears.
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (ref.current) ref.current.style.translate = `${cx}px ${cy}px`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "t-record",
        styles.cursor,
        visible && styles.visible,
        state === "link" && styles.link,
        state === "restricted" && styles.restricted,
      )}
    >
      <span className={styles.ring} />
      <span className={styles.label}>{RESTRICTED_LABEL}</span>
    </div>
  );
}
