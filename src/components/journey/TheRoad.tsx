import { useEffect, useRef, useState } from "react";
import { Grain } from "@/components/texture/Grain";
import { ROAD } from "@/lib/media";
import { cn } from "@/lib/cn";
import styles from "./TheRoad.module.css";

/**
 * §03 — copy is final (§5). A log, written by whoever writes things down.
 * `at` is scroll progress through the pinned section.
 */
const LOG = [
  { at: 0.04, time: "00:00", text: "you get on" },
  { at: 0.33, time: "03:40", text: "the pavement ends" },
  { at: 0.65, time: "07:15", text: "phones stop working" },
  { at: 0.93, time: "11:00", text: "you arrive" },
] as const;

/** The bus never stops. Even untouched, the road keeps coming. */
const IDLE_RATE = 0.55;
/** Hard scrolling drives it here. Above ~4 the decoder starts dropping frames. */
const MAX_RATE = 3.8;

/**
 * §03 THE ROAD — the ride.
 *
 * THIS DOES NOT SCRUB, AND THAT IS THE POINT. The first build drove
 * currentTime from scroll position, which failed three ways at once: the
 * playhead was damped so small scrolls barely moved it, 300vh of scroll bought
 * only ten seconds of footage, and seeking a video frame-by-frame is mushy
 * even when it is all-intra. The world lagged behind the hand, so the section
 * read as broken rather than slow.
 *
 * Instead the clip plays continuously and the scroll drives its SPEED. Two
 * things follow, and both matter:
 *
 *   - The section is alive the moment you reach it. Nothing to discover, no
 *     gesture required before anything happens.
 *   - Scrolling accelerates the road instead of dragging a playhead. Pushing
 *     the throttle is direct in a way that scrubbing a timeline is not.
 *
 * §3.2.3's reverse splice survives intact — it was always keyed to scroll
 * direction, never to the playhead.
 */
export function TheRoad() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [splicing, setSplicing] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    setMotionAllowed(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // The clip is ~2.2MB and must not compete with §01's hero for bandwidth, so
  // it is fetched only as the section comes within reach.
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
      { rootMargin: "200% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!motionAllowed) {
      // §3.4 — the still design. Every log entry is present from the start.
      setProgress(1);
      return;
    }

    const video = videoRef.current;
    void video?.play().catch(() => {
      /* Refused autoplay leaves the poster, which is a complete design. */
    });

    let lastY = window.scrollY;
    let velocity = 0;
    let lastProgress = 0;
    let splicedThisPass = false;
    let spliceTimer = 0;
    let frame = 0;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const target = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      // Scroll speed, smoothed just enough to stop it flickering between
      // frames. This is a throttle, not a playhead — it can afford to be
      // responsive in a way a scrub position cannot.
      const dy = Math.abs(window.scrollY - lastY);
      velocity += (dy - velocity) * 0.25;
      lastY = window.scrollY;

      if (video && !video.paused) {
        video.playbackRate = Math.min(MAX_RATE, IDLE_RATE + velocity * 0.16);
      }

      // §3.2.3 — the reverse splice. Only on the way back up, only at a fixed
      // depth, and only once per traversal so it cannot strobe if someone
      // scrolls jitterily across the threshold.
      const reversing = target < lastProgress - 0.0005;
      if (
        reversing &&
        lastProgress >= ROAD.splice.at &&
        target < ROAD.splice.at &&
        !splicedThisPass
      ) {
        splicedThisPass = true;
        setSplicing(true);
        spliceTimer = window.setTimeout(() => setSplicing(false), ROAD.splice.durationMs);
      }
      if (target > ROAD.splice.at + 0.02) splicedThisPass = false;
      lastProgress = target;

      setProgress(target);

      // The frame pushes in hard across the section, and the push is driven
      // straight off scroll position with no easing — every pixel of scroll
      // moves something immediately.
      if (mediaRef.current) {
        mediaRef.current.style.transform = `scale(${1 + target * 0.38})`;
      }

      if (progressRef.current) {
        progressRef.current.style.width = `${target * 100}%`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(spliceTimer);
    };
  }, [motionAllowed, nearby]);

  // The most recent marker the ride has passed.
  const current = LOG.reduce<(typeof LOG)[number] | null>(
    (acc, entry) => (progress >= entry.at ? entry : acc),
    null,
  );

  return (
    <section id="the-road" ref={sectionRef} className={styles.road} aria-label="The road">
      <div className={cn(styles.frame, "hud", "hud--bleed")}>
        <div ref={mediaRef} className={styles.media}>
          {/* The poster is the floor: what reduced motion shows, what a refused
              autoplay falls back to, and what fills the frame until the clip
              has arrived. */}
          <picture>
            <source srcSet={ROAD.poster.avif} type="image/avif" />
            <img className={styles.plate} src={ROAD.poster.jpg} alt={ROAD.alt} loading="lazy" />
          </picture>

          {motionAllowed && nearby ? (
            <video
              ref={videoRef}
              className={styles.plate}
              src={ROAD.video.mp4}
              width={ROAD.video.width}
              height={ROAD.video.height}
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />
          ) : null}

          <img
            className={cn(styles.splice, splicing && styles.spliceVisible)}
            src={ROAD.splice.jpg}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>

        <Grain variant="media" />
        <div className={styles.vignette} />

        <div className={styles.progress}>
          <div ref={progressRef} className={styles.progressFill} />
        </div>

        {current ? (
          <>
            <div className={styles.markerGround} />
            <div className={styles.marker}>
              {/* Keyed on the marker so the arrival animation replays each
                  time the ride passes another one. */}
              <p
                key={`${current.time}-t`}
                className={cn("t-signage", styles.markerTime, styles.markerIn)}
              >
                {current.time}
              </p>
              <p
                key={`${current.time}-x`}
                className={cn("t-record", styles.markerText, styles.markerIn)}
              >
                {current.text}
              </p>
            </div>
          </>
        ) : null}

      </div>
    </section>
  );
}
