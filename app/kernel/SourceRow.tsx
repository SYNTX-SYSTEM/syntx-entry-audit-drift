"use client";

import { useFieldClock } from "@/app/system/FieldProvider";

export default function SourceRow() {
  const clock = useFieldClock();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    clock.modulate({ absorptionSpike: 0.8 });
    setTimeout(() => clock.modulate({ absorptionSpike: 0 }), 300);
  };

  return (
    <input
      type="text"
      placeholder="paste url or drop pdf"
      onFocus={() => clock.modulate({ interactionWeight: 0.4 })}
      onBlur={() => clock.modulate({ interactionWeight: 0 })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
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
