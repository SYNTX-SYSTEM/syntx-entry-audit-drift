"use client"
import { useEffect, useState, useRef } from "react"
import type { OrbitTerm } from "@/lib/orbitApi"
import { modulate } from "@/lib/attractorSystem"

interface FloatingTerm {
  id: number
  text: string
  pdfUrl: string
  angle: number
  radius: number
  speed: number
}

interface OfferFieldProps {
  active: boolean
  terms: OrbitTerm[]
  onExampleClick: (pdfUrl: string) => void
}

export default function OfferField({ active, terms, onExampleClick }: OfferFieldProps) {
  const [floatingTerms, setFloatingTerms] = useState<FloatingTerm[]>([])
  const [centerX, setCenterX] = useState(0)
  const [centerY, setCenterY] = useState(0)
  const nextIdRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const updateCenter = () => {
      setCenterX(window.innerWidth / 2)
      setCenterY(window.innerHeight / 2)
    }
    
    updateCenter()
    window.addEventListener('resize', updateCenter)
    return () => window.removeEventListener('resize', updateCenter)
  }, [])

  useEffect(() => {
    if (!active || terms.length === 0) {
      setFloatingTerms([])
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    // Spawn terms from backend
    const initialTerms: FloatingTerm[] = terms.map((orbitTerm, i) => ({
      id: nextIdRef.current++,
      text: orbitTerm.displayName,
      pdfUrl: orbitTerm.pdfUrl,
      angle: (i / Math.max(terms.length, 1)) * Math.PI * 2,
      radius: 400,
      speed: 0.0003
    }))
    
    console.log("📦 Spawning from backend:", initialTerms.length, "terms")
    setFloatingTerms(initialTerms)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, terms])

  useEffect(() => {
    if (!active || floatingTerms.length === 0) return

    const animate = () => {
      setFloatingTerms(prev => 
        prev.map(floatingTerm => ({
          ...floatingTerm,
          angle: floatingTerm.angle + floatingTerm.speed
        }))
      )
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, floatingTerms.length])

  const handleTermClick = (floatingTerm: FloatingTerm) => {
    console.log("🔥 CLICK EVENT!", floatingTerm.text, "PDF:", floatingTerm.pdfUrl)
    modulate({ exampleActive: true })
    // Add base URL for backend PDFs
    const fullUrl = `https://audit.syntx-system.com/${floatingTerm.pdfUrl}`
    console.log("📄 Opening PDF:", fullUrl)
    onExampleClick(fullUrl)
  }

  if (!active) return null

  return (
    <div className="fixed inset-0" style={{ zIndex: 15, pointerEvents: 'none' }}>
      {floatingTerms.map(floatingTerm => {
        const x = centerX + Math.cos(floatingTerm.angle) * floatingTerm.radius
        const y = centerY + Math.sin(floatingTerm.angle) * floatingTerm.radius

        return (
          <div
            key={floatingTerm.id}
            onClick={() => handleTermClick(floatingTerm)}
            className="absolute font-light whitespace-nowrap"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              fontSize: '1.125rem',
              letterSpacing: '0.05em',
              color: '#00f0ff',
              textShadow: `
                0 0 20px rgba(0, 240, 255, 0.8),
                0 0 40px rgba(0, 240, 255, 0.5),
                0 0 60px rgba(0, 217, 255, 0.3),
                0 0 80px rgba(0, 217, 255, 0.2)
              `,
              filter: 'blur(0.4px)',
              background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
              padding: '8px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(0, 240, 255, 0.5)',
              boxShadow: `
                0 0 15px rgba(0, 240, 255, 0.3),
                inset 0 0 20px rgba(0, 240, 255, 0.1)
              `,
              transition: 'opacity 3s ease-in-out, border 300ms ease',
              animation: 'termFadeIn 3s ease-out, termPulse 4s ease-in-out infinite',
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          >
            {floatingTerm.text}
          </div>
        )
      })}
      
      <style jsx>{`
        @keyframes termFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 0.5,
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes termPulse {
          0%, 100% {
            filter: blur(0.4px) brightness(1);
          }
          50% {
            filter: blur(0.3px) brightness(1.2);
          }
        }
      `}</style>
    </div>
  )
}