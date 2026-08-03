import { useEffect, useState } from "react";
import { TIERS } from "@/lib/tiers";
import { listDepartures } from "@/lib/seats/api";
import type { Departure } from "@/lib/seats/types";
import { formatNight } from "@/lib/season";
import { cn } from "@/lib/cn";
import styles from "./Passage.module.css";

/** §5.5 — sold out. Copy is final. */
const FULL_NOTE = "FULL. the seats do not increase.";

/** Below this the counter turns bad-signal green (§2.1, §3.3). */
const LOW_SEATS = 6;

/**
 * §06 PASSAGE
 *
 * Its own island. The scroll journey (§01–§05) must not pay for the booking
 * layer, and this one fetches inventory and holds state the journey has no
 * use for.
 */
export function Passage({ onSelect }: { onSelect?: (departure: Departure) => void }) {
  const [departures, setDepartures] = useState<Departure[] | null>(null);
  const [selected, setSelected] = useState<Departure | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    let live = true;
    void listDepartures().then((all) => {
      if (live) setDepartures(all);
    });
    return () => {
      live = false;
    };
  }, []);

  const choose = (departure: Departure) => {
    if (departure.past) return;
    if (departure.full) {
      setNote(FULL_NOTE);
      return;
    }
    setNote("");
    setSelected(departure);
    onSelect?.(departure);
  };

  return (
    <section id="passage" className={styles.passage}>
      <div className={styles.inner}>
        <p className={cn("t-record", styles.eyebrow)}>PASSAGE</p>

        <div className={styles.tiers}>
          {TIERS.map((tier) => (
            <article key={tier.name} className={styles.tier}>
              <h3 className={cn("t-invitation", styles.tierName)}>{tier.name}</h3>

              <p className={cn("t-signage", styles.price, !tier.priceUSD && styles.priceUnknown)}>
                {tier.priceUSD ? `$${tier.priceUSD}` : "$?"}
              </p>

              <p className={cn("t-record", styles.tierLine)}>{tier.line}</p>

              <p className={cn("t-record", styles.tierWarning)}>{tier.warning}</p>

              {tier.stamp ? (
                <p className={cn("t-signage", styles.tierStamp)}>{tier.stamp}</p>
              ) : null}

              {tier.request ? (
                <a className={cn("t-record", styles.request)} href={tier.request.href}>
                  {tier.request.label}
                </a>
              ) : (
                <a className={cn("t-signage", styles.claim)} href="#manifest">
                  Claim a seat
                </a>
              )}
            </article>
          ))}
        </div>

        <h2 className={cn("t-signage", styles.calendarHead)}>Select a departure</h2>

        <ul className={styles.calendar}>
          {(departures ?? []).map((departure) => {
            const unavailable = departure.past || departure.full;
            return (
              <li
                key={departure.id}
                className={cn(
                  styles.night,
                  departure.full && styles.nightFull,
                  departure.past && styles.nightPast,
                )}
              >
                <button
                  type="button"
                  className={cn(
                    styles.nightButton,
                    selected?.id === departure.id && styles.selected,
                  )}
                  onClick={() => choose(departure)}
                  disabled={unavailable}
                  aria-label={
                    departure.past
                      ? `${formatNight(departure.date)} — departed`
                      : departure.full
                        ? `${formatNight(departure.date)} — full`
                        : `${formatNight(departure.date)} — ${departure.seatsRemaining} seats remaining`
                  }
                >
                  <span className={cn("t-signage", styles.nightDate)}>
                    {formatNight(departure.date)}
                  </span>
                  <span
                    className={cn(
                      "t-record",
                      styles.seats,
                      !unavailable && departure.seatsRemaining <= LOW_SEATS && styles.seatsLow,
                    )}
                  >
                    {departure.past
                      ? "departed"
                      : departure.full
                        ? "FULL"
                        : `${departure.seatsRemaining} seats`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className={cn("t-record", styles.note)} role="status">
          {note}
        </p>
      </div>
    </section>
  );
}
