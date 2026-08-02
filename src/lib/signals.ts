/**
 * §00 → §01 handoff.
 *
 * The Threshold owns when the site is revealed; the hero needs to know, so it
 * can time the door beat from the moment the viewer can actually see the bus.
 * A module-scoped flag plus an event keeps the two sections decoupled without
 * dragging a provider into the tree for one boolean.
 */

const THRESHOLD_CLEARED = "bb:threshold-cleared";

let cleared = false;

export function clearThreshold(): void {
  if (cleared) return;
  cleared = true;
  window.dispatchEvent(new Event(THRESHOLD_CLEARED));
}

export function isThresholdCleared(): boolean {
  return cleared;
}

/** Fires immediately if the Threshold is already gone. Returns an unsubscribe. */
export function onThresholdCleared(fn: () => void): () => void {
  if (cleared) {
    fn();
    return () => {};
  }
  window.addEventListener(THRESHOLD_CLEARED, fn, { once: true });
  return () => window.removeEventListener(THRESHOLD_CLEARED, fn);
}
