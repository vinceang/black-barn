/**
 * §5.4 — THE FAQ.
 *
 * Copy is final and verbatim. CLAUDE.md: "The safety and logistics answers in
 * the FAQ (items 02, 03, 08, 11) carry real information. Never soften or
 * stylize those beyond what's already written."
 *
 * §7.6 expects this to be the most-shared page on the site, "written so that
 * every answer is functionally useful and tonally wrong". Both halves of that
 * are load-bearing: do not make the useful answers atmospheric, and do not
 * make the atmospheric answers helpful.
 */

export const FAQ_HEADER = "ORIENTATION NOTES — READ BEFORE DEPARTURE — DO NOT REMOVE FROM VEHICLE";

export interface FaqItem {
  n: string;
  q: string;
  a: string;
  /** Items carrying real safety or logistics information. Never edit these. */
  operational?: boolean;
}

export const FAQ: readonly FaqItem[] = [
  {
    n: "01",
    q: "Is it scary?",
    a: "That has not been the most common complaint.",
  },
  {
    n: "02",
    q: "Will I be touched?",
    a: "Yes. Contact is part of the experience — guiding, holding, moving you between spaces. You will be asked to consent at boarding. You may withdraw that consent at any point by returning your wristband to any Usher. They will not argue with you.",
    operational: true,
  },
  {
    n: "03",
    q: "Can I leave?",
    a: "The bus returns at the end of the experience, approximately 90 minutes after arrival. If you need to leave sooner, tell any Usher and one will walk you back to the lot. It takes about twenty minutes on foot. Most people wait for the bus.",
    operational: true,
  },
  {
    n: "04",
    q: "What is wrong with the bus?",
    a: "It was built out of three other buses. Everything on it works. Two of the seats are original.",
  },
  {
    n: "05",
    q: "How long does it take?",
    a: "Two hours and forty minutes, door to door. Eleven minutes out. Ninety minutes there. Eleven minutes back. The remainder is spent waiting, which is intentional.",
    operational: true,
  },
  {
    n: "06",
    q: "Can we stay together as a group?",
    a: "No.",
  },
  {
    n: "07",
    q: "What should I wear?",
    a: "Closed shoes. Layers — it is colder at the barn than at the lot, by more than the distance explains. Nothing you would be upset to have ruined.",
  },
  {
    n: "08",
    q: "Are there strobes, loud sounds, or confined spaces?",
    a: "Yes to all three. There is also fog, darkness, water, uneven ground, and a section with no artificial light of any kind. If you are pregnant, have a heart condition, or are prone to seizures, do not book.",
    operational: true,
  },
  {
    n: "09",
    q: "Is it real?",
    a: "The barn is real. The road is real. The bus is real, and you can hear it from the lot before you see it. Everything else is a matter of what you are willing to accept about what happened to you.",
  },
  {
    n: "10",
    q: "What is Seat 7?",
    a: "Taken.",
  },
  {
    n: "11",
    q: "Can I photograph inside?",
    a: "No. Phones are collected at boarding and returned to you at the lot. This is enforced. It is also for your benefit — every account we have of that night was written down afterward, from memory, and none of them agree.",
    operational: true,
  },
  {
    n: "12",
    q: "What is the Ninth Seat?",
    a: "If you have to ask, the answer is that there isn't one.",
  },
] as const;
