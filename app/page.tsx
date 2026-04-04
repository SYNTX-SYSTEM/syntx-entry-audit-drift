"use client"
import { useEffect, useState } from "react"
import EntryKernel from "@/components/EntryKernel"
import ParticleNetwork from "@/components/ParticleNetwork"
import Footer from "@/components/Footer"
import ImpressumLayer from "@/components/ImpressumLayer"
import OfferField from "@/components/OfferField"
import DynamicOrbitField from "@/components/DynamicOrbitField"
import ExampleField from "@/components/ExampleField"
import type { OrbitTerm } from "@/lib/orbitApi"
import Image from "next/image"
import { getLogoColor, type LogoState } from "@/lib/colorFilters"
import { perturb } from "@/lib/attractorSystem"

export default function Home() {
  const [logoState, setLogoState] = useState<LogoState>('white')
  const [showImpressum, setShowImpressum] = useState(false)
  const [showOfferField, setShowOfferField] = useState(false)
  const [language, setLanguage] = useState("EN")
  const [activePDF, setActivePDF] = useState<string | null>(null)
  const [orbitTerms, setOrbitTerms] = useState<OrbitTerm[]>([])

  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<{ state: LogoState }>) => {
      setLogoState(e.detail.state)
    }
    
    const handleLanguageChange = (e: CustomEvent<{ language: string }>) => {
      setLanguage(e.detail.language)
    }
    
    window.addEventListener('logoStateChange', handleLogoChange as EventListener)
    window.addEventListener('languageChange', handleLanguageChange as EventListener)
    
    return () => {
      window.removeEventListener('logoStateChange', handleLogoChange as EventListener)
      window.removeEventListener('languageChange', handleLanguageChange as EventListener)
    }
  }, [])

  const handleLogoClick = () => {
    if (showImpressum) return
    
    const newState = !showOfferField
    setShowOfferField(newState)
    perturb(newState ? 0.2 : -0.2)
  }

  const handleExampleClick = (pdfUrl: string) => {
    setActivePDF(pdfUrl)
    console.log("🎯 page.tsx handleExampleClick called with:", pdfUrl)
    console.log("🎯 Setting activePDF to:", pdfUrl)
  }

  const logoOpacity = showImpressum ? 0.3 : 0.9
  const logoPulse = showOfferField ? 1.05 : 1

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg text-textPrimary px-8">
      <ParticleNetwork portalActive={showOfferField} />
      
      <OfferField 
        active={showOfferField} 
        terms={orbitTerms}
        onExampleClick={handleExampleClick}
      />

      <div className="absolute top-10 z-20 flex items-center justify-center">
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full border-2 border-accent/30 transition-all duration-1000" 
            style={{ 
              padding: '8px',
              animation: showImpressum ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} 
          />
          <button
            onClick={handleLogoClick}
            className="relative rounded-full border border-accent/20 p-2 bg-bg/50 backdrop-blur-sm overflow-hidden cursor-pointer transition-transform duration-400"
            style={{ transform: `scale(${logoPulse})` }}
          >
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
          </button>
        </div>
      </div>

      <EntryKernel />
      
      <DynamicOrbitField language={language} onTermsReady={setOrbitTerms} />
      
      <ExampleField pdfUrl={activePDF} />

      <Footer onImpressumClick={() => setShowImpressum(true)} />

      {showImpressum && (
        <ImpressumLayer onClose={() => setShowImpressum(false)} />
      )}
    </main>
  )
}
