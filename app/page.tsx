"use client"
import { useEffect, useState } from "react"
import EntryKernel from "@/components/EntryKernel"
import ParticleNetwork from "@/components/ParticleNetwork"
import Footer from "@/components/Footer"
import Image from "next/image"
import { getLogoColor, type LogoState } from "@/lib/colorFilters"

export default function Home() {
  const [logoState, setLogoState] = useState<LogoState>('white')

  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<{ state: LogoState }>) => {
      setLogoState(e.detail.state)
    }
    
    window.addEventListener('logoStateChange', handleLogoChange as EventListener)
    return () => window.removeEventListener('logoStateChange', handleLogoChange as EventListener)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg text-textPrimary px-8">
      <ParticleNetwork />

      <div className="absolute top-10 z-20 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-pulse" style={{ padding: '8px' }} />
          <div className="relative rounded-full border border-accent/20 p-2 bg-bg/50 backdrop-blur-sm overflow-hidden">
            <div className="relative">
              <Image 
                src="/Logo1.png" 
                alt="SYNTX" 
                width={120} 
                height={120}
                className="opacity-90 rounded-full"
              />
              <div 
                className="absolute inset-0 rounded-full transition-all duration-1000 pointer-events-none mix-blend-overlay"
                style={{ backgroundColor: getLogoColor(logoState) }}
              />
            </div>
          </div>
        </div>
      </div>

      <EntryKernel />
      <Footer />
    </main>
  )
}
