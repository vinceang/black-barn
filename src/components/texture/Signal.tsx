import { useEffect, useRef } from "react";

/**
 * THE SIGNAL — an untuned television behind the text-only sections.
 *
 * §02 is void and typography by design ("No image. Just enormous Invitation
 * type"), which left it with nothing to answer a scroll. This gives the void
 * something happening in it without putting a picture there: the section is
 * still black and still type, but the black is now transmitting.
 *
 * Intensity tracks scroll velocity, so the noise rises as you move and settles
 * when you stop. That is the same idea as §3.2.7's wind, which the brief ties
 * to scroll velocity for the same reason — the site should feel like it
 * notices you.
 */
export function Signal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let velocity = 0;
    let frame = 0;

    const tick = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      // Rises fast, falls slowly — interference that snapped back the instant
      // you stopped would read as a hover effect rather than a signal.
      velocity += (Math.min(1, dy / 42) - velocity) * (dy > velocity * 42 ? 0.4 : 0.05);
      node.style.setProperty("--signal-intensity", velocity.toFixed(3));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className="signal" aria-hidden="true">
      <div className="signal__noise" />
      <div className="signal__lines" />
      <div className="signal__roll" />
    </div>
  );
}
