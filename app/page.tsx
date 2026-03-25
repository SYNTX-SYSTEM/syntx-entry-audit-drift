"use client"
import { useEffect, useState } from "react"
import EntryKernel from "@/components/EntryKernel"
import ParticleNetwork from "@/components/ParticleNetwork"
import Footer from "@/components/Footer"
import ImpressumLayer from "@/components/ImpressumLayer"
import Image from "next/image"
import { getLogoColor, type LogoState } from "@/lib/colorFilters"

export default function Home() {
  const [logoState, setLogoState] = useState<LogoState>('white')
  const [showImpressum, setShowImpressum] = useState(false)

  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<{ state: LogoState }>) => {
      setLogoState(e.detail.state)
    }
    
    window.addEventListener('logoStateChange', handleLogoChange as EventListener)
    return () => window.removeEventListener('logoStateChange', handleLogoChange as EventListener)
  }, [])

  // Logo dimmt im Structure Mode
  const logoOpacity = showImpressum ? 0.3 : 0.9

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg text-textPrimary px-8">
      <ParticleNetwork />

      <div className="absolute top-10 z-20 flex items-center justify-center">
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full border-2 border-accent/30 transition-all duration-1000" 
            style={{ 
              padding: '8px',
              animation: showImpressum ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} 
          />
          <div className="relative rounded-full border border-accent/20 p-2 bg-bg/50 backdrop-blur-sm overflow-hidden">
            <div className="relative">
              <Image 
                src="/Logo1.png" 
                alt="SYNTX" 
                width={120} 
                height={120}
                className="rounded-full transition-all duration-1000"
                style={{ opacity: logoOpacity }}
              />
              <div 
                className="absolute inset-0 rounded-full transition-all duration-1000 pointer-events-none mix-blend-overlay"
                style={{ 
                  backgroundColor: showImpressum ? 'transparent' : getLogoColor(logoState)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <EntryKernel />
      <Footer onImpressumClick={() => setShowImpressum(true)} />

      {showImpressum && (
        <ImpressumLayer onClose={() => setShowImpressum(false)} />
      )}
    </main>
  )
}
