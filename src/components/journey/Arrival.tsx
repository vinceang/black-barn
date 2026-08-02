import { useEffect, useRef, useState } from "react";
import { Grain } from "@/components/texture/Grain";
import { BrokenHex } from "@/components/BrokenHex";
import { ARRIVAL } from "@/lib/media";
import { cn } from "@/lib/cn";
import styles from "./Arrival.module.css";

/**
 * §04 ARRIVAL
 *
 * The site's one moment of stillness. The camera does not move here and there
 * is no parallax, no scrub and no push-in — after §03's eleven minutes the
 * most expensive thing the site can do is stop.
 *
 * Stillness is not the same as a still image, though. A photograph of a barn
 * reads as a photograph; fog moving through the frame is what makes it read as
 * a place you have arrived at. So the plate is a locked-off clip whose only
 * event is the lit window flickering once, as though something inside passed
 * in front of it.
 *
 * The only interface event is one line of Record type arriving after the
 * section is 60% travelled — the brief withholds copy until then, and that
 * silence is the section.
 */
export function Arrival() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [arrived, setArrived] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setMotionAllowed(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => setVideoReady(true);
    if (video.readyState >= 2) reveal();
    video.addEventListener("loadeddata", reveal, { once: true });

    // The doors are a one-way event. Fall back to the tail, where they are
    // already open, rather than starting over and slamming them shut.
    const onEnded = () => {
      video.currentTime = ARRIVAL.loopFrom;
      void video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);

    void video.play().catch(() => {});
    return () => {
      video.removeEventListener("loadeddata", reveal);
      video.removeEventListener("ended", onEnded);
    };
  }, [motionAllowed, nearby]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!motionAllowed) {
      setArrived(true);
      return;
    }

    let frame = 0;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const travelled = (window.innerHeight - rect.top) / (rect.height + window.innerHeight);
      if (travelled >= 0.6) {
        setArrived(true);
        return; // §04 — it arrives once. It does not leave again.
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motionAllowed]);

  return (
    <section id="arrival" ref={sectionRef} className={styles.arrival} aria-label="Arrival">
      <div className={styles.plate}>
        <picture>
          <source srcSet={ARRIVAL.avif} type="image/avif" />
          <img
            className={styles.image}
            src={ARRIVAL.jpg}
            alt={ARRIVAL.alt}
            width={ARRIVAL.width}
            height={ARRIVAL.height}
            loading="lazy"
          />
        </picture>

        {motionAllowed && nearby ? (
          <video
            ref={videoRef}
            className={cn(styles.image, styles.video, videoReady && styles.videoReady)}
            src={ARRIVAL.video.mp4}
            width={ARRIVAL.video.width}
            height={ARRIVAL.video.height}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}

        <BrokenHex className={styles.hex} size="auto" />

        <Grain variant="media" />
        <div className={styles.vignette} />
      </div>

      <p className={cn("t-record", styles.line, arrived && styles.lineShown)}>you are here now</p>
    </section>
  );
}
