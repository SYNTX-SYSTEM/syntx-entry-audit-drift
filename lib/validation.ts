export function isValidEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function hasValidSource(url: string, file: File | null): boolean {
  return !!(url.trim() || file)
}
