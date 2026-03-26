export const EXAMPLE_TERMS = {
  EN: {
    // Academic
    "Master's Thesis": "/examples/business-model.pdf",
    "Bachelor's Thesis": "/examples/business-model.pdf",
    "Dissertation": "/examples/business-model.pdf",
    "Habilitation": "/examples/business-model.pdf",
    "Research Proposal": "/examples/business-model.pdf",
    "Paper": "/examples/business-model.pdf",
    "Essay": "/examples/business-model.pdf",
    "Manuscript": "/examples/business-model.pdf",
    "Whitepaper": "/examples/business-model.pdf",
    "Literature Review": "/examples/business-model.pdf",
    "Exposé": "/examples/business-model.pdf",
    // Digital
    "Website": "/examples/business-model.pdf",
    "Landing Page": "/examples/business-model.pdf",
    "SaaS": "/examples/business-model.pdf",
    "UX Flow": "/examples/business-model.pdf",
    "User Journey": "/examples/business-model.pdf",
    "Navigation System": "/examples/business-model.pdf",
    "Information Architecture": "/examples/business-model.pdf",
    "Content Structure": "/examples/business-model.pdf",
    "Conversion Flow": "/examples/business-model.pdf",
    "Product Page": "/examples/business-model.pdf",
    // AI
    "Prompt": "/examples/business-model.pdf",
    "Prompt System": "/examples/business-model.pdf",
    "Prompt Chain": "/examples/business-model.pdf",
    "Agent Architecture": "/examples/business-model.pdf",
    "Tool Workflow": "/examples/business-model.pdf",
    "LLM Workflow": "/examples/business-model.pdf",
    "System Prompt": "/examples/business-model.pdf",
    "Automation Logic": "/examples/business-model.pdf",
    // Tech
    "Codebase": "/examples/business-model.pdf",
    "API Design": "/examples/business-model.pdf",
    "Backend Flow": "/examples/business-model.pdf",
    "Data Model": "/examples/business-model.pdf",
    "State Machine": "/examples/business-model.pdf",
    "Architecture": "/examples/business-model.pdf",
    "Repository Structure": "/examples/business-model.pdf",
    "Software System": "/examples/business-model.pdf",
    // Brand
    "Brand Identity": "/examples/business-model.pdf",
    "Naming": "/examples/business-model.pdf",
    "Claim": "/examples/business-model.pdf",
    "Positioning": "/examples/business-model.pdf",
    "Narrative Structure": "/examples/business-model.pdf",
    "Messaging System": "/examples/business-model.pdf",
    "Communication Strategy": "/examples/business-model.pdf",
    "Storyline": "/examples/business-model.pdf",
    // Strategy
    "Business Model": "/examples/business-model.pdf",
    "Offer Architecture": "/examples/business-model.pdf",
    "Decision Tree": "/examples/business-model.pdf",
    "Rule System": "/examples/business-model.pdf",
    "Organization Structure": "/examples/business-model.pdf",
    "Process Logic": "/examples/business-model.pdf",
    "Product Strategy": "/examples/business-model.pdf",
    "Overall Strategy": "/examples/business-model.pdf"
  },
  DE: {
    // Academic
    "Masterarbeit": "/examples/business-model.pdf",
    "Bachelorarbeit": "/examples/business-model.pdf",
    "Dissertation": "/examples/business-model.pdf",
    "Habilitation": "/examples/business-model.pdf",
    "Forschungsantrag": "/examples/business-model.pdf",
    "Paper": "/examples/business-model.pdf",
    "Essay": "/examples/business-model.pdf",
    "Manuskript": "/examples/business-model.pdf",
    "Whitepaper": "/examples/business-model.pdf",
    "Literaturreview": "/examples/business-model.pdf",
    "Exposé": "/examples/business-model.pdf",
    // Digital
    "Webseite": "/examples/business-model.pdf",
    "Landingpage": "/examples/business-model.pdf",
    "SaaS": "/examples/business-model.pdf",
    "UX-Flow": "/examples/business-model.pdf",
    "User Journey": "/examples/business-model.pdf",
    "Navigationssystem": "/examples/business-model.pdf",
    "Informationsarchitektur": "/examples/business-model.pdf",
    "Content-Struktur": "/examples/business-model.pdf",
    "Conversion-Flow": "/examples/business-model.pdf",
    "Produktseite": "/examples/business-model.pdf",
    // AI
    "Prompt": "/examples/business-model.pdf",
    "Prompt-System": "/examples/business-model.pdf",
    "Prompt Chain": "/examples/business-model.pdf",
    "Agent-Architektur": "/examples/business-model.pdf",
    "Tool-Workflow": "/examples/business-model.pdf",
    "LLM-Workflow": "/examples/business-model.pdf",
    "System-Prompt": "/examples/business-model.pdf",
    "Automations-Logik": "/examples/business-model.pdf",
    // Tech
    "Codebasis": "/examples/business-model.pdf",
    "API-Design": "/examples/business-model.pdf",
    "Backend-Flow": "/examples/business-model.pdf",
    "Datenmodell": "/examples/business-model.pdf",
    "State Machine": "/examples/business-model.pdf",
    "Architektur": "/examples/business-model.pdf",
    "Repository-Struktur": "/examples/business-model.pdf",
    "Software-System": "/examples/business-model.pdf",
    // Brand
    "Markenidentität": "/examples/business-model.pdf",
    "Naming": "/examples/business-model.pdf",
    "Claim": "/examples/business-model.pdf",
    "Positionierung": "/examples/business-model.pdf",
    "Narrative Struktur": "/examples/business-model.pdf",
    "Messaging-System": "/examples/business-model.pdf",
    "Kommunikationsstrategie": "/examples/business-model.pdf",
    "Storyline": "/examples/business-model.pdf",
    // Strategy
    "Geschäftsmodell": "/examples/business-model.pdf",
    "Angebotsarchitektur": "/examples/business-model.pdf",
    "Entscheidungsbaum": "/examples/business-model.pdf",
    "Regelwerk": "/examples/business-model.pdf",
    "Organisationsstruktur": "/examples/business-model.pdf",
    "Prozesslogik": "/examples/business-model.pdf",
    "Produktstrategie": "/examples/business-model.pdf",
    "Gesamtstrategie": "/examples/business-model.pdf"
  }
} as const

export type LanguageCode = keyof typeof EXAMPLE_TERMS

export function isExampleTerm(text: string, lang: LanguageCode): boolean {
  return text in EXAMPLE_TERMS[lang]
}

export function getExamplePDF(text: string, lang: LanguageCode): string | null {
  return EXAMPLE_TERMS[lang][text as keyof typeof EXAMPLE_TERMS[typeof lang]] || null
}
