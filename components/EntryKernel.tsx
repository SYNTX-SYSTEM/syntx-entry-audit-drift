"use client"
import { useState, useEffect, useRef } from "react"
import { submitEntry } from "@/lib/api"
import { perturb, singularity, onAttractorChange, modulate } from "@/lib/attractorSystem"
import { isValidEmail, hasValidSource } from "@/lib/validation"
import { determineLogoState } from "@/lib/colorFilters"
import { LANGUAGES } from "@/lib/languages"

import EmailInput from "./EmailInput"
import LanguageSelect from "./LanguageSelect"
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
  
  // Activation micro-interaction (VISUAL only, not business state)
  const [activationPhase, setActivationPhase] = useState<"none" | "contract" | "release">("none")
  
  // Seal phase - Abschluss-Symbol (VISUAL only)
  const [sealPhase, setSealPhase] = useState<"none" | "closing">("none")
  const [showSupernova, setShowSupernova] = useState(false)

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
    if (typeof window === 'undefined') return
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

  // Kernel activation - Energie-Transfer Sequenz
  const handleKernelActivation = async () => {
    if (kernelState !== "ready") return

    // 1. CONTRACT - Energie wird eingezogen
    setActivationPhase("contract")
    modulate({ energy: 0.45 })
    perturb(0.3)

    setTimeout(() => {
      // 2. RELEASE - Peak Moment + SUPERNOVA
      setActivationPhase("release")
      setShowSupernova(true)
      singularity()
      
      // Supernova fade out nach 800ms
      setTimeout(() => setShowSupernova(false), 800)
      
      setTimeout(() => {
        // 3. PROCESSING - System arbeitet
        setKernelState("processing")
        setActivationPhase("none")
        
        // Energie bleibt 2s erhöht, dann weich runter
        setTimeout(() => modulate({ energy: -0.25 }), 2000)
      }, 180)
    }, 120)

    // 4. Backend call (nach visual feedback!)
    const fd = new FormData()
    fd.append("email", email)
    fd.append("language", language)
    fd.append("url", url || "https://syntx-system.com")
    if (file) {
      fd.append("file", file)
    }
    try {
      await submitEntry(fd)
      
      // Seal - Abschluss-Symbol (600ms)
      setKernelState("complete")
      setSealPhase("closing")
      
      setTimeout(() => {
        setSealPhase("none")
      }, 600)

      // Post-Send Ruhe (1.2s), dann Reset
      setTimeout(() => {
        setEmail("")
        setUrl("")
        setFile(null)
        setUploadState("idle")
        setUploadedFileName(null)
        
        setKernelState("idle")
        
        modulate({ energy: -0.2 })
      }, 1800)

    } catch (err) {
      console.error("Analysis failed:", err)
      setKernelState("idle")
      modulate({ energy: -0.3 })
    }
  }

  const breathWave = Math.sin(breathPhase) * 0.5 + 0.5
  const glowSize = 55 + breathWave * 30 + Math.min(breathIntensity * 45, 55)
  const glowOpacity = 0.22 + Math.min(breathIntensity * 0.35, 0.4) + breathWave * 0.14
  
  const bgGlowOpacity = 0.12 + Math.min(breathIntensity * 0.17, 0.21) + breathWave * 0.10

  const isInteractive = kernelState === "ready"

  const containerGlowStyle = {
    boxShadow: kernelState === "processing"
      ? `0 0 42px rgba(0, 217, 255, 0.14)`
      : kernelState === "ready"
      ? `0 0 42px rgba(0, 217, 255, 0.14)`
      : `0 0 42px rgba(0, 217, 255, 0.14)`,
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
    opacity: 0.85,
    transition: 'all 220ms ease'
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
      
      {/* SUPERNOVA - Explosion beim Click */}
      {showSupernova && (
        <div 
          className="absolute inset-0 rounded-lg -z-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(0, 217, 255, 0.4) 0%, rgba(0, 217, 255, 0.2) 30%, transparent 70%)",
            animation: "supernova 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}
        />
      )}
      
      <div className="relative z-10 flex flex-col justify-center min-h-[500px]" suppressHydrationWarning>
        <div className="mb-8">
        <EmailInput
          value={email}
          onChange={(val) => {
            setEmail(val)
            perturb(0.05 * val.length)
          }}
          onFocus={() => perturb(0.3)}
          onBlur={() => perturb(-0.02)}
          style={inputStyle}
          className="w-full h-11 border border-transparent rounded-md px-4 text-sm text-textPrimary placeholder:text-muted/50 placeholder:tracking-[0.3em] outline-none focus:opacity-100"
        />
        </div>

        <div className="mb-5">
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
          style={inputStyle}
          className="w-full h-11 border border-transparent rounded-md px-4 text-sm text-textPrimary placeholder:text-muted/50 placeholder:tracking-[0.3em] outline-none focus:opacity-100"
        />
        </div>

        <LanguageSelect
          value={language}
          onChange={setLanguage}
          onPerturb={perturb}
        />
        <div className="mb-6">
        {/* CORE ACTIVATION RING - SYMBIOTISCH */}
        <div
          onClick={kernelState === "ready" ? handleKernelActivation : undefined}
          className="relative mt-4 mb-2 h-12 rounded-full transition-all duration-700"
          style={{
            cursor: kernelState === "ready" ? "pointer" : "default",
            background:
              !isValidEmail(email)
                ? "rgba(255, 50, 50, 0.03)"
                : kernelState === "ready"
                ? "rgba(0, 217, 255, 0.04)"
                : kernelState === "processing"
                ? "rgba(0, 217, 255, 0.08)"
                : "rgba(0, 217, 255, 0.015)",
            border: !isValidEmail(email)
              ? "2px solid rgba(255, 50, 50, 0.3)"
              : kernelState === "ready"
              ? "2px solid rgba(0, 217, 255, 0.4)"
              : "1px solid rgba(0, 217, 255, 0.15)",
            boxShadow:
              !isValidEmail(email)
                ? "0 0 25px rgba(255, 50, 50, 0.2), inset 0 0 15px rgba(255, 50, 50, 0.1)"
                : kernelState === "ready"
                ? "0 0 35px rgba(0, 217, 255, 0.3), inset 0 0 20px rgba(0, 217, 255, 0.15)"
                : kernelState === "processing"
                ? "0 0 50px rgba(0, 217, 255, 0.4) inset"
                : "0 0 12px rgba(0, 217, 255, 0.08)",
            transform: kernelState === "ready" ? "scale(1.02)" : "scale(1)",
            animation: !isValidEmail(email)
              ? "pulse 2s ease-in-out infinite"
              : kernelState === "processing"
              ? "pulse 3s ease-in-out infinite"
              : "none"
          }}
        />
        </div>

        <div
          className="relative mt-4 rounded-2xl border border-cyan-400/[0.16] bg-[rgba(0,20,30,0.55)] backdrop-blur-md transition-all duration-500 overflow-hidden cursor-pointer"
          style={{
            boxShadow: dragging
              ? "0 0 48px rgba(0,240,255,0.20)"
              : uploadState === "uploaded"
              ? "0 0 32px rgba(0,240,255,0.12)"
              : "0 0 24px rgba(0,240,255,0.06)",
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
              <span className="text-cyan-300/[0.78]">Release to Inject into Core</span>
            ) : uploadState === "uploading" ? (
              <span className="text-cyan-300/[0.78]">Injecting into Core...</span>
            ) : uploadState === "uploaded" ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-cyan-400/[0.78] tracking-wider font-light">
                  {uploadedFileName}
                </span>
                <span className="text-cyan-300/60 text-xs tracking-widest">
                  Integrated into Core
                </span>
              </div>
            ) : (
              <span className="text-cyan-300/[0.78]">Drop PDF or Click to Inject</span>
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
