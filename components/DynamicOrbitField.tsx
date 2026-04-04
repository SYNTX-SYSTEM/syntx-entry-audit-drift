"use client"
import { useState, useEffect } from "react"
import { fetchOrbitStructure, OrbitTerm } from "@/lib/orbitApi"
import { translateCategory } from "@/lib/categoryTranslations"

interface DynamicOrbitFieldProps {
  language: string
  onTermsReady: (terms: OrbitTerm[]) => void
}

export default function DynamicOrbitField({ language, onTermsReady }: DynamicOrbitFieldProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadStructure() {
      setLoading(true)
      
      try {
        const terms = await fetchOrbitStructure(language)
        
        if (terms.length === 0) {
          setError(true)
          onTermsReady([])
          return
        }
        
        // Translate display names
        const translatedTerms = terms.map(term => ({
          ...term,
          displayName: translateCategory(term.nameEN, language)
        }))
        
        // Shuffle and take random 10 (or less if fewer available)
        const shuffled = translatedTerms.sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, Math.min(10, shuffled.length))
        
        // Send to parent
        onTermsReady(selected)
        setError(false)
      } catch (err) {
        console.error("Failed to load orbit structure:", err)
        setError(true)
        onTermsReady([])
      } finally {
        setLoading(false)
      }
    }
    
    loadStructure()
  }, [language, onTermsReady])

  // This component is now headless - no UI
  return null
}