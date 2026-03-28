"use client"
import { useState, useEffect, useRef } from "react"
import { submitEntry } from "@/lib/api"
import { perturb, singularity, onAttractorChange, modulate } from "@/lib/attractorSystem"
import { isValidEmail, hasValidSource } from "@/lib/validation"
import { determineLogoState } from "@/lib/colorFilters"
import { LANGUAGES } from "@/lib/languages"

export default function EntryKernel() {
  const [email, setEmail] = useState("")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState("EN")
  const [breathIntensity, setBreathIntensity] = useState(0.4)
  const [breathPhase, setBreathPhase] = useState(0)
  const [logoState, setLogoState] = useState<'white' | 'red' | 'green'>('white')

  // Kernel as analysis center - single source of truth
  const [kernelState, setKernelState] = useState<"idle" | "ready" | "processing" | "complete">("idle")

  // Upload states - visual only, no backend
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded">("idle")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { language }
    }))
  }, [language])

  // Set kernel ready when valid input exists
  useEffect(() => {
    const emailValid = isValidEmail(email)
    const hasSource = hasValidSource(url, file)
    
    if (emailValid && hasSource && kernelState === "idle") {
      setKernelState("ready")
    } else if ((!emailValid || !hasSource) && kernelState === "ready") {
      setKernelState("idle")
    }
  }, [email, url, file, kernelState])

  // Visual upload only - NO backend call
  const handleUpload = (file: File) => {
    setUploadState("uploading")
    perturb(0.15)

    setTimeout(() => {
      setFile(file)
      setUploadedFileName(file.name)
      setUploadState("uploaded")
      
      modulate({ energy: 0.12 })
      setTimeout(() => modulate({ energy: -0.08 }), 600)
    }, 300)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    handleUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
    perturb(0.1)
  }

  const handleDragLeave = () => {
    setDragging(false)
    perturb(-0.05)
  }

  // Kernel activation - system reacts THEN backend
  const handleKernelActivation = async () => {
    if (kernelState !== "ready") return

    // 1. System reacts FIRST
    modulate({ energy: 0.4 })
    perturb(0.3)
    singularity()

    setKernelState("processing")

    // 2. Backend call
    const fd = new FormData()
    fd.append("email", email)
    fd.append("language", language)
    if (file) fd.append("file", file)
    else if (url) fd.append("url", url)

    try {
      await submitEntry(fd)
      
      setKernelState("complete")

      // 3. Normalize system - data first, then state
      setTimeout(() => {
        setEmail("")
        setUrl("")
        setFile(null)
        setUploadState("idle")
        setUploadedFileName(null)
        
        setKernelState("idle")
        
        modulate({ energy: -0.2 })
      }, 2500)

    } catch (err) {
      console.error("Analysis failed:", err)
      setKernelState("idle")
      modulate({ energy: -0.3 })
    }
  }

  const breathWave = Math.sin(breathPhase) * 0.5 + 0.5
  const glowSize = 55 + breathWave * 30 + Math.min(breathIntensity * 45, 55)
  const glowOpacity = 0.22 + Math.min(breathIntensity * 0.35, 0.4) + breathWave * 0.14
  
  const bgGlowOpacity = 0.14 + Math.min(breathIntensity * 0.2, 0.25) + breathWave * 0.12

  const isInteractive = kernelState === "ready"

  const containerGlowStyle = {
    boxShadow: kernelState === "processing"
      ? `0 0 ${glowSize * 1.3}px rgba(0, 217, 255, ${glowOpacity * 1.2})`
      : kernelState === "ready"
      ? `0 0 ${glowSize * 1.05}px rgba(0, 217, 255, ${glowOpacity * 1.05})`
      : `0 0 ${glowSize}px rgba(0, 217, 255, ${glowOpacity})`,
    transition: kernelState === "processing"
      ? 'box-shadow 4500ms ease-in-out infinite'
      : 'box-shadow 1500ms ease-out',
    cursor: isInteractive ? "pointer" : "default"
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

  return (
    <div 
      id="kernel-root"
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
          placeholder="• • • @ • • • . • •"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            perturb(0.05 * e.target.value.length)
          }}
          onFocus={() => perturb(0.3)}
          onBlur={() => perturb(-0.02)}
          style={inputStyle}
          className="w-full h-11 border border-transparent rounded-md px-4 text-sm text-textPrimary placeholder:text-muted/30 placeholder:tracking-[0.3em] outline-none"
        />
        <input
          type="text"
          placeholder="// • • • • . • •"
          value={url}
          onChange={e => {
            setUrl(e.target.value)
            if (file) {
              setFile(null)
              setUploadState("idle")
              setUploadedFileName(null)
            }
          }}
          onFocus={() => perturb(0.1)}
          onBlur={() => perturb(-0.02)}
          disabled={uploadState === "uploaded"}
          style={{
            ...inputStyle,
            opacity: uploadState === "uploaded" ? 0.5 : 1
          }}
          className="w-full h-11 border border-transparent rounded-md px-4 text-sm text-textPrimary placeholder:text-muted/30 placeholder:tracking-[0.3em] outline-none"
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

        {/* CORE ACTIVATION RING */}
        <div
          onClick={kernelState === "ready" ? handleKernelActivation : undefined}
          className="relative mt-4 mb-2 h-12 rounded-full flex items-center justify-center text-xs tracking-[0.25em] font-light select-none transition-all duration-700"
          style={{
            cursor: kernelState === "ready" ? "pointer" : "default",
            background:
              kernelState === "ready"
                ? "rgba(0, 217, 255, 0.06)"
                : kernelState === "processing"
                ? "rgba(0, 217, 255, 0.1)"
                : "rgba(0, 217, 255, 0.02)",
            border: "1px solid rgba(0, 217, 255, 0.18)",
            boxShadow:
              kernelState === "ready"
                ? "0 0 30px rgba(0, 217, 255, 0.25)"
                : kernelState === "processing"
                ? "0 0 60px rgba(0, 217, 255, 0.35) inset"
                : "0 0 15px rgba(0, 217, 255, 0.1)",
            transform:
              kernelState === "ready"
                ? "scale(1.015)"
                : kernelState === "processing"
                ? "scale(1.01)"
                : "scale(1)"
          }}
        >
          {kernelState === "idle" && (
            <span className="text-cyan-400/20">CORE INACTIVE</span>
          )}
          {kernelState === "ready" && (
            <span className="text-cyan-400/70">INITIATE ANALYSIS</span>
          )}
          {kernelState === "processing" && (
            <span className="text-cyan-400/80 animate-pulse">SYSTEM PROCESSING</span>
          )}
          {kernelState === "complete" && (
            <span className="text-cyan-400/60">ANALYSIS COMPLETE</span>
          )}
        </div>

        <div
          className="relative mt-4 rounded-2xl border border-cyan-400/15 bg-[rgba(0,20,30,0.55)] backdrop-blur-md transition-all duration-500 overflow-hidden cursor-pointer"
          style={{
            boxShadow: dragging
              ? "0 0 60px rgba(0,240,255,0.25)"
              : uploadState === "uploaded"
              ? "0 0 40px rgba(0,240,255,0.15)"
              : "0 0 30px rgba(0,240,255,0.08)",
            transform: dragging ? "scale(1.02)" : "scale(1)"
          }}
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />

          <div className="py-6 text-center tracking-[0.08em] font-light text-sm transition-all duration-500">
            {dragging ? (
              <span className="text-cyan-300/70">Release to Inject into Core</span>
            ) : uploadState === "uploading" ? (
              <span className="text-cyan-300/70">Injecting into Core...</span>
            ) : uploadState === "uploaded" ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400 tracking-wider font-light">
                  {uploadedFileName}
                </span>
                <span className="text-cyan-300/60 text-xs tracking-widest">
                  Integrated into Core
                </span>
              </div>
            ) : (
              <span className="text-cyan-300/70">Drop PDF or Click to Inject</span>
            )}
          </div>
        </div>

        {kernelState === "ready" && (
          <div className="text-center text-[10px] text-cyan-400/40 tracking-[0.2em] mt-3 font-light">
            CORE READY
          </div>
        )}

        {kernelState === "processing" && (
          <div className="text-center text-[10px] text-cyan-400/60 tracking-[0.2em] mt-3 font-light animate-pulse">
            SYSTEM PROCESSING
          </div>
        )}
      </div>
    </div>
  )
}
