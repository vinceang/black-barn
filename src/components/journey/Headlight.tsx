import { useEffect, useRef } from "react";
import styles from "./Headlight.module.css";

/** §3.2.2 — "follows the cursor at 60% lag". */
const LAG = 0.4;

const VERTEX = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/*
 * §3.2.2 — "Implemented as a WebGL displacement + luminance mask, not a CSS
 * radial gradient."
 *
 * The difference is not decorative. A CSS gradient can only lighten what is
 * already on screen; it cannot show something that was never rendered. This
 * samples a second plate — identical to the hero except for a vehicle further
 * back in the fog — and reveals it only inside the beam. What the light finds
 * genuinely does not exist anywhere else on the page.
 *
 * The beam is elliptical and squashed vertically, because a headlight throws
 * wide and low. It also warps the sample slightly toward its centre, which is
 * what stops it reading as a torch cut-out pasted over a photograph.
 */
const FRAGMENT = `
precision highp float;

uniform sampler2D tReveal;
uniform vec2  uCursor;
uniform float uTexAspect;
uniform float uCanvasAspect;
uniform float uOffsetX;
uniform float uStrength;

varying vec2 vUv;

// Match CSS object-fit: cover, so the revealed plate lines up exactly with
// the poster and video underneath it. Any mismatch here reads as the image
// jumping when the light passes over it.
vec2 coverUv(vec2 uv) {
  vec2 scale = uCanvasAspect > uTexAspect
    ? vec2(1.0, uTexAspect / uCanvasAspect)
    : vec2(uCanvasAspect / uTexAspect, 1.0);
  vec2 centred = (uv - 0.5) * scale + 0.5;
  centred.x += (uOffsetX - 0.5) * (1.0 - scale.x);
  return centred;
}

void main() {
  vec2 d = vUv - uCursor;
  d.x *= uCanvasAspect;
  d.y *= 1.75;
  float dist = length(d);

  float mask = 1.0 - smoothstep(0.05, 0.34, dist);
  mask = pow(mask, 1.5);

  vec2 uv = coverUv(vUv - normalize(d + 1e-5) * mask * 0.005);
  vec3 col = texture2D(tReveal, uv).rgb;

  // The beam lifts what it lands on rather than tinting it.
  col *= 1.0 + mask * 1.05;

  gl_FragColor = vec4(col, mask * uStrength);
}
`;

/**
 * §3.2.2 THE HEADLIGHT.
 *
 * Lazy-loads OGL after first paint (§3.4: "WebGL layer lazy-loads after LCP"),
 * so nothing here is in the initial bundle. Under reduced motion it never
 * loads at all — a light that chases the pointer is motion, and §3.4's second
 * design does without it.
 */
export function Headlight({ reveal, offsetX = 0.5 }: { reveal: string; offsetX?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coarse pointers get the gyroscope path below, not a beam glued to a tap.
    const fine = window.matchMedia("(pointer: fine)");

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // After LCP. The hero poster must never queue behind a WebGL library.
    const boot = async () => {
      const { Renderer, Program, Mesh, Triangle, Texture } = await import("ogl");
      if (disposed) return;

      const renderer = new Renderer({
        canvas,
        alpha: true,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
      const gl = renderer.gl;

      const texture = new Texture(gl);
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = reveal;
      await image.decode().catch(() => {});
      if (disposed) return;
      texture.image = image;

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        transparent: true,
        uniforms: {
          tReveal: { value: texture },
          uCursor: { value: [0.5, 0.5] },
          uTexAspect: { value: image.naturalWidth / image.naturalHeight || 1.79 },
          uCanvasAspect: { value: 1 },
          uOffsetX: { value: offsetX },
          uStrength: { value: 0 },
        },
      });

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        renderer.setSize(rect.width, rect.height);
        program.uniforms.uCanvasAspect.value = rect.width / rect.height;
      };
      resize();
      window.addEventListener("resize", resize);

      // Target and eased position. §3.2.2's lag is the whole feel of it —
      // the light is heavy, and it arrives after you do.
      let tx = 0.5;
      let ty = 0.5;
      let cx = 0.5;
      let cy = 0.5;
      let strength = 0;

      const onPointer = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        tx = (event.clientX - rect.left) / rect.width;
        ty = (event.clientY - rect.top) / rect.height;
        strength = ty > -0.5 && ty < 1.5 ? 1 : 0;
      };
      const onLeave = () => {
        strength = 0;
      };

      /*
       * §3.2.2 — "Mobile equivalent: gyroscope. Tilt the phone and the light
       * moves. Users discover this by accident."
       *
       * No permission is requested. iOS gates DeviceOrientationEvent behind an
       * explicit prompt, and interrupting the hero with a system dialog to
       * enable an effect nobody has been told about would trade the discovery
       * for an obstacle. Where the event is available unprompted (Android, and
       * iOS once granted elsewhere) it simply works.
       */
      const onTilt = (event: DeviceOrientationEvent) => {
        if (event.gamma === null || event.beta === null) return;
        tx = 0.5 + Math.max(-1, Math.min(1, event.gamma / 40)) * 0.4;
        ty = 0.5 + Math.max(-1, Math.min(1, (event.beta - 45) / 40)) * 0.35;
        strength = 1;
      };

      if (fine.matches) {
        window.addEventListener("pointermove", onPointer);
        window.addEventListener("pointerleave", onLeave);
      } else if ("DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", onTilt);
      }

      let frame = 0;
      const tick = () => {
        cx += (tx - cx) * LAG;
        cy += (ty - cy) * LAG;
        program.uniforms.uCursor.value = [cx, cy];

        const current = program.uniforms.uStrength.value as number;
        program.uniforms.uStrength.value = current + (strength - current) * 0.06;

        renderer.render({ scene: mesh });
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("deviceorientation", onTilt);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    const idle =
      window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200));
    idle(() => void boot());

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reveal, offsetX]);

  return <canvas ref={canvasRef} className={styles.headlight} aria-hidden="true" />;
}
