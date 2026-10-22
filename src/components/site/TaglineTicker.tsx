import type { CSSProperties } from "react";

import { useLang } from "@/lib/i18n";

/**
 * Slim marquee band shown above the sticky header: the firm tagline glides
 * right-to-left, pauses on hover, and freezes for reduced-motion visitors.
 */
export function TaglineTicker() {
  const { t } = useLang();
  const text = t("ticker.tagline");
  const duration = `${Math.max(34, Math.round(text.length * 0.32))}s`;

  return (
    <div
      className="ticker border-b border-gold/20"
      style={{ "--ticker-duration": duration } as CSSProperties}
    >
      {/* The mask lives on this inner layer so the navy bar stays solid while
          only the wording fades out at each end. */}
      <div className="ticker__fade">
        <div className="ticker__track">
          {/* Four identical copies; the track shifts by exactly one copy (-25%). */}
          {[0, 1, 2, 3].map((copy) => (
            <div
              key={copy}
              className="ticker__group"
              aria-hidden={copy === 0 ? undefined : true}
            >
              <span aria-hidden className="ticker__mark" />
              <span className="ticker__text">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
