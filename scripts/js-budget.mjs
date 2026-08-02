#!/usr/bin/env node
/**
 * Per-route first-load JS, gzipped.
 *
 * CLAUDE.md caps §01–§05 at 200KB gz and asks for this number in every PR.
 * It reads the built HTML rather than the module graph, so it counts what a
 * browser is actually told to fetch on first paint: module scripts plus
 * anything modulepreloaded alongside them.
 *
 * Usage: npm run build && npm run budget
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(root, "dist");
const BUDGET_KB = 200;

async function findHtml(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await findHtml(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const pages = await findHtml(DIST);
let worst = 0;

for (const page of pages) {
  const html = await readFile(page, "utf8");

  const urls = new Set();
  for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/rel="modulepreload"[^>]+href="([^"]+\.js)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/href="([^"]+\.js)"[^>]+rel="modulepreload"/g)) urls.add(m[1]);
  // Islands are not <script src>. Astro puts the component and its framework
  // renderer on the <astro-island> element, and they are fetched on hydrate —
  // so they are first-load cost and must be counted.
  for (const m of html.matchAll(/(?:component-url|renderer-url)="([^"]+\.js)"/g)) urls.add(m[1]);

  const route = page.replace(DIST, "").replace(/\/index\.html$/, "") || "/";
  const rows = [];
  let total = 0;

  for (const url of urls) {
    const file = join(DIST, url);
    try {
      await stat(file);
    } catch {
      continue;
    }
    const gz = gzipSync(await readFile(file)).length;
    total += gz;
    rows.push([url.replace(/^\/_astro\//, ""), gz]);
  }

  const kb = total / 1024;
  worst = Math.max(worst, kb);

  console.log(`\n  ${route}`);
  rows.sort((a, b) => b[1] - a[1]);
  for (const [name, gz] of rows) console.log(`    ${(gz / 1024).toFixed(1).padStart(7)} KB  ${name}`);
  if (!rows.length) console.log("            0 KB  (no client JS)");
  console.log(`    ${"-".repeat(46)}`);
  console.log(`    ${kb.toFixed(1).padStart(7)} KB  first-load JS, gzipped`);
}

console.log(`\n  worst route: ${worst.toFixed(1)} KB / ${BUDGET_KB} KB budget`);
console.log(worst <= BUDGET_KB ? "  WITHIN BUDGET\n" : "  OVER BUDGET\n");
process.exitCode = worst <= BUDGET_KB ? 0 : 1;
