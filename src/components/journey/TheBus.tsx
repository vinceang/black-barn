import { useEffect, useRef, useState } from "react";
import { Grain } from "@/components/texture/Grain";
import { Headlight } from "./Headlight";
import { HERO } from "@/lib/media";
import { onThresholdCleared } from "@/lib/signals";
import { cn } from "@/lib/cn";
import styles from "./TheBus.module.css";

/**
 * §01 THE BUS — the thesis.
 *
 * §7.1 calls the restraint here the whole point: "In a category of drone shots
 * and jump-scares, a static locked-off wide of an idling bus, holding, with the
 * doors opening at 4 seconds. Restraint reads as confidence."
 *
 * So this component does almost nothing, on purpose. The poster is the LCP
 * element and carries the section alone under reduced motion.
 *
 * It does pick between two masters. §01's door beat was invisible on phones,
 * because a centre crop of the landscape frame puts the entry door outside the
 * viewport — the single most important four seconds in the section played off
 * the side of the screen. The poster switches with <picture>, which is native;
 * the video has to switch in script, because the `media` attribute on a
 * <source> inside <video> was dropped from the spec and browsers ignore it.
 */
export function TheBus({ eyebrow }: { eyebrow: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState<boolean | null>(null);
  const [portrait, setPortrait] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shape = window.matchMedia("(orientation: portrait) and (max-width: 47.99rem)");

    const sync = () => {
      setMotionAllowed(!motion.matches);
      setPortrait(shape.matches);
    };
    sync();

    motion.addEventListener("change", sync);
    shape.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      shape.removeEventListener("change", sync);
    };
  }, []);

  const master = portrait ? HERO.portrait : HERO.landscape;

  // §3.2.1 — the hero "cuts in, hard, mid-motion". The clip is already running
  // behind the Threshold, so the reveal lands on movement, never on a first
  // frame. Autoplay can still be refused; the poster is the floor.
  useEffect(() => {
    if (!motionAllowed) return;
    const video = videoRef.current;
    if (!video) return;

    setVideoReady(false);
    void video.play().catch(() => {
      /* Refused autoplay leaves the poster showing, which is a complete design. */
    });
  }, [motionAllowed, portrait]);

  // The door is a one-way event. When the clip ends, fall back to the tail —
  // the stretch where the door is already open — rather than starting over.
  useEffect(() => {
    if (!motionAllowed) return;
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.currentTime = HERO.loopFrom;
      void video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [motionAllowed, portrait]);

  // Only reveal the video once it genuinely has frames, so a slow connection
  // shows the poster rather than a black rectangle.
  useEffect(() => {
    if (!motionAllowed) return;
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => setVideoReady(true);
    if (video.readyState >= 2) reveal();
    video.addEventListener("loadeddata", reveal, { once: true });
    return () => video.removeEventListener("loadeddata", reveal);
  }, [motionAllowed, portrait]);

  // Kept for the moment the sound layer lands: the engine turning over is
  // timed to the reveal, not to page load.
  useEffect(() => onThresholdCleared(() => {}), []);

  return (
    <section id="the-bus" className={styles.hero}>
      <div className={cn(styles.media, "hud", "hud--bleed")}>
        <picture>
          <source
            media="(orientation: portrait) and (max-width: 47.99rem)"
            srcSet={HERO.portrait.poster.avif}
            type="image/avif"
          />
          <source
            media="(orientation: portrait) and (max-width: 47.99rem)"
            srcSet={HERO.portrait.poster.jpg}
          />
          <source srcSet={HERO.landscape.poster.avif} type="image/avif" />
          <img
            className={styles.plate}
            src={HERO.landscape.poster.jpg}
            alt={HERO.alt}
            width={HERO.landscape.poster.width}
            height={HERO.landscape.poster.height}
            fetchPriority="high"
            decoding="sync"
          />
        </picture>

        {motionAllowed ? (
          <video
            // Remounts on orientation change so the browser reloads the right
            // master rather than keeping the one it already has buffered.
            key={master.video.mp4}
            ref={videoRef}
            className={cn(styles.plate, styles.video, videoReady && styles.videoReady)}
            src={master.video.mp4}
            poster={master.poster.jpg}
            width={master.video.width}
            height={master.video.height}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}

        {/* §3.2.2 — above the media, below the type. Landscape only: the
            portrait composition has no room for what the beam is meant to
            find, and a coarse pointer has no cursor to follow anyway. */}
        {!portrait ? <Headlight reveal={HERO.reveal} /> : null}

        {/* §2.4 — every image and video gets the plate. */}
        <Grain variant="media" />
        <div className={styles.scrim} />
      </div>

      <div className={styles.type}>
        <p className={cn("t-record", styles.eyebrow)}>{eyebrow}</p>

        <h1 className={cn("t-invitation", styles.h1)}>You will be picked up.</h1>

        <div className={styles.actions}>
          <a className={cn("t-signage", styles.cta)} href="#passage">
            Claim a seat
          </a>
          <a className={cn("t-record", styles.link)} href="#summons">
            what is this
          </a>
        </div>
      </div>
    </section>
  );
}
