import { useEffect, useRef, useState } from "react";

/**
 * Clamps text to `lines` by default so cards with varying content lengths
 * stay a uniform height, with a "Read more"/"Read less" toggle to expand —
 * used by LeadershipMessages.jsx and EquipmentLease.jsx. Measures the
 * rendered element's actual overflow (rather than guessing from character
 * count) so the toggle only ever appears when there's really more to show.
 */
const ReadMoreText = ({ text, lines = 3, className = "", linkClassName = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight - el.clientHeight > 1);
  }, [text, lines]);

  if (!text) return null;

  return (
    <div>
      <p
        ref={ref}
        className={className}
        style={!expanded ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className={linkClassName}>
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
