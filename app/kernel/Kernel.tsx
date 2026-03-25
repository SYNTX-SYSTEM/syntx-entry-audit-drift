"use client";

import { useEffect, useRef } from "react";
import { useFieldClock } from "@/app/system/FieldProvider";
import EmailRow from "./EmailRow";
import SourceRow from "./SourceRow";
import ActionRow from "./ActionRow";

export default function Kernel() {
  const kernelRef = useRef<HTMLDivElement>(null);
  const clock = useFieldClock();

  useEffect(() => {
    if (!kernelRef.current) return;

    const element = kernelRef.current;

    clock.subscribe((field) => {
      const intensity = field.baseIntensity + field.interactionWeight + field.absorptionSpike;
      const mass = 1 + intensity * 0.4;
      const compression = field.thresholdCompression;

      element.style.transform = `scale(${1 + mass * 0.02})`;
      element.style.boxShadow = `0 0 ${40 * mass}px rgba(0,217,255,${intensity})`;
      element.style.filter = `brightness(${1 - compression * 0.2})`;
    });
  }, [clock]);

  return (
    <div
      ref={kernelRef}
      style={{
        width: 520,
        margin: "0 auto",
        marginTop: "15vh",
        padding: 24,
        borderRadius: 12,
        background: "#111827",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}
    >
      <EmailRow />
      <SourceRow />
      <ActionRow />
    </div>
  );
}
