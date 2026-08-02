import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** §5.5 — copy is final. "we keep a record of who comes here. accept / no" */
const NOTICE = "we keep a record of who comes here.";
const KEY = "bb.record";

/**
 * §5.5 — the cookie notice.
 *
 * Both answers are real answers. "no" is not a dark-pattern decline that
 * reopens next visit: the choice is stored either way, and nothing on this
 * site depends on having said yes. The seat inventory is simulated in the
 * browser and there is no analytics — which is exactly why the notice can
 * afford to be this short and this cold.
 */
export function CookieNotice() {
  const [asked, setAsked] = useState(true);

  useEffect(() => {
    try {
      setAsked(Boolean(window.localStorage.getItem(KEY)));
    } catch {
      // Private mode. Ask nothing rather than nag on every view.
      setAsked(true);
    }
  }, []);

  const answer = (value: "accept" | "no") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* nothing to store it in; the answer still stands for this session */
    }
    setAsked(true);
  };

  if (asked) return null;

  return (
    <aside className="cookie" role="note">
      <p className={cn("t-record", "cookie__line")}>{NOTICE}</p>
      <div className="cookie__actions">
        <button type="button" className="t-record cookie__button" onClick={() => answer("accept")}>
          accept
        </button>
        <span className="t-record cookie__slash">/</span>
        <button type="button" className="t-record cookie__button" onClick={() => answer("no")}>
          no
        </button>
      </div>
    </aside>
  );
}
