import { SEASON, seasonNights } from "@/lib/season";
import type { DepartureId, Seat, SeatStatus } from "./types";

/**
 * Deterministic seed data for the seat inventory.
 *
 * Every seat on every departure is a real row generated here — including
 * seat 7. Nothing about the manifest is decided at render time, so replacing
 * this file with a database table changes no component.
 *
 * The generator is a pure function of departureId, so the server and the
 * client produce identical rows and the manifest never hydrates into
 * different content than it rendered with.
 */

/**
 * §5.4.10 — "What is Seat 7?" / "Taken."
 * §7 — "SEAT 07 — OCCUPIED appears on every departure. No name. It is never
 * explained anywhere on the site."
 */
export const OCCUPIED_SEAT = 7;

/** How long a seat stays held during the §07 ritual before it returns to the pool. */
export const HOLD_MINUTES = 10;

/** §07 renders first name + last initial. */
const FIRST_NAMES = [
  "Marisol", "Jonah", "Delia", "Aurelio", "Tamsin", "Reeve", "Odile", "Caspar",
  "Wren", "Ines", "Malachi", "Saoirse", "Bram", "Cordelia", "Ezra", "Noor",
  "Lucius", "Thea", "Osgood", "Imogen", "Rafferty", "Sunniva", "Aldous", "Vesper",
  "Corin", "Marlowe", "Signe", "Halloran", "Perpetua", "Ambrose",
];

const LAST_INITIALS = "ABCDEFGHKLMNPRSTVW".split("");

/** mulberry32 — small, fast, and stable across runtimes. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Oct 31 — the night everything sells around. Night 17 of 22. */
const HALLOWEEN_INDEX = 17;

/**
 * How many seats are still sellable on a given night.
 *
 * §06 wants "scarcity you can see", which means the calendar has to tell a
 * story: sold out at Halloween, tight either side of it, open at the
 * shoulders. So demand is a smooth curve centred on Oct 31 and the per-night
 * hash only perturbs it by a few seats.
 *
 * Getting this backwards is easy and was: with the hash spanning 0–33 and the
 * Halloween term capped at 12, noise dominated the curve and produced a
 * calendar where Oct 31 had sixteen seats free and a random October Sunday
 * was full. The curve has to be the signal, not a modifier.
 */
function targetAvailable(date: string, index: number): number {
  const distance = Math.abs(index - HALLOWEEN_INDEX);
  // Gaussian shortfall: ~0 seats at Halloween, ~32 far out on the shoulders.
  const demand = 32 * (1 - Math.exp(-(distance * distance) / 32));
  const jitter = (hash(date) % 7) - 3;
  // The -2 keeps the Halloween nights pinned at zero rather than leaving them
  // to the jitter's mercy.
  const raw = Math.round(demand + jitter) - 2;
  // Seat 7 is never sellable, so availability tops out one below capacity.
  return Math.max(0, Math.min(SEASON.seatsPerDeparture - 1, raw));
}

/** Fisher-Yates against a seeded generator, so the shuffle is reproducible. */
function shuffle<T>(items: T[], next: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The full seat map for one departure. Always 40 rows, always in seat order.
 */
export function seedSeats(departureId: DepartureId): Seat[] {
  const night = seasonNights().find((n) => n.date === departureId);
  if (!night) return [];

  const next = rng(hash(departureId));
  const available = targetAvailable(departureId, night.index);

  const sellable = Array.from({ length: SEASON.seatsPerDeparture }, (_, i) => i + 1).filter(
    (seatNumber) => seatNumber !== OCCUPIED_SEAT,
  );

  const shuffled = shuffle(sellable, next);
  const openSeats = new Set(shuffled.slice(0, available));
  const takenSeats = shuffled.slice(available);

  // A small slice of the taken seats are mid-ritual rather than booked, so the
  // manifest has some rows that are neither free nor named.
  const holdCount = Math.min(takenSeats.length, Math.floor(next() * 3));
  const heldSeats = new Set(takenSeats.slice(0, holdCount));

  const now = new Date(`${SEASON.start}T20:00:00Z`).getTime();

  return Array.from({ length: SEASON.seatsPerDeparture }, (_, i) => {
    const seatNumber = i + 1;

    let status: SeatStatus;
    if (seatNumber === OCCUPIED_SEAT) status = "occupied";
    else if (openSeats.has(seatNumber)) status = "available";
    else if (heldSeats.has(seatNumber)) status = "held";
    else status = "claimed";

    const named = status === "claimed";

    return {
      departureId,
      seatNumber,
      status,
      holdExpiresAt:
        status === "held" ? new Date(now + HOLD_MINUTES * 60_000).toISOString() : null,
      guestFirstName: named ? FIRST_NAMES[Math.floor(next() * FIRST_NAMES.length)] : null,
      guestLastInitial: named ? LAST_INITIALS[Math.floor(next() * LAST_INITIALS.length)] : null,
    };
  });
}
