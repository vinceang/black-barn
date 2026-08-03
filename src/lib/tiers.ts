/**
 * §06 PASSAGE — "Booking, but framed as boarding."
 *
 * Names, prices and the `line` for each tier are §5 copy and are final.
 *
 * `warning` and `stamp` are NOT in the creative direction — they were written
 * to brief and are replaceable. They exist to make choosing a seat feel like
 * choosing how much to risk: each tier now discloses something specific about
 * what it costs you, and the two upper tiers carry a stencilled refusal.
 *
 * Barnaby is never explained. He is named twice on the whole site — here, and
 * nowhere else — and no page says what he is. That is the point: §1's
 * ambiguity doctrine holds that "the most frightening sentence is a practical
 * instruction about an event that hasn't been described."
 */

export interface Tier {
  name: string;
  /** null = not sold. §06's Ninth Seat has no price and no button. */
  priceUSD: number | null;
  line: string;
  /** Written to brief, not from §5. Replaceable. */
  warning: string;
  /** A stencilled refusal, set in Signage. Optional. */
  stamp?: string;
  /** The Ninth Seat is requested, not bought. */
  request?: { label: string; href: string };
}

export const TIERS: readonly Tier[] = [
  {
    name: "Passenger",
    priceUSD: 89,
    line: "A seat. The full route.",
    warning:
      "You will be separated from your group within four minutes of arrival. If that is a problem, it is a problem now, and not later.",
  },
  {
    name: "Front Seat",
    priceUSD: 165,
    line: "First on, last off. You will see things the others are told not to look at.",
    warning:
      "If you are claustrophobic, or unwilling to be bound, we cannot risk you ending up with Barnaby.",
    stamp: "Do not select this seat",
  },
  {
    name: "The Ninth Seat",
    priceUSD: null,
    line: "One per departure. It is not sold. It is offered.",
    warning:
      "There is no guidance for this seat. Everyone who has taken it has declined to describe it, and we have stopped asking them to.",
    stamp: "Do not request it if you need to know first",
    // §8 — "discoverable only through the headlight cursor on §05". The route
    // exists and is linked here in plain sight for now; hiding the way in is a
    // change to this href, not to the page it leads to.
    request: { label: "request consideration", href: "/nine" },
  },
] as const;
