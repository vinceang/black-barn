import { ADMISSION, TERMS } from "@/lib/admission";
import { cn } from "@/lib/cn";
import styles from "./Admission.module.css";

/**
 * THE ADMISSION GATE — the flag beside §01's CTA.
 *
 * A closed disclosure attached to the decision it qualifies. It began as a
 * strip across the top of the hero, which was wrong twice over: it took a
 * third of the phone viewport, and a row of monospace words at the top of a
 * page reads as navigation — which made "nudity" scan as a nav link rather
 * than a content warning.
 *
 * This is the short answer. The full notice lives above §06's tiers, at the
 * point of booking, and "the full notice" links there. It used to be a
 * standalone section between §01 and §02, where it interrupted the run from
 * the bus to the summons with a wall of warning text five sections away from
 * anything you could book.
 *
 * Native <details>. Progressive disclosure is exactly what the element is
 * for: keyboard-operable, announces its own expanded state, findable by
 * in-page search while shut, and no script.
 *
 * Copy lives in lib/admission.ts, shared with §06 so the two cannot drift.
 */
export function AdmissionGate() {
  return (
    <details className={styles.gate}>
      <summary className={cn("t-record", styles.summary)}>
        <span className={styles.tag}>{ADMISSION.tag}</span>
        <span className={styles.prompt}>{ADMISSION.prompt}</span>
        <span className={styles.marker} aria-hidden="true" />
      </summary>

      <div className={styles.panel}>
        <p className={cn("t-record", styles.terms)}>
          {TERMS.map((term, i) => (
            <span key={term}>
              {i > 0 ? <span className={styles.dot}> · </span> : null}
              {term}
            </span>
          ))}
        </p>
        <p className={cn("t-record", styles.gateLine)}>{ADMISSION.consent}</p>
        <a className={cn("t-record", styles.gateMore)} href="#admission">
          the full notice
        </a>
      </div>
    </details>
  );
}
