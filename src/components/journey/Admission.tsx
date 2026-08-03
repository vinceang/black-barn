import { cn } from "@/lib/cn";
import styles from "./Admission.module.css";

/**
 * THE ADMISSION NOTICE — in two parts.
 *
 * PART ONE is a closed disclosure sitting immediately above §01's CTA, so the
 * warning is attached to the decision it qualifies. It began as a strip across
 * the top of the hero and that was wrong twice over: it took a third of the
 * phone viewport, and a row of monospace words at the top of a page reads as
 * navigation — which made "nudity" scan as a nav link rather than a content
 * warning. Closed by default, the terms are only ever shown to someone who
 * asked for them.
 *
 * Native <details>. Progressive disclosure is exactly what the element is for:
 * it is keyboard-operable, announces its own expanded state, and is findable
 * by in-page search even while shut, with no script at all.
 *
 * PART TWO is the full disclosure, further down, where it has room to be read.
 *
 * NOTE ON AUTHORSHIP: this copy is not in docs/creative-direction.md §5. It was
 * written to brief and should be treated as replaceable, unlike §5's copy which
 * is final. The consent sentences deliberately mirror §5.4.02 so the two cannot
 * drift apart.
 *
 * It discloses in words only. §2.6's hard line — nothing explicit, no restraint
 * imagery — governs pictures, and nothing here licenses any.
 */

/** The terms, as a list. Set as a run of middots so the eye counts them. */
const TERMS = ["restraint", "nudity", "ritual", "total darkness"] as const;

/**
 * Sits directly above §01's CTA. Shut, it is a label on a decision; open, it
 * is the shortest honest answer to what that decision involves.
 */
export function AdmissionGate() {
  return (
    <details className={styles.gate}>
      <summary className={cn("t-record", styles.summary)}>
        <span className={styles.tag}>Admission notice · 18+</span>
        <span className={styles.prompt}>what you are agreeing to</span>
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
        <p className={cn("t-record", styles.gateLine)}>
          Consent is taken at boarding and may be withdrawn at any point, from any Usher,
          without discussion.
        </p>
        <a className={cn("t-record", styles.gateMore)} href="#admission">
          the full notice
        </a>
      </div>
    </details>
  );
}

/**
 * The full disclosure, below the hero.
 *
 * Everything before the last sentence is a reason to stay away. The closing
 * figure is other people going anyway, which is what turns a warning into
 * something you have to measure yourself against.
 */
export function AdmissionNotice() {
  return (
    <section id="admission" className={styles.notice} aria-label="Before you book">
      <div className={styles.inner}>
        <p className={cn("t-signage", styles.noticeHeading)}>Before you book</p>

        <div className={styles.body}>
          <p className={cn("t-invitation", styles.lede)}>
            You will be touched. You will be separated from the people you came with.
          </p>

          <p className={cn("t-record", styles.detail)}>
            There is restraint. There is nudity. There is ritual, and a stretch of the night
            with no light of any kind. Some of what happens is designed to frighten you and
            some of it is not designed at all.
          </p>

          <p className={cn("t-record", styles.detail)}>
            Consent is taken at boarding and may be withdrawn at any point, from any Usher,
            without discussion. Nobody will try to talk you out of it.
          </p>

          <p className={cn("t-record", styles.turn)}>
            Last season it was withdrawn eleven times, out of eight hundred and eighty.
          </p>

          <a className={cn("t-record", styles.more)} href="#questions">
            read the orientation notes
          </a>
        </div>
      </div>
    </section>
  );
}
