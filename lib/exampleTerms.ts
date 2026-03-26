export const EXAMPLE_TERMS = {
  EN: {
    "Business Model": "/examples/business-model.pdf",
    "Website": "/examples/website.pdf",
    "Prompt System": "/examples/prompt-system.pdf",
    "Landing Page": "/examples/website.pdf",
    "SaaS": "/examples/business-model.pdf",
    "Agent Architecture": "/examples/prompt-system.pdf",
    "API Design": "/examples/website.pdf",
    "Brand Identity": "/examples/business-model.pdf",
    "Messaging System": "/examples/prompt-system.pdf",
    "Product Strategy": "/examples/business-model.pdf"
  },
  DE: {
    "Geschäftsmodell": "/examples/business-model.pdf",
    "Webseite": "/examples/website.pdf",
    "Prompt-System": "/examples/prompt-system.pdf",
    "Landingpage": "/examples/website.pdf",
    "SaaS": "/examples/business-model.pdf",
    "Agent-Architektur": "/examples/prompt-system.pdf",
    "API-Design": "/examples/website.pdf",
    "Markenidentität": "/examples/business-model.pdf",
    "Messaging-System": "/examples/prompt-system.pdf",
    "Produktstrategie": "/examples/business-model.pdf"
  }
} as const

export type LanguageCode = keyof typeof EXAMPLE_TERMS

export function isExampleTerm(text: string, lang: LanguageCode): boolean {
  return text in EXAMPLE_TERMS[lang]
}

export function getExamplePDF(text: string, lang: LanguageCode): string | null {
  return EXAMPLE_TERMS[lang][text as keyof typeof EXAMPLE_TERMS[typeof lang]] || null
}
