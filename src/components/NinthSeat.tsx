import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * §8 THE NINTH SEAT — "/nine".
 *
 * "One seat per departure is not for sale... The request form asks one
 * question: why should it be you? Selected guests get the seat free, are
 * boarded separately, and have a materially different night."
 *
 * One field. No name, no email, no departure picker — asking for those would
 * make it a booking form, and §06 is explicit that this seat "is not sold. It
 * is offered." The only thing being collected is an answer.
 */
export function NinthSeat() {
  const [why, setWhy] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="t-record nine__sent" role="status">
        it has been read. if the seat is offered to you, you will be told where to stand and
        when. do not ask again.
      </p>
    );
  }

  return (
    <form
      className="nine__form"
      onSubmit={(e) => {
        e.preventDefault();
        // No validation. There is no wrong answer, and there is no right one.
        setSent(true);
      }}
    >
      <label className="t-record nine__label" htmlFor="nine-why">
        WHY SHOULD IT BE YOU
      </label>
      <div className="nine__wrap">
        <textarea
          id="nine-why"
          className="nine__input"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          rows={5}
        />
      </div>
      <button type="submit" className={cn("t-signage", "plain__back")}>
        Request consideration
      </button>
    </form>
  );
}
