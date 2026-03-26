"use client"
import { useEffect, useState } from "react"
import { onAttractorChange, modulate } from "@/lib/attractorSystem"

interface ExampleFieldProps {
  pdfUrl: string | null
}

export default function ExampleField({ pdfUrl }: ExampleFieldProps) {
  const [attractor, setAttractor] = useState(0)

  useEffect(() => {
    let st: any
    onAttractorChange((s) => { st = s })
    
    const iv = setInterval(() => {
      if (!st) return
      setAttractor(st.exampleAttractor)
    }, 16)
    
    return () => clearInterval(iv)
  }, [])

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      modulate({ exampleActive: false })
    }
  }

  if (attractor < 0.6 || !pdfUrl) return null

  const opacity = Math.min(1, Math.max(0, (attractor - 0.6) / 0.4))
  const scale = 0.92 + attractor * 0.08

  return (
    <div 
      onClick={handleBackgroundClick}
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 25,
        opacity,
        transition: 'opacity 400ms ease-out',
        pointerEvents: attractor > 0.6 ? 'auto' : 'none',
        background: `rgba(0, 0, 0, ${0.3 + attractor * 0.4})`
      }}
    >
      <div
        className="relative bg-panel/98 rounded-lg overflow-hidden border border-accent/30"
        style={{
          width: '70%',
          height: '80%',
          transform: `scale(${scale})`,
          boxShadow: '0 0 60px rgba(0, 217, 255, 0.3), 0 0 120px rgba(0, 217, 255, 0.15)',
          transition: 'transform 400ms ease-out'
        }}
      >
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          style={{ border: 'none' }}
          title="Example Document"
        />
      </div>
    </div>
  )
}
