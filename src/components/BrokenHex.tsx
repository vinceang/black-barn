/**
 * §2.3 — THE BROKEN HEX.
 *
 * "Pennsylvania Dutch barn stars are protective — hex signs painted to keep
 * something out. Ours is a six-point barn star drawn in a single weight, with
 * one arm truncated. The protection has failed, or it was never installed
 * correctly, or it was installed backwards on purpose."
 *
 * Geometry: a rosette, not a hexagram. A real hex sign is a compass rose —
 * six spokes radiating inside a circle, tied by an inner hexagon. Two
 * overlapping triangles would be a Star of David, which is a different symbol
 * belonging to somebody else; the generative passes produced exactly that and
 * were discarded for it. The shape is drawn here, in code, so it cannot drift.
 *
 * The hexagon shares the spokes' angles, so every spoke passes through a
 * vertex. Rotating it 30° instead — which is the intuitive way to draw a
 * hexagon — makes each spoke cross an edge at an arbitrary point, and the
 * whole mark reads as a scribble rather than a rosette.
 *
 * The upper-right arm breaks off past the hexagon and never reaches the rim. Five
 * arms complete the circle; one does not. That gap is the whole idea.
 *
 * Renders at 24px (favicon), 200px (hero) and 40ft (painted on the barn) —
 * hence a single uniform stroke and no fills. §2.3: never on a coloured fill,
 * only tallow on void, or burned into a texture.
 */
export function BrokenHex({
  size = 200,
  className,
  title,
}: {
  size?: number | string;
  className?: string;
  /** Omit for decorative use; the mark is not content on its own. */
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
    >
      <circle cx="50" cy="50" r="44" />

      {/* Inner hexagon — vertices on the spoke angles, r=18. */}
      <path d="M50 32 L65.59 41 L65.59 59 L50 68 L34.41 59 L34.41 41 Z" />

      {/* Five arms reach the rim at r=40. */}
      <path d="M50 50 L50 10" />
      <path d="M50 50 L84.64 70" />
      <path d="M50 50 L50 90" />
      <path d="M50 50 L15.36 70" />
      <path d="M50 50 L15.36 30" />

      {/* The sixth breaks off past the hexagon, short of the rim. The
          protection is not continuous. */}
      <path d="M50 50 L73.38 36.5" />
    </svg>
  );
}
