import { useEffect, useRef, useState } from "react";
import { claimSeat, getManifest, holdSeat } from "@/lib/seats/api";
import type { Departure, Seat } from "@/lib/seats/types";
import { formatNight } from "@/lib/season";
import { cn } from "@/lib/cn";
import styles from "./Manifest.module.css";

/** §5.5 — copy is final. */
const EMPTY = "no one has claimed a seat on this night yet. someone will.";
const NAME_ERROR = "that name will not do. try the one you were given.";
const WHY_PLACEHOLDER = "there is no wrong answer.";
const REVEAL_LINE = "we know where the lot is. we will send the road.";

/** §07 — "optional, up to 7". */
const MAX_COMPANIONS = 7;

/** §07 — "the screen goes to void for 900ms". Matches --dur-base. */
const VOID_MS = 900;

function rowState(seat: Seat): string {
  if (seat.status === "available") return "[ available ]";
  return "";
}

function rowName(seat: Seat): string {
  switch (seat.status) {
    case "occupied":
      // §5.4.10 — "What is Seat 7?" / "Taken." Never explained.
      return "OCCUPIED";
    case "available":
      return "—";
    case "held":
      return "—";
    case "claimed":
      return seat.guestLastInitial
        ? `${seat.guestFirstName} ${seat.guestLastInitial}.`
        : (seat.guestFirstName ?? "—");
  }
}

/**
 * §07 THE MANIFEST
 *
 * The list is the whole social mechanic, so it renders every seat including
 * the empty ones — "SEAT 05 — [ available ]" is content, not an absence.
 *
 * The form is a ritual, not a form: it asks for a name, who is coming, and
 * why, and it validates almost nothing. §07.3 is explicit that WHY has "no
 * validation and no explanation".
 */
