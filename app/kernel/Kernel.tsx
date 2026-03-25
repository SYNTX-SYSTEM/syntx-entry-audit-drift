"use client";

import { useEffect, useRef } from "react";
import { useFieldClock } from "@/app/system/FieldProvider";
import { KernelPhysics } from "./KernelPhysics";
import EmailRow from "./EmailRow";
import SourceRow from "./SourceRow";
import ActionRow from "./ActionRow";

export default function Kernel() {
  const kernelRef = useRef<HTMLDivElement>(null);
  const clock = useFieldClock();
  const physics = useRef(new KernelPhysics());

  useEffect(() => {
    clock.subscribe((field) => {
      const state = physics.current.update(field);

      if (!kernelRef.current) return;

      kernelRef.current.style.transform = `scale(${1 + state.mass * 0.02})`;
      kernelRef.current.style.boxShadow = `0 0 ${60 * state.mass}px rgba(0,217,255,0.2)`;
      kernelRef.current.style.filter = `brightness(${1 - state.compression * 0.2})`;
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
