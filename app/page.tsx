"use client";

import BackgroundCanvas from "@/app/engine/BackgroundCanvas";
import Kernel from "@/app/kernel/Kernel";
import LegalAnchor from "@/components/LegalAnchor";

export default function Home() {
  return (
    <>
      <BackgroundCanvas />
      <Kernel />
      <LegalAnchor />
    </>
  );
}
