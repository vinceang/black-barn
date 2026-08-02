/**
 * The seat domain.
 *
 * A seat is a row, not a number in a list. Everything the site says about
 * scarcity, the manifest, and the booking ritual is derived from these
 * records — nothing is decided at render time.
 */

/**
 * One bus run. Currently the ISO date, because §07's manifest identifies a
 * departure by date alone (`SEAT 04  MARISOL V.  OCT 12`) and §00 counts
 * "DEPARTURE 7 OF 22" against the 22 operating nights.
 *
 * §0 notes six departures a night operationally. If those are ever sold
 * separately this becomes `${date}-${slot}` and nothing else in the domain
 * changes — which is why callers must treat it as an opaque string.
 */
export type DepartureId = string;

export type SeatStatus =
  /** Sellable. */
  | "available"
  /** Reserved mid-ritual, expires. See holdExpiresAt. */
  | "held"
  /** Booked. Carries a guest name. */
  | "claimed"
  /**
   * §5.4.10 — "What is Seat 7?" / "Taken."
   * A real row on every departure, never explained, never released.
   */
  | "occupied";

export interface Seat {
  departureId: DepartureId;
  /** 1..capacity. */
  seatNumber: number;
  status: SeatStatus;
  /** ISO timestamp. Non-null only while status is "held". */
  holdExpiresAt: string | null;
  /** §07 renders first name + last initial. Null unless "claimed". */
  guestFirstName: string | null;
  guestLastInitial: string | null;
}

export interface Departure {
  id: DepartureId;
  /** 1-based position in the season — the "7" in DEPARTURE 7 OF 22. */
  index: number;
  date: string;
  capacity: number;
  /** Count of seats with status "available". Never includes seat 7. */
  seatsRemaining: number;
  full: boolean;
  /**
   * The night has already run. §06's calendar must not offer it — a departure
   * with seats left is still unbookable once the bus has gone.
   */
  past: boolean;
}

export type HoldResult =
  | { ok: true; seat: Seat }
  | { ok: false; reason: "sold-out" | "seat-taken" | "not-found" | "departed" };

export interface ClaimInput {
  departureId: DepartureId;
  seatNumber: number;
  /** §07.1 — WRITE YOUR NAME. */
  fullName: string;
  /** §07.2 — WHO IS COMING WITH YOU. Optional, up to 7. */
  companions?: string[];
  /** §07.3 — WHY. No validation, by design. */
  why?: string;
}

export type ClaimResult =
  | { ok: true; seat: Seat }
  | { ok: false; reason: "hold-expired" | "seat-taken" | "not-found" | "departed" };
