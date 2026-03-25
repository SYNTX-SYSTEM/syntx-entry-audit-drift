"use client";

import { useFieldClock } from "@/app/system/FieldProvider";

export default function EmailRow() {
  const clock = useFieldClock();

  return (
    <input
      type="email"
      placeholder="your@email.com"
      onFocus={() => clock.modulate({ interactionWeight: 0.4 })}
      onBlur={() => clock.modulate({ interactionWeight: 0 })}
      onChange={() => clock.modulate({ interactionWeight: 0.6 })}
      style={{
        width: "100%",
        height: 44,
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "0 12px",
        fontSize: 14,
        color: "#e5eefb",
        outline: "none"
      }}
    />
  );
}
