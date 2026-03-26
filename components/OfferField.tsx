"use client"
import { useEffect, useState, useRef } from "react"
import { getRandomTerm, type LanguageCode as OfferLangCode } from "@/lib/offerTerms"
import { isExampleTerm, getExamplePDF, type LanguageCode as ExampleLangCode } from "@/lib/exampleTerms"
import { modulate } from "@/lib/attractorSystem"

interface FloatingTerm {
  id: number
  text: string
  angle: number
  radius: number
  speed: number
  isExample: boolean
}

interface OfferFieldProps {
  active: boolean
  language: string
  onExampleClick: (pdfUrl: string) => void
}

export default function OfferField({ active, language, onExampleClick }: OfferFieldProps) {
  const [terms, setTerms] = useState<FloatingTerm[]>([])
  const [centerX, setCenterX] = useState(0)
  const [centerY, setCenterY] = useState(0)
  const nextIdRef = useRef(0)
  const animationRef = useRef<number>()
  const usedTermsRef = useRef<Set<string>>(new Set())

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
    if (!active) {
      setTerms([])
      usedTermsRef.current.clear()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const spawnTerm = () => {
      setTerms(prev => {
        if (prev.length >= 10) return prev

        let newText = getRandomTerm(language as OfferLangCode)
        let attempts = 0
        while (usedTermsRef.current.has(newText) && attempts < 20) {
          newText = getRandomTerm(language as OfferLangCode)
          attempts++
        }

        const isExample = isExampleTerm(newText, language as ExampleLangCode)

        const newTerm: FloatingTerm = {
          id: nextIdRef.current++,
          text: newText,
          angle: Math.random() * Math.PI * 2,
          radius: 300 + Math.random() * 200,
          speed: (Math.random() > 0.5 ? 1 : -1) * (0.0004 + Math.random() * 0.0006),
          isExample
        }

        usedTermsRef.current.add(newText)

        setTimeout(() => {
          setTerms(current => current.filter(t => t.id !== newTerm.id))
          usedTermsRef.current.delete(newText)
        }, 45000)

        return [...prev, newTerm]
      })
    }

    spawnTerm()

    const interval = setInterval(() => {
      spawnTerm()
    }, 4000 + Math.random() * 3000)

    return () => {
      clearInterval(interval)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, language])

  useEffect(() => {
    if (!active || terms.length === 0) return

    const animate = () => {
      setTerms(prev => 
        prev.map(term => ({
          ...term,
          angle: term.angle + term.speed
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
  }, [active, terms.length])

  const handleTermClick = (term: FloatingTerm) => {
    if (!term.isExample) return
    
    const pdfUrl = getExamplePDF(term.text, language as ExampleLangCode)
    if (pdfUrl) {
      modulate({ exampleActive: true })
      onExampleClick(pdfUrl)
    }
  }

  if (!active && terms.length === 0) return null

  return (
    <div className="fixed inset-0" style={{ zIndex: 15, pointerEvents: 'none' }}>
      {terms.map(term => {
        const x = centerX + Math.cos(term.angle) * term.radius
        const y = centerY + Math.sin(term.angle) * term.radius

        return (
          <div
            key={term.id}
            onClick={() => handleTermClick(term)}
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
              border: term.isExample ? '2px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.2)',
              boxShadow: `
                0 0 15px rgba(0, 240, 255, 0.3),
                inset 0 0 20px rgba(0, 240, 255, 0.1)
              `,
              transition: 'opacity 3s ease-in-out, border 300ms ease',
              animation: 'termFadeIn 3s ease-out, termPulse 4s ease-in-out infinite',
              pointerEvents: term.isExample ? 'auto' : 'none',
              cursor: term.isExample ? 'pointer' : 'default'
            }}
          >
            {term.text}
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
            opacity: 0.5;
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
