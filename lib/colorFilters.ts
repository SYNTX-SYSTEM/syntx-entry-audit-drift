// Color overlay values for logo state
export const LogoColors = {
  white: 'rgba(255, 255, 255, 0)',
  red: 'rgba(255, 50, 50, 0.7)',
  green: 'rgba(50, 255, 150, 0.7)'
} as const

export type LogoState = 'white' | 'red' | 'green'

export function getLogoColor(state: LogoState): string {
  return LogoColors[state]
}

export function determineLogoState(
  email: string,
  emailValid: boolean,
  hasSource: boolean
): LogoState {
  if (!email.trim()) return 'white'
  if (!emailValid) return 'red'
  if (hasSource) return 'green'
  return 'white'
}
