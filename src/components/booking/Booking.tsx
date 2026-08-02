import { useState } from "react";
import { Passage } from "./Passage";
import { Manifest } from "./Manifest";
import type { Departure, Seat } from "@/lib/seats/types";

/**
 * §06–§07 — the booking island.
 *
 * Separate from the journey island (§01–§05), which must not pay for seat
 * inventory it never reads. But §06 and §07 share one thing — which departure
 * you are looking at — so they stay together: selecting a night in the
 * calendar is what the manifest below is a manifest *of*, and splitting them
 * would mean lifting that state into a store to reunite it.
 *
 * Hydrated with client:visible, so the whole layer costs nothing until the
 * viewer has actually travelled the road.
 */
export function Booking({
  initialDeparture,
  initialSeats,
}: {
  initialDeparture: Departure | null;
  initialSeats: Seat[];
}) {
  /*
   * The next departure and its manifest are resolved at build time and handed
   * in, rather than fetched after hydration. Two reasons:
   *
   * 1. §07's effect depends entirely on there being names to read. A first
   *    paint that says "select a departure" and then fills in is a worse
   *    version of the section for the length of the round trip.
   * 2. It means the manifest is real, readable content in the HTML — it
   *    survives with JS off, and it is what a crawler or a screenshot sees.
   */
  const [selected, setSelected] = useState<Departure | null>(initialDeparture);

  return (
    <>
      <Passage onSelect={setSelected} />
      <Manifest departure={selected} initialSeats={initialSeats} />
    </>
  );
}
