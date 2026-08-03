import { ADMISSION, TERMS } from "@/lib/admission";
import { cn } from "@/lib/cn";
import styles from "./AdmissionNotice.module.css";

/**
 * BEFORE YOU BOOK — the full disclosure, at the point of booking.
 *
 * This began life as its own section between §01 and §02, which was wrong on
 * both counts. It put a wall of warning text three screens into a cinematic
 * scroll, interrupting the run from the bus to the summons; and it sat five
 * sections away from the decision it qualifies. A notice headed "before you
 * book" belongs immediately above the thing you book with.
 *
 * Closed by default. Someone reading the journey is never made to read this;
 * someone about to choose a seat is one click from all of it.
 *
 * The gate beside §01's CTA links here with #admission, which opens it. That
 * lives in an inline script on the page rather than in an effect here: §06 is
 * client:visible, so an effect would only fire once this island hydrates, and
 * the reader would land on a shut box in the meantime. Nothing in this
 * component needs to be interactive, so nothing here is.
 */
export function AdmissionNotice() {
  return (
    <details id="admission" className={styles.notice}>
      <summary className={cn("t-record", styles.summary)}>
        <span className={styles.tag}>Before you book · 18+</span>
        <span className={styles.prompt}>what this involves</span>
        <span className={styles.marker} aria-hidden="true" />
      </summary>

      <div className={styles.panel}>
        <p className={cn("t-invitation", styles.lede)}>{ADMISSION.lede}</p>

        <div className={styles.body}>
          <p className={cn("t-record", styles.terms)}>
            {TERMS.map((term, i) => (
              <span key={term}>
                {i > 0 ? <span className={styles.dot}> · </span> : null}
                {term}
              </span>
            ))}
          </p>

          <p className={cn("t-record", styles.detail)}>{ADMISSION.detail}</p>
          <p className={cn("t-record", styles.detail)}>{ADMISSION.consent}</p>
          <p className={cn("t-record", styles.turn)}>{ADMISSION.turn}</p>

          <a className={cn("t-record", styles.more)} href="#questions">
            read the orientation notes
          </a>
        </div>
      </div>
    </details>
  );
}
