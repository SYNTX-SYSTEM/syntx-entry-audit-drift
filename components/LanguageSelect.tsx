"use client"
import { LANGUAGES } from "@/lib/languages"

interface LanguageSelectProps {
  value: string
  onChange: (value: string) => void
  onPerturb: (amount: number) => void
}

export default function LanguageSelect({ value, onChange, onPerturb }: LanguageSelectProps) {
  const selectStyle = {
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(17, 24, 39, 0.5) 100%)',
    // NO backdropFilter - causes Firefox issues!
    border: '1px solid rgba(0, 217, 255, 0.2)',
    boxShadow: '0 0 12px rgba(0, 217, 255, 0.15)',
    letterSpacing: '0.15em',
    transition: 'all 300ms ease'
  }

  return (
    <select
      value={value}
      onChange={e => {
        onChange(e.target.value)
        onPerturb(0.1)
      }}
      style={selectStyle}
      className="w-full h-14 rounded-md px-4 py-3 text-base text-textPrimary outline-none cursor-pointer font-light"
    >
      {LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code} className="bg-panel py-2">
          {lang.flag}    {lang.native}
        </option>
      ))}
    </select>
  )
}
