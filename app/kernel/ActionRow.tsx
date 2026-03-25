"use client";

import { useFieldClock } from "@/app/system/FieldProvider";

export default function ActionRow() {
  const clock = useFieldClock();

  const handleClick = () => {
    clock.modulate({ thresholdCompression: 0.5 });
    setTimeout(() => {
      clock.modulate({ thresholdCompression: 0 });
    }, 1200);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "100%",
        height: 44,
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        fontSize: 14,
        color: "#e5eefb",
        cursor: "pointer",
        outline: "none"
      }}
    >
      Analyze
    </button>
  );
}
