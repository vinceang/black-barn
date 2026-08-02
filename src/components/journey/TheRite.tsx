import { useEffect, useRef, useState } from "react";
import { Grain } from "@/components/texture/Grain";
import { CHAMBERS } from "@/lib/media";
import { cn } from "@/lib/cn";
import styles from "./TheRite.module.css";

/** How far the plate lags its panel, as a fraction of viewport width. */
const PARALLAX = 0.14;

/**
 * §05 THE RITE — three chambers, full bleed.
 *
 * "Each chamber: one hero still, one texture plate, one detail macro. No
 * explanation of what happens. Withhold everything."
 *
 * Desktop pins the section and moves the track one viewport per chamber, so
 * the scroll is doing something legible: taking you from one room to the next.
 * Each plate also moves against its own panel, which is what gives the
 * transition depth rather than the feel of a flat strip sliding by.
 *
 * Mobile does not pin — it gets a native scroll-snap carousel of full-screen
 * panels, because hijacking a phone's horizontal scroll to a vertical gesture
 * is worse than the thing it replaces.
 */
export function TheRite() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const desktop = window.matchMedia("(min-width: 48rem)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let eased = 0;

    const paint = () => {
      const width = window.innerWidth;

      // Exactly one viewport per chamber. Measuring scrollWidth instead would
      // reintroduce a dependency on padding and gaps that has no business
      // deciding how far one room is from the next.
      const distance = (CHAMBERS.length - 1) * width;
      track.style.transform = `translate3d(${-eased * distance}px, 0, 0)`;

      // Each plate drifts against its panel. Offset is measured from how far
      // that panel is from the centre of the screen, so the effect is strongest
      // mid-transition and settles to zero when a chamber is square on.
      const centre = eased * (CHAMBERS.length - 1);
      imageRefs.current.forEach((image, i) => {
        if (!image) return;
        image.style.transform = `translate3d(${(i - centre) * width * PARALLAX}px, 0, 0)`;
      });

      setActive(Math.round(centre));
    };

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      eased += (progress - eased) * 0.12;
      paint();

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!desktop.matches || still.matches) {
        track.style.transform = "";
        for (const image of imageRefs.current) if (image) image.style.transform = "";
        setActive(0);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    start();
    desktop.addEventListener("change", start);
    still.addEventListener("change", start);
    window.addEventListener("resize", start);

    return () => {
      cancelAnimationFrame(frame);
      desktop.removeEventListener("change", start);
      still.removeEventListener("change", start);
      window.removeEventListener("resize", start);
    };
  }, []);

  // Mobile: the native carousel drives the rail, since nothing else does.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(min-width: 48rem)").matches) return;

    const onScroll = () => {
      setActive(Math.round(track.scrollLeft / Math.max(1, window.innerWidth)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="the-rite" ref={sectionRef} className={styles.rite}>
      <h2 className={styles.heading}>The Rite</h2>

      <div className={styles.viewport}>
        <div ref={trackRef} className={styles.track}>
          {CHAMBERS.map((chamber, i) => (
            <article key={chamber.numeral} className={styles.chamber}>
              <div className={cn(styles.plate, "hud", "hud--bleed")}>
                <picture>
                  <source srcSet={chamber.avif} type="image/avif" />
                  <img
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    className={styles.image}
                    src={chamber.jpg}
                    alt={chamber.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </picture>
                <Grain variant="media" />
                <div className={styles.scrim} />
              </div>

              <div className={styles.caption}>
                <p className={`t-signage ${styles.numeral}`}>{chamber.numeral}</p>
                <h3 className={`t-invitation ${styles.title}`}>{chamber.title}</h3>
                <p className={`t-record ${styles.line}`}>{chamber.line}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Three rungs. Which room you are in, and that there are three. */}
        <div className={styles.rail} aria-hidden="true">
          {CHAMBERS.map((chamber, i) => (
            <span
              key={chamber.numeral}
              className={cn(styles.rung, i === active && styles.rungActive)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
