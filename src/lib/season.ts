/**
 * §0 — the season calendar. Dates only.
 *
 * This module knows *when* the bus runs. It deliberately knows nothing about
 * seats: capacity, availability and the manifest are owned by `lib/seats`, so
 * there is exactly one source of truth for inventory. Anything that needs a
 * seat count asks the seat API, not this file.
 */

export const SEASON = {
  year: 2026,
  /** §01 eyebrow copy: OCT 2 — NOV 8 */
  start: "2026-10-02",
  end: "2026-11-08",
  seatsPerDeparture: 40,
  departuresPerNight: 6,
  /** §0 — 18+. Stated flatly wherever it appears. */
  minimumAge: 18,
} as const;

/**
 * The site has no backend yet, and the season is in the future. Pinning "now"
 * to night 7 puts the build in the middle of a running season so the schedule,
 * the seat counts, and the manifest all have something true to say.
 * A real deployment deletes this and reads Date.now().
 */
export const SIMULATED_NOW = "2026-10-15";

export type Night = {
  /** 1-based position in the season — the "7" in DEPARTURE 7 OF 22. */
  index: number;
  /** ISO date, YYYY-MM-DD. Doubles as the DepartureId. */
  date: string;
};

/**
 * Operating nights: Friday through Sunday all season, plus Thursdays once the
 * season is running. Lands on exactly 22 nights between Oct 2 and Nov 8.
 */
function isOperatingNight(date: Date): boolean {
  const day = date.getUTCDay(); // 0 Sun … 4 Thu, 5 Fri, 6 Sat
  if (day === 5 || day === 6 || day === 0) return true;
  return day === 4 && date >= new Date("2026-10-15T00:00:00Z");
}

let cached: Night[] | null = null;

export function seasonNights(): Night[] {
  if (cached) return cached;

  const nights: Night[] = [];
  const cursor = new Date(`${SEASON.start}T00:00:00Z`);
  const last = new Date(`${SEASON.end}T00:00:00Z`);

  while (cursor <= last) {
    if (isOperatingNight(cursor)) {
      nights.push({ index: nights.length + 1, date: cursor.toISOString().slice(0, 10) });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  cached = nights;
  return nights;
}

export const TOTAL_NIGHTS = seasonNights().length;

/** The next departure that has not happened yet. */
export function nextDeparture(now: string = SIMULATED_NOW): Night {
  const nights = seasonNights();
  return nights.find((n) => n.date >= now) ?? nights[nights.length - 1];
}

export function nightByDate(date: string): Night | undefined {
  return seasonNights().find((n) => n.date === date);
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** "2026-10-15" -> "OCT 15". Signage and Record are both uppercase-safe. */
export function formatNight(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
