"use client"
import { useState, useEffect } from "react"
import { submitEntry } from "@/lib/api"
import { perturb, singularity, onAttractorChange } from "@/lib/attractorSystem"
import { isValidEmail, hasValidSource } from "@/lib/validation"
import { determineLogoState } from "@/lib/colorFilters"
import { LANGUAGES } from "@/lib/languages"

export default function EntryKernel() {
  const [email, setEmail] = useState("")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState("EN")
  const [loading, setLoading] = useState(false)
  const [breathIntensity, setBreathIntensity] = useState(0.4)
  const [breathPhase, setBreathPhase] = useState(0)
  const [logoState, setLogoState] = useState<'white' | 'red' | 'green'>('white')

  useEffect(() => {
    let st: any
    onAttractorChange((s) => { st = s })
    const iv = setInterval(() => {
      if (!st) return
      setBreathIntensity(0.4 + st.energy * 0.5)
      setBreathPhase(prev => prev + (0.0006 + st.energy * 0.001))
    }, 50)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const v = Number(localStorage.getItem("syntx_visits") || 0)
    localStorage.setItem("syntx_visits", String(v + 1))
  }, [])

  useEffect(() => {
    const emailValid = isValidEmail(email)
    const hasSource = hasValidSource(url, file)
    const newState = determineLogoState(email, emailValid, hasSource)
    setLogoState(newState)
    
    window.dispatchEvent(new CustomEvent('logoStateChange', { 
      detail: { state: newState } 
    }))
  }, [email, url, file])

  async function handleSubmit() {
    if (!email) return
    if (!url && !file) {
      perturb(0.3)
      return
    }

    setLoading(true)
    singularity()

    const fd = new FormData()
    fd.append("email", email)
    fd.append("language", language)
    if (file) fd.append("file", file)
    else if (url) fd.append("url", url)

    try {
      await submitEntry(fd)
      setEmail("")
      setUrl("")
      setFile(null)
    } catch {
      setLoading(false)
    } finally {
      setTimeout(() => {
        perturb(-0.8)
        setLoading(false)
      }, 600)
    }
  }

  const breathWave = Math.sin(breathPhase) * 0.5 + 0.5
  const glowSize = 55 + breathWave * 30 + Math.min(breathIntensity * 45, 55)
  const glowOpacity = 0.22 + Math.min(breathIntensity * 0.35, 0.4) + breathWave * 0.14
  
  const bgGlowOpacity = 0.14 + Math.min(breathIntensity * 0.2, 0.25) + breathWave * 0.12

  const containerGlowStyle = {
    boxShadow: `0 0 ${glowSize}px rgba(0, 217, 255, ${glowOpacity})`,
    transition: 'box-shadow 1500ms ease-out'
  }

  const backgroundGlowStyle = {
    background: `radial-gradient(ellipse at center, rgba(0, 217, 255, ${bgGlowOpacity}) 0%, transparent 70%)`,
    transition: 'background 1500ms ease-out'
  }

  const fieldGradientOpacity = 0.3 + breathIntensity * 0.4
  const fieldGlowSize = 8 + breathWave * 4 + breathIntensity * 8

  const inputStyle = {
    background: `linear-gradient(135deg, 
      rgba(17, 24, 39, 0.7) 0%, 
      rgba(17, 24, 39, 0.5) 100%)`,
    backdropFilter: 'blur(12px)',
    borderImage: `linear-gradient(135deg, 
      rgba(0, 217, 255, ${fieldGradientOpacity * 0.4}), 
      rgba(0, 217, 255, ${fieldGradientOpacity * 0.1}), 
      rgba(0, 217, 255, ${fieldGradientOpacity * 0.4})) 1`,
    boxShadow: `
      0 0 ${fieldGlowSize}px rgba(0, 217, 255, ${glowOpacity * 0.3}),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 217, 255, 0.1)
    `,
    transition: 'all 1200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }

  const buttonStyle = {
    background: `linear-gradient(135deg, 
      rgba(0, 217, 255, 0.15) 0%, 
      rgba(0, 217, 255, 0.05) 100%)`,
    backdropFilter: 'blur(12px)',
    borderImage: `linear-gradient(135deg, 
      rgba(0, 217, 255, ${fieldGradientOpacity * 0.6}), 
      rgba(0, 217, 255, ${fieldGradientOpacity * 0.3}), 
      rgba(0, 217, 255, ${fieldGradientOpacity * 0.6})) 1`,
    boxShadow: `
      0 0 ${fieldGlowSize * 1.5}px rgba(0, 217, 255, ${glowOpacity * 0.5}),
      inset 0 1px 0 rgba(0, 217, 255, 0.3),
      inset 0 -1px 0 rgba(0, 217, 255, 0.2)
    `,
    transition: 'all 1200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }

  return (
    <div 
      className="w-full max-w-[520px] relative z-10 p-6 rounded-lg"
      style={containerGlowStyle}
    >
      <div 
        className="absolute inset-0 rounded-lg -z-10"
        style={backgroundGlowStyle}
      />
      <div className="space-y-3 relative z-10">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            perturb(0.05 * e.target.value.length)
          }}
          onFocus={() => perturb(0.3)}
          onBlur={() => perturb(-0.02)}
          style={inputStyle}
          className="w-full h-11 border border-transparent rounded-md px-4 text-sm text-textPrimary placeholder:text-muted/50 outline-none"
        />
        <input
          type="text"
          placeholder="paste url or drop pdf"
          value={url}
          onChange={e => {
            setUrl(e.target.value)
            if (file) setFile(null)
          }}
          onFocus={() => perturb(0.1)}
          onBlur={() => perturb(-0.02)}
          style={inputStyle}
          className="w-full h-11 border border-transparent rounded-md px-4 text-sm text-textPrimary placeholder:text-muted/50 outline-none"
        />
        <select
          value={language}
          onChange={e => {
            setLanguage(e.target.value)
            perturb(0.1)
          }}
          style={{
            ...inputStyle,
            letterSpacing: '0.15em'
          }}
          className="w-full h-14 border border-transparent rounded-md px-4 py-3 text-base text-textPrimary outline-none cursor-pointer font-light"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-panel py-2">
              {lang.flag}    {lang.native}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={buttonStyle}
          className="w-full h-12 border border-transparent rounded-md px-4 text-sm font-medium text-textPrimary hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer uppercase tracking-wider"
        >
          {loading ? "→ Entering system..." : "→ Analyze"}
        </button>
      </div>
    </div>
  )
}
