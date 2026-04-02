"use client"

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  style?: React.CSSProperties
  className?: string
}

export default function EmailInput({ 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  style, 
  className 
}: EmailInputProps) {
  return (
    <input
      suppressHydrationWarning
      type="email"
      name="email"
      autoComplete="email"
      placeholder="• • • @ • • • . • •"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      style={style}
      className={className}
    />
  )
}
