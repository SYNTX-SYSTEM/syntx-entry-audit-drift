// Top 10 most spoken languages with native names and flags
export const LANGUAGES = [
  { code: 'EN', flag: '🇬🇧', native: 'English' },
  { code: 'ZH', flag: '🇨🇳', native: '中文' },
  { code: 'ES', flag: '🇪🇸', native: 'Español' },
  { code: 'HI', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'AR', flag: '🇸🇦', native: 'العربية' },
  { code: 'PT', flag: '🇵🇹', native: 'Português' },
  { code: 'BN', flag: '🇧🇩', native: 'বাংলা' },
  { code: 'RU', flag: '🇷🇺', native: 'Русский' },
  { code: 'JA', flag: '🇯🇵', native: '日本語' },
  { code: 'DE', flag: '🇩🇪', native: 'Deutsch' },
] as const

export type LanguageCode = typeof LANGUAGES[number]['code']
