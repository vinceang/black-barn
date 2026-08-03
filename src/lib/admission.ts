/**
 * THE ADMISSION COPY.
 *
 * Shared by two surfaces that must never disagree: the small gate beside §01's
 * CTA, and the full notice above §06's tiers. Kept here rather than duplicated
 * so a change to what the site discloses cannot land in one place only.
 *
 * NOTE ON AUTHORSHIP: none of this is in docs/creative-direction.md §5. It was
 * written to brief and should be treated as replaceable, unlike §5's copy which
 * is final. The consent sentence deliberately mirrors §5.4.02 so the two cannot
 * drift apart.
 *
 * It discloses in words only. §2.6's hard line — nothing explicit, no restraint
 * imagery — governs pictures, and nothing here licenses any.
 */

/** Set as a run of middots so the eye counts them. */
export const TERMS = ["restraint", "nudity", "ritual", "total darkness"] as const;

export const ADMISSION = {
  tag: "Admission notice · 18+",
  /** What the closed gate offers. Deliberately not explicit. */
  prompt: "what you are agreeing to",

  /** The Barn's own voice. Everything after this is the clerk again. */
  lede: "You will be touched. You will be separated from the people you came with.",

  detail:
    "There is restraint. There is nudity. There is ritual, and a stretch of the night with no light of any kind. Some of what happens is designed to frighten you and some of it is not designed at all.",

  consent:
    "Consent is taken at boarding and may be withdrawn at any point, from any Usher, without discussion. Nobody will try to talk you out of it.",

  /**
   * The turn. Everything above is a reason to stay away; this is other people
   * going anyway, which is what makes a warning something you measure yourself
   * against rather than something you obey.
   */
  turn: "Last season it was withdrawn eleven times, out of eight hundred and eighty.",
} as const;
