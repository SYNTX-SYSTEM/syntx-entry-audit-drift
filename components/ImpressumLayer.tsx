"use client"
import { useEffect, useState } from "react"
import { perturb, onAttractorChange } from "@/lib/attractorSystem"

interface ImpressumLayerProps {
  onClose: () => void
}

export default function ImpressumLayer({ onClose }: ImpressumLayerProps) {
  const [glowSize, setGlowSize] = useState(50)
  const [glowOpacity, setGlowOpacity] = useState(0.25)

  useEffect(() => {
    perturb(-0.3)
    document.body.style.filter = "brightness(0.85) contrast(0.95)"
    
    let phase = 0
    const iv = setInterval(() => {
      phase += 0.0008
      const breathWave = Math.sin(phase) * 0.5 + 0.5
      setGlowSize(50 + breathWave * 60)
      setGlowOpacity(0.25 + breathWave * 0.25)
    }, 50)
    
    return () => {
      clearInterval(iv)
      document.body.style.filter = "none"
      perturb(0.1)
    }
  }, [])

  const modalGlowStyle = {
    boxShadow: `0 0 ${glowSize}px rgba(50, 255, 150, ${glowOpacity})`,
    transition: 'box-shadow 1200ms ease-in-out'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
      style={{ 
        background: 'rgba(10, 14, 26, 0.90)',
        animation: 'fadeIn 800ms ease-out'
      }}
    >
      <div 
        className="max-w-xl w-full mx-8 p-8 border border-accent/20 rounded-lg bg-panel/80 backdrop-blur-xl"
        style={modalGlowStyle}
      >
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <span className="tracking-[0.3em] text-xs opacity-40 font-light">
            SYSTEM TRANSPARENCY
          </span>
          <button 
            onClick={onClose}
            className="text-muted/40 hover:text-accent transition-all duration-300 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm opacity-70 font-light leading-relaxed">
          <div>
            <p className="text-accent/60 text-xs tracking-wider mb-2">ENTITY</p>
            <p>SYNTX System</p>
          </div>

          <div>
            <p className="text-accent/60 text-xs tracking-wider mb-2">LOCATION</p>
            <p>Lorem Ipsum Street 123</p>
            <p>45678 Dolor Sit</p>
            <p>Deutschland</p>
          </div>

          <div>
            <p className="text-accent/60 text-xs tracking-wider mb-2">CONTACT</p>
            <p>contact@syntx-system.com</p>
          </div>

          <div>
            <p className="text-accent/60 text-xs tracking-wider mb-2">RESPONSIBLE</p>
            <p>Lorem Ipsum</p>
            <p>Verantwortlich gemäß § 5 TMG</p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-accent/60 text-xs tracking-wider mb-2">REGISTRY</p>
            <p>Handelsregister: HRB 123456</p>
            <p>Amtsgericht Dolor Sit</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-xs opacity-40 text-center font-light tracking-wide">
          <p>© 2025 SYNTX SYSTEM · ALL RIGHTS RESERVED</p>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
