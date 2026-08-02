#!/usr/bin/env node
/**
 * tokens/design-tokens.json is the single source of truth for every visual
 * constant in this project. This script compiles it into the two places the
 * app can actually read:
 *
 *   src/app/tokens.css          @theme block -> Tailwind utilities + CSS vars
 *   src/lib/tokens.generated.ts values the JS layer needs (Lenis, GSAP, WebGL)
 *
 * Both outputs are generated. Never hand-edit them. Change the JSON instead.
 * Runs automatically via predev / prebuild.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(root, "tokens/design-tokens.json");
const CSS_OUT = resolve(root, "src/styles/tokens.css");
const TS_OUT = resolve(root, "src/lib/tokens.generated.ts");

const tokens = JSON.parse(await readFile(SOURCE, "utf8"));

const BANNER = (target) =>
  `/* GENERATED FILE — DO NOT EDIT.\n` +
  `   Source: tokens/design-tokens.json (v${tokens.meta.version})\n` +
  `   Regenerate: npm run tokens\n` +
  `   ${target} */\n`;

/** Family names come from the @fontsource packages, which self-host the files. */
const quoteFamily = (family) => `"${family}"`;

/** "0.06–0.09" -> { min: 0.06, max: 0.09, mid: 0.075 } — en-dash and hyphen both. */
function parseRange(raw) {
  const [min, max] = String(raw)
    .split(/[–-]/)
    .map((n) => Number.parseFloat(n.trim()));
  return { min, max, mid: Number(((min + max) / 2).toFixed(4)) };
}

/* ---------------------------------------------------------------- CSS ---- */

const lines = [];
const push = (s = "") => lines.push(s);

push(BANNER("Tailwind theme."));
push();
push("@theme {");

push("  /* --- color · §2.1 ------------------------------------------- */");
for (const [name, def] of Object.entries(tokens.color)) {
  push(`  --color-${name}: ${def.value}; /* ${def.comment} */`);
}

push();
push("  /* --- type faces · §2.2 -------------------------------------- */");
const { invitation, signage, record } = tokens.font;
push(`  --font-invitation: ${quoteFamily(invitation.selected)}, ${invitation.fallback};`);
push(
  `  --font-invitation-prose: ${quoteFamily(invitation.selectedProse)}, ${invitation.fallback};`,
);
push(`  --font-signage: ${quoteFamily(signage.selected)}, ${signage.fallback};`);
push(`  --font-record: ${quoteFamily(record.selected)}, ${record.fallback};`);
push(`  --stretch-signage: ${signage.stretch};`);
push(`  --weight-signage: ${signage.weight};`);

push();
push("  /* --- type scale ---------------------------------------------- */");
for (const [name, def] of Object.entries(tokens.type)) {
  push(`  --text-${name}: ${def.value};`);
}
push(`  --tracking-invitation: ${invitation.tracking};`);
push(`  --leading-invitation: ${invitation.leading};`);
push(`  --tracking-record: ${record.tracking};`);
push(`  --size-record-max: ${record.maxSize};`);

push();
push("  /* --- motion · §3.1 ------------------------------------------- */");
push(`  --ease-barn: ${tokens.motion.easing.value};`);
push(`  --dur-base: ${tokens.motion["duration-base"].value};`);
push(`  --dur-cta: ${tokens.motion["duration-cta"].value};`);
push(`  --dur-splice: ${tokens.motion.splice.value};`);
push(`  --dur-blink: ${tokens.motion.blink.value};`);
push(`  --idle-trigger: ${tokens.motion["idle-trigger"].value};`);
const breatheCss = tokens.motion.breathe.value.match(/([\d.]+)\s*→\s*([\d.]+)\s*over\s*([\d.]+)s/);
push(`  --breathe-from: ${breatheCss?.[1] ?? 1};`);
push(`  --breathe-to: ${breatheCss?.[2] ?? 1.015};`);
push(`  --breathe-period: ${breatheCss?.[3] ?? 9}s;`);

push();
push("  /* --- texture · §2.4 ------------------------------------------ */");
const grain = parseRange(tokens.texture.grain.opacity);
push(`  --grain-opacity: ${grain.mid};`);
push(`  --grain-opacity-min: ${grain.min};`);
push(`  --grain-opacity-max: ${grain.max};`);
push(`  --grain-blend: ${tokens.texture.grain.blend};`);
push(`  --xerox-rotation: ${tokens.texture.xerox.rotation};`);
push("}");
push();

await mkdir(dirname(CSS_OUT), { recursive: true });
await writeFile(CSS_OUT, lines.join("\n"), "utf8");

/* ----------------------------------------------------------------- TS ---- */

const ms = (v) => Number.parseFloat(String(v));
const breathe = tokens.motion.breathe.value.match(/([\d.]+)\s*→\s*([\d.]+)\s*over\s*([\d.]+)s/);

const ts =
  BANNER("Values the JS layer reads.") +
  `
export const motion = {
  /** §3.1 base easing — everything is slightly too slow. */
  ease: ${JSON.stringify(tokens.motion.easing.value)},
  /** GSAP wants the raw control points, not the CSS function. */
  easePoints: [0.16, 1, 0.3, 1] as const,
  base: ${ms(tokens.motion["duration-base"].value)},
  cta: ${ms(tokens.motion["duration-cta"].value)},
  splice: ${ms(tokens.motion.splice.value)},
  blink: ${ms(tokens.motion.blink.value)},
  idleTrigger: ${ms(tokens.motion["idle-trigger"].value) * 1000},
  /** §3.1 smooth scroll — scroll has weight, like a heavy door. */
  lenisLerp: ${tokens.motion["lenis-lerp"].value},
  /** §3.1 breathing — imperceptible individually, alive cumulatively. */
  breathe: { from: ${breathe?.[1] ?? 1}, to: ${breathe?.[2] ?? 1.015}, seconds: ${breathe?.[3] ?? 9} },
} as const;

export const texture = {
  grain: {
    opacity: ${grain.mid},
    min: ${grain.min},
    max: ${grain.max},
    blend: ${JSON.stringify(tokens.texture.grain.blend)},
    fps: ${tokens.texture.grain.fps},
  },
} as const;

export const color = {
${Object.entries(tokens.color)
  .map(([name, def]) => `  ${JSON.stringify(name)}: ${JSON.stringify(def.value)},`)
  .join("\n")}
} as const;

/** §2.1 — values that must never appear in a component. Checked by \`npm run lint:tokens\`. */
export const prohibited = ${JSON.stringify(tokens.prohibited, null, 2)} as const;
`;

await mkdir(dirname(TS_OUT), { recursive: true });
await writeFile(TS_OUT, ts, "utf8");

console.log(
  `tokens → ${Object.keys(tokens.color).length} colors, ${Object.keys(tokens.type).length} type steps, 4 faces`,
);
