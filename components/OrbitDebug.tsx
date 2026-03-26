"use client"
import { useEffect, useRef } from "react"

const ORBITS = [
  { radius: 160, color: "rgba(0,240,255,0.2)" },
  { radius: 260, color: "rgba(0,240,255,0.15)" },
  { radius: 360, color: "rgba(0,240,255,0.1)" }
]

export default function OrbitDebug({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      // Kreuz im Zentrum
      ctx.strokeStyle = "rgba(255,0,0,0.5)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx - 20, cy)
      ctx.lineTo(cx + 20, cy)
      ctx.moveTo(cx, cy - 20)
      ctx.lineTo(cx, cy + 20)
      ctx.stroke()

      // Orbit-Kreise
      ORBITS.forEach(orbit => {
        ctx.strokeStyle = orbit.color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(cx, cy, orbit.radius, 0, Math.PI * 2)
        ctx.stroke()
      })
    }

    resize()
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 14 }}
    />
  )
}
