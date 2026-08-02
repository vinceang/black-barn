import { useState } from "react";
import { cn } from "@/lib/cn";

/** §5.5 — copy is final. */
const LABEL = "Tell me when it opens again";
/** §5.5 — the email error, which now has a field to belong to. */
const EMAIL_ERROR = "we need a way to reach you.";

/**
 * §5.5 — the newsletter opt-in.
 *
 * §8 makes this the most valuable thing on the site out of season: "Ship the
 * off-season page and the newsletter capture *before* announcing. Build the
 * list in the dark." It lives in §10 during the season so the capture never
 * goes away.
 *
 * This is also the only field on the site that validates an address, and the
 * only place §5.5's email error can honestly appear — §07's form asks for a
 * name, companions and a reason, and none of those is an email.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="t-record notice__signed" role="status">
        you will be told. nothing else will be sent.
      </p>
    );
  }

  return (
    <form
      className="notice__signup"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        // Deliberately loose. A shape check, not a gate.
        if (!/.+@.+\..+/.test(email.trim())) {
          setError(EMAIL_ERROR);
          return;
        }
        setError("");
        setDone(true);
      }}
    >
      <label className="t-record notice__signupLabel" htmlFor="bb-email">
        {LABEL}
      </label>
      <div className="notice__signupRow">
        <div className="notice__signupField">
          <input
            id="bb-email"
            type="email"
            className="notice__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "bb-email-error" : undefined}
          />
        </div>
        <button type="submit" className={cn("t-signage", "notice__submit")}>
          Tell me
        </button>
      </div>
      {error ? (
        <p id="bb-email-error" className="t-record notice__error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