export function Manifest({
  departure,
  initialSeats,
}: {
  departure: Departure | null;
  initialSeats: Seat[];
}) {
  const [seats, setSeats] = useState<Seat[] | null>(initialSeats.length ? initialSeats : null);
  const [name, setName] = useState("");
  const [companions, setCompanions] = useState("");
  const [why, setWhy] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const [claimed, setClaimed] = useState<Seat | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const departureId = departure?.id ?? null;

  // Skip the fetch for the departure that was already resolved at build time.
  const seededFor = useRef(initialSeats[0]?.departureId ?? null);

  useEffect(() => {
    if (!departureId) return;
    if (seededFor.current === departureId) return;
    seededFor.current = departureId;

    let live = true;
    setSeats(null);
    void getManifest(departureId).then((rows) => {
      if (live) setSeats(rows);
    });
    return () => {
      live = false;
    };
  }, [departureId]);

  /*
   * §07 — "a live, slowly auto-scrolling list". Driven here rather than by a
   * CSS animation so that any real scroll gesture takes it over immediately;
   * an animated transform would fight the user for control of the list.
   */
  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || !seats) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let paused = false;
    let offset = node.scrollTop;

    const hold = () => (paused = true);
    const release = () => (paused = false);
    node.addEventListener("pointerenter", hold);
    node.addEventListener("pointerleave", release);
    node.addEventListener("focusin", hold);
    node.addEventListener("focusout", release);

    const tick = () => {
      if (!paused) {
        offset += 0.28; // slow enough to read, fast enough to notice
        if (offset >= node.scrollHeight - node.clientHeight) offset = 0;
        node.scrollTop = offset;
      } else {
        offset = node.scrollTop;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener("pointerenter", hold);
      node.removeEventListener("pointerleave", release);
      node.removeEventListener("focusin", hold);
      node.removeEventListener("focusout", release);
    };
  }, [seats]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!departure || busy) return;

    // The only validation on the whole form. A name is how you get on a list.
    if (name.trim().length < 2) {
      setError(NAME_ERROR);
      return;
    }
    setError("");
    setBusy(true);

    const held = await holdSeat(departure.id);
    if (!held.ok) {
      setError(held.reason === "sold-out" ? "FULL. the seats do not increase." : NAME_ERROR);
      setBusy(false);
      return;
    }

    const result = await claimSeat({
      departureId: departure.id,
      seatNumber: held.seat.seatNumber,
      fullName: name,
      companions: companions
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .slice(0, MAX_COMPANIONS),
      why,
    });

    if (!result.ok) {
      setError(NAME_ERROR);
      setBusy(false);
      return;
    }

    // §07 — void first, then the number. The pause is the point.
    setVoiding(true);
    window.setTimeout(() => {
      setClaimed(result.seat);
      setVoiding(false);
      setBusy(false);
      void getManifest(departure.id).then(setSeats);
    }, VOID_MS);
  };

  const companionCount = companions.split(",").filter((c) => c.trim()).length;

  return (
    <section id="manifest" className={styles.manifest}>
      <div className={styles.inner}>
        <div>
          <p className={cn("t-record", styles.eyebrow)}>
            THE MANIFEST
            {departure ? ` · ${formatNight(departure.date)}` : ""}
          </p>

          <div className={styles.sheet}>
            <div className={styles.scroller} ref={scrollerRef} tabIndex={0}>
              {!departure ? (
                <p className={cn("t-record", styles.empty)}>
                  select a departure and the manifest for that night will be shown.
                </p>
              ) : seats && seats.every((s) => s.status === "available") ? (
                <p className={cn("t-record", styles.empty)}>{EMPTY}</p>
              ) : (
                <ul className={styles.rows}>
                  {(seats ?? []).map((seat) => (
                    <li
                      key={seat.seatNumber}
                      className={cn(
                        "t-record",
                        styles.row,
                        seat.status === "available" && styles.rowAvailable,
                        seat.status === "occupied" && styles.rowOccupied,
                      )}
                    >
                      <span className={styles.seat}>
                        SEAT {String(seat.seatNumber).padStart(2, "0")}
                      </span>
                      <span className={styles.name}>{rowName(seat)}</span>
                      <span className={styles.state}>{rowState(seat)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label className={cn("t-record", styles.label)} htmlFor="bb-name">
              WRITE YOUR NAME
            </label>
            <div className={styles.inputWrap}>
              <input
                id="bb-name"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "bb-name-error" : undefined}
              />
            </div>
            {error ? (
              <p id="bb-name-error" className={cn("t-record", styles.error)} role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={cn("t-record", styles.label)} htmlFor="bb-companions">
              WHO IS COMING WITH YOU
            </label>
            <div className={styles.inputWrap}>
              <input
                id="bb-companions"
                className={styles.input}
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                aria-describedby="bb-companions-hint"
              />
            </div>
            <p id="bb-companions-hint" className={cn("t-record", styles.hint)}>
              {companionCount > MAX_COMPANIONS
                ? `seven at most. you have written ${companionCount}.`
                : `optional. up to ${MAX_COMPANIONS}, separated by commas.`}
            </p>
          </div>

          <div className={styles.field}>
            <label className={cn("t-record", styles.label)} htmlFor="bb-why">
              WHY
            </label>
            <div className={styles.inputWrap}>
              <textarea
                id="bb-why"
                className={styles.textarea}
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder={WHY_PLACEHOLDER}
                rows={3}
              />
            </div>
          </div>

          <button
            type="submit"
            className={cn("t-signage", styles.submit)}
            disabled={busy || !departure}
          >
            Add me to the manifest
          </button>
        </form>
      </div>

      {/* §07 — void, then the number. */}
      {voiding ? <div className={styles.reveal} aria-hidden="true" /> : null}

      {claimed ? (
        <div className={styles.reveal} role="status">
          <p className={cn("t-signage", styles.revealNumber)}>
            Seat {String(claimed.seatNumber).padStart(2, "0")}
          </p>
          <p className={cn("t-record", styles.revealLine)}>{REVEAL_LINE}</p>
          <button
            type="button"
            className={cn("t-record", styles.dismiss)}
            onClick={() => setClaimed(null)}
          >
            close
          </button>
        </div>
      ) : null}
    </section>
  );
}
