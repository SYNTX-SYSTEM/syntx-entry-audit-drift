"use client";

import { useState } from "react";
import DriftScene from "@/components/DriftScene";
import Kernel from "@/components/Kernel";
import LegalAnchor from "@/components/LegalAnchor";
import type { KernelState } from "@/lib/types";

export default function Home() {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [state, setState] = useState<KernelState>("idle");

  const density = Math.min((email.length + url.length) / 120, 0.4);
  const driftValue = state === "success" ? 0.3 : Math.max(0.25, density);

  return (
    <>
      <DriftScene
        drift={driftValue}
        entropy={0.35}
        resonance={1.5}
      />

      <Kernel
        email={email}
        setEmail={setEmail}
        url={url}
        setUrl={setUrl}
        state={state}
        setState={setState}
      />

      <LegalAnchor />

      {process.env.NEXT_PUBLIC_ULTRADUCK === "true" && (
        <div
          style={{
            position: "fixed",
            bottom: 10,
            left: 10,
            fontSize: 10,
            opacity: 0.4
          }}
        >
          ULTRADUCK
        </div>
      )}
    </>
  );
}
