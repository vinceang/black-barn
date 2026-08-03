import { cn } from "@/lib/cn";
import styles from "./Admission.module.css";

/**
 * THE ADMISSION NOTICE — in two parts.
 *
 * The whole notice was first bolted across the top of §01 and took a third of
 * the phone viewport, reducing the hero to a wheel and a door. The thesis shot
 * should not pay for the disclaimer, and the disclaimer should not be crammed.
 *
 * So the hook goes on the hero — four words and a rule, enough to change what
 * you think you are looking at — and the disclosure gets its own band directly
 * beneath, with room to be read.
 *
 * NOTE ON AUTHORSHIP: this copy is not in docs/creative-direction.md §5. It was
 * written to brief and should be treated as replaceable, unlike §5's copy which
 * is final. The consent sentence deliberately mirrors §5.4.02 so the two cannot
 * drift apart.
 *
 * It discloses in words only. §2.6's hard line — nothing explicit, no restraint
 * imagery — governs pictures, and nothing here licenses any.
 */

/** The terms, as a list. Set as a run of middots so the eye counts them. */
const TERMS = ["restraint", "nudity", "ritual", "total darkness"] as const;

/** Sits inside §01, under the header. Four words and a rule. */
export function AdmissionStrip() {
  return (
    <aside className={styles.strip} aria-label="Admission notice">
      <p className={cn("t-signage", styles.stripHeading)}>Admission notice · 18+</p>
      <p className={cn("t-record", styles.stripTerms)}>
        {TERMS.map((term, i) => (
          <span key={term}>
            {i > 0 ? <span className={styles.dot}> · </span> : null}
            {term}
          </span>
        ))}
      </p>
      <a className={cn("t-record", styles.stripMore)} href="#admission">
        what this means
      </a>
    </aside>
  );
}

/**
 * The full disclosure, directly below the hero.
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
