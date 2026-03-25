"use client"
import { useEffect, useRef, useState } from "react"
import { onAttractorChange } from "@/lib/attractorSystem"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [energy, setEnergy] = useState(0.2)
  const energyRef = useRef(0.2)

  useEffect(() => {
    let st: any
    onAttractorChange((s) => { st = s })
    const iv = setInterval(() => {
      if (!st) return
      setEnergy(st.energy)
      energyRef.current = st.energy
    }, 50)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 80
    const connectionDistance = 150
    const baseSpeed = 0.15

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: (Math.random() - 0.5) * baseSpeed
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const currentEnergy = energyRef.current
      const speedMultiplier = 1 + Math.max(0, currentEnergy - 0.2) * 1.5
      const particleOpacity = 0.3 + Math.max(0, currentEnergy - 0.2) * 0.4
      const lineOpacity = 0.15 + Math.max(0, currentEnergy - 0.2) * 0.2

      particles.forEach((particle, i) => {
        particle.x += particle.vx * speedMultiplier
        particle.y += particle.vy * speedMultiplier

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 217, 255, ${particleOpacity})`
        ctx.fill()

        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const baseOpacity = (1 - distance / connectionDistance) * lineOpacity
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 217, 255, ${baseOpacity})`
            ctx.lineWidth = 1
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
