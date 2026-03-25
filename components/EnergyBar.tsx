"use client"
import { useEffect, useState } from "react"

interface EnergyBarProps {
  emailValid: boolean
  hasSource: boolean
  onClick: () => void
  disabled: boolean
}

export default function EnergyBar({ 
  emailValid, 
  hasSource, 
  onClick, 
  disabled
}: EnergyBarProps) {
  const [breathPhase, setBreathPhase] = useState(0)
  const [width, setWidth] = useState(20)
  const [color, setColor] = useState({ r: 255, g: 50, b: 50 })

  useEffect(() => {
    const iv = setInterval(() => {
      setBreathPhase(prev => prev + 0.0008)
    }, 50)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    let targetWidth = 20
    let targetColor = { r: 255, g: 50, b: 50 }

    if (emailValid && !hasSource) {
      targetWidth = 60
      targetColor = { r: 255, g: 150, b: 50 }
    } else if (emailValid && hasSource) {
      targetWidth = 100
      targetColor = { r: 50, g: 255, b: 150 }
    }

    if (targetWidth === 100 && width !== 100) {
      setWidth(100)
      setColor(targetColor)
    } else if (targetWidth !== width) {
      setWidth(targetWidth)
      setColor(targetColor)
    }
  }, [emailValid, hasSource, width])

  const breathWave = Math.sin(breathPhase) * 0.5 + 0.5
  const glowIntensity = 6 + breathWave * 3

  const barStyle = {
    width: `${width}%`,
    background: `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`,
    boxShadow: `0 0 ${glowIntensity}px rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`,
    transition: width === 100 ? 'width 0ms, background 400ms, box-shadow 1000ms' : 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || width < 100}
      className="w-full h-12 border border-white/10 rounded-md relative overflow-hidden bg-panel/40 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed"
    >
      <div 
        className="absolute left-0 top-0 h-full"
        style={barStyle}
      />
    </button>
  )
}
