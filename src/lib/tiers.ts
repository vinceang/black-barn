/**
 * §06 PASSAGE — "Booking, but framed as boarding."
 *
 * Copy is final (§5). Prices, names and lines are not editable here.
 */

export interface Tier {
  name: string;
  /** null = not sold. §06's Ninth Seat has no price and no button. */
  priceUSD: number | null;
  line: string;
  /** The Ninth Seat is requested, not bought. */
  request?: { label: string; href: string };
}

export const TIERS: readonly Tier[] = [
  {
    name: "Passenger",
    priceUSD: 89,
    line: "A seat. The full route.",
  },
  {
    name: "Front Seat",
    priceUSD: 165,
    line: "First on, last off. You will see things the others are told not to look at.",
  },
  {
    name: "The Ninth Seat",
    priceUSD: null,
    line: "One per departure. It is not sold. It is offered.",
    // §8 — "discoverable only through the headlight cursor on §05". The route
    // exists and is linked here in plain sight for now; hiding it behind the
    // headlight is a change to this href, not to the page it leads to.
    request: { label: "request consideration", href: "/nine" },
  },
] as const;
