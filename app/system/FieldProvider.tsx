"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { MotionClock, FieldVector } from "./MotionClock";

type FieldContextType = {
  clock: MotionClock;
};

const FieldContext = createContext<FieldContextType | null>(null);

export function FieldProvider({ children }: { children: ReactNode }) {
  const clockRef = useRef<MotionClock | null>(null);

  if (!clockRef.current) {
    const initialField: FieldVector = {
      phase: 0,
      noiseDrift: 0,
      baseIntensity: 0.05,
      interactionWeight: 0,
      absorptionSpike: 0,
      thresholdCompression: 0
    };

    clockRef.current = new MotionClock(initialField);
  }

  useEffect(() => {
    clockRef.current!.start();
  }, []);

  return (
    <FieldContext.Provider value={{ clock: clockRef.current }}>
      {children}
    </FieldContext.Provider>
  );
}

export function useFieldClock() {
  const ctx = useContext(FieldContext);
  if (!ctx) throw new Error("useFieldClock must be inside FieldProvider");
  return ctx.clock;
}
