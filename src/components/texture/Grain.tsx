import { cn } from "@/lib/cn";

type GrainVariant = "global" | "media" | "flat";

/**
 * §2.4 — the halide grain plate. One plate, every surface.
 *
 * "This is what unifies AI-generated assets more than any other single
 * decision." Every image and video in the site wraps itself in one of these;
 * the layout mounts a `global` instance over the whole page.
 */
export function Grain({
  variant = "flat",
  className,
}: {
  variant?: GrainVariant;
  className?: string;
}) {
  return <div aria-hidden="true" className={cn("grain", `grain--${variant}`, className)} />;
}
