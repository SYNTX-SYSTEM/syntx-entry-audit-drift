"use client"

interface FooterProps {
  onImpressumClick: () => void
}

export default function Footer({ onImpressumClick }: FooterProps) {
  return (
    <div className="absolute bottom-6 text-xs opacity-40 space-x-6">
      <button 
        onClick={onImpressumClick}
        className="hover:opacity-70 hover:text-accent transition-all duration-300"
      >
        Impressum
      </button>
    </div>
  )
}
