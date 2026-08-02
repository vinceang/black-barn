import { SEASON, SIMULATED_NOW, nightByDate, seasonNights } from "@/lib/season";
import { HOLD_MINUTES, OCCUPIED_SEAT, seedSeats } from "./seed";
import type {
  ClaimInput,
  ClaimResult,
  Departure,
  DepartureId,
  HoldResult,
  Seat,
} from "./types";

/**
 * The seat API.
 *
 * These four functions have the signatures a real inventory service would
 * have: async, id-addressed, and returning discriminated results rather than
 * throwing, so callers render §5.5's microcopy instead of catching errors.
 *
 * Swapping to a live backend means replacing these four bodies. Nothing above
 * this file knows the data is simulated — no component imports `seed`, and no
 * component reads a seat map synchronously.
 */

/** Mutations made this session, layered over the deterministic seed. */
const overlay = new Map<DepartureId, Map<number, Seat>>();

/**
 * Real inventory is a network call. Keeping a small delay here means the UI
 * has to have honest pending states from the start rather than acquiring them
 * later when a backend appears.
 */
const LATENCY_MS = 140;
const settle = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

function now(): number {
  return Date.now();
}

/** Seed rows with this session's mutations applied and expired holds released. */
function currentSeats(departureId: DepartureId): Seat[] {
  const patches = overlay.get(departureId);

  return seedSeats(departureId).map((seed) => {
    const seat = patches?.get(seed.seatNumber) ?? seed;

    // A hold that has run out is available again. Handled on read so it needs
    // no timer, and so it behaves the same whoever asks and whenever.
    if (seat.status === "held" && seat.holdExpiresAt && Date.parse(seat.holdExpiresAt) < now()) {
      return { ...seat, status: "available", holdExpiresAt: null };
    }
    return seat;
  });
}

function patch(seat: Seat): void {
  let patches = overlay.get(seat.departureId);
  if (!patches) {
    patches = new Map();
    overlay.set(seat.departureId, patches);
  }
  patches.set(seat.seatNumber, seat);
}

/* ------------------------------------------------------------------ reads -- */

export async function getDeparture(departureId: DepartureId): Promise<Departure | null> {
  const night = nightByDate(departureId);
  if (!night) return settle(null);

  const seats = currentSeats(departureId);
  const seatsRemaining = seats.filter((s) => s.status === "available").length;

  return settle({
    id: departureId,
    index: night.index,
    date: night.date,
    capacity: SEASON.seatsPerDeparture,
    seatsRemaining,
    full: seatsRemaining === 0,
    past: night.date < SIMULATED_NOW,
  });
}

/** §06 — "SELECT A DEPARTURE". The whole season, in order, for the calendar. */
export async function listDepartures(): Promise<Departure[]> {
  const nights = seasonNights();
  const departures = nights.map((night) => {
    const seats = currentSeats(night.date);
    const seatsRemaining = seats.filter((s) => s.status === "available").length;
    return {
      id: night.date,
      index: night.index,
      date: night.date,
      capacity: SEASON.seatsPerDeparture,
      seatsRemaining,
      full: seatsRemaining === 0,
      past: night.date < SIMULATED_NOW,
    };
  });
  return settle(departures);
}

/**
 * §07 — the manifest. Always the full seat map in seat order, including the
 * empty rows: "SEAT 05 — [ available ]" is content, not an absence.
 */
export async function getManifest(departureId: DepartureId): Promise<Seat[]> {
  return settle(currentSeats(departureId));
}

/* --------------------------------------------------------------- mutations -- */

/**
 * Reserve a seat for the length of the §07 ritual.
 *
 * With no seatNumber the lowest open seat is assigned — the guest does not
 * choose, they are given one, which is what makes the number in §07's reveal
 * feel handed down rather than picked.
 */
export async function holdSeat(
  departureId: DepartureId,
  seatNumber?: number,
): Promise<HoldResult> {
  const night = nightByDate(departureId);
  if (!night) return settle({ ok: false, reason: "not-found" });
  // The bus has already gone. Seats left on a departed night are history, not
  // inventory — without this a past date with open seats is bookable.
  if (night.date < SIMULATED_NOW) return settle({ ok: false, reason: "departed" });

  const seats = currentSeats(departureId);
  const open = seats.filter((s) => s.status === "available");

  const target =
    seatNumber === undefined
      ? open[0]
      : seats.find((s) => s.seatNumber === seatNumber);

  if (seatNumber === undefined && !target) return settle({ ok: false, reason: "sold-out" });
  if (!target) return settle({ ok: false, reason: "not-found" });
  if (target.status !== "available") return settle({ ok: false, reason: "seat-taken" });

  const held: Seat = {
    ...target,
    status: "held",
    holdExpiresAt: new Date(now() + HOLD_MINUTES * 60_000).toISOString(),
  };
  patch(held);

  return settle({ ok: true, seat: held });
}

/**
 * §07 — ADD ME TO THE MANIFEST. Converts a held seat into a claimed one.
 *
 * `companions` and `why` are accepted and deliberately not validated (§07.3:
 * "a free-text field with no validation and no explanation"). A real backend
 * stores them against the booking; here they are simply carried.
 */
export async function claimSeat(input: ClaimInput): Promise<ClaimResult> {
  const night = nightByDate(input.departureId);
  if (!night) return settle({ ok: false, reason: "not-found" });
  if (night.date < SIMULATED_NOW) return settle({ ok: false, reason: "departed" });

  const seat = currentSeats(input.departureId).find((s) => s.seatNumber === input.seatNumber);
  if (!seat) return settle({ ok: false, reason: "not-found" });

  // Seat 7 is never claimable, and a hold that lapsed is a hold that lost.
  if (seat.seatNumber === OCCUPIED_SEAT) return settle({ ok: false, reason: "seat-taken" });
  if (seat.status === "claimed") return settle({ ok: false, reason: "seat-taken" });
  if (seat.status === "available") return settle({ ok: false, reason: "hold-expired" });

  const { first, initial } = splitName(input.fullName);

  const claimed: Seat = {
    ...seat,
    status: "claimed",
    holdExpiresAt: null,
    guestFirstName: first,
    guestLastInitial: initial,
  };
  patch(claimed);

  return settle({ ok: true, seat: claimed });
}

/**
 * "Marisol Vega" -> { first: "Marisol", initial: "V" }. A single-word name
 * keeps its first name and gets no initial; §07 renders what it is given
 * rather than demanding a surname nobody promised to supply.
 */
export function splitName(fullName: string): { first: string; initial: string | null } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", initial: null };
  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1] : null;
  return { first, initial: last ? last[0].toUpperCase() : null };
}
