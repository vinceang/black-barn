import { useEffect, useRef, useState } from "react";
import { Engine } from "@/lib/audio";
import { cn } from "@/lib/cn";
import styles from "./Engine.module.css";

/** §5.2 / §5.5 — copy is final. */
const OFF = "Turn on the engine";
const ON = "The engine is running";

/**
 * §3.2.7 THE ENGINE
 *
 * "Do not autoplay audio. The opt-in *is* the ritual."
 *
 * So nothing is fetched, decoded or constructed until this button is pressed —
 * the three audio files are not in the initial payload and the AudioContext
 * does not exist. Pressing it is also the user gesture browsers require, which
 * means the correct implementation and the required one are the same thing.
 */
export function EngineToggle() {
  const engineRef = useRef<Engine | null>(null);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);

  // §3.2.7 — "Scroll velocity modulates wind volume."
  useEffect(() => {
    if (!running) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let frame = 0;

    const tick = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const dy = Math.abs(window.scrollY - lastY);
      // px/ms, normalised against a brisk flick.
      engineRef.current?.setScrollVelocity(dy / dt / 3);
      lastY = window.scrollY;
      lastT = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  useEffect(() => () => engineRef.current?.stop(), []);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);

    if (running) {
      engineRef.current?.stop();
      setRunning(false);
    } else {
      engineRef.current ??= new Engine();
      await engineRef.current.start();
      setRunning(true);
    }

    setBusy(false);
  };

  return (
    <button
      type="button"
      className={cn("t-record", styles.engine, running && styles.running)}
      onClick={toggle}
      aria-pressed={running}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{running ? ON : OFF}</span>
    </button>
  );
}
