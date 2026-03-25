export const OFFER_TERMS = {
  EN: {
    academic: [
      "Master's Thesis",
      "Bachelor's Thesis",
      "Dissertation",
      "Habilitation",
      "Research Proposal",
      "Paper",
      "Essay",
      "Manuscript",
      "Whitepaper",
      "Literature Review",
      "Exposé"
    ],
    digital: [
      "Website",
      "Landing Page",
      "SaaS",
      "UX Flow",
      "User Journey",
      "Navigation System",
      "Information Architecture",
      "Content Structure",
      "Conversion Flow",
      "Product Page"
    ],
    ai: [
      "Prompt",
      "Prompt System",
      "Prompt Chain",
      "Agent Architecture",
      "Tool Workflow",
      "LLM Workflow",
      "System Prompt",
      "Automation Logic"
    ],
    tech: [
      "Codebase",
      "API Design",
      "Backend Flow",
      "Data Model",
      "State Machine",
      "Architecture",
      "Repository Structure",
      "Software System"
    ],
    brand: [
      "Brand Identity",
      "Naming",
      "Claim",
      "Positioning",
      "Narrative Structure",
      "Messaging System",
      "Communication Strategy",
      "Storyline"
    ],
    strategy: [
      "Business Model",
      "Offer Architecture",
      "Decision Tree",
      "Rule System",
      "Organization Structure",
      "Process Logic",
      "Product Strategy",
      "Overall Strategy"
    ]
  },

  DE: {
    academic: [
      "Masterarbeit",
      "Bachelorarbeit",
      "Dissertation",
      "Habilitation",
      "Forschungsantrag",
      "Paper",
      "Essay",
      "Manuskript",
      "Whitepaper",
      "Literaturreview",
      "Exposé"
    ],
    digital: [
      "Webseite",
      "Landingpage",
      "SaaS",
      "UX-Flow",
      "User Journey",
      "Navigationssystem",
      "Informationsarchitektur",
      "Content-Struktur",
      "Conversion-Flow",
      "Produktseite"
    ],
    ai: [
      "Prompt",
      "Prompt-System",
      "Prompt Chain",
      "Agent-Architektur",
      "Tool-Workflow",
      "LLM-Workflow",
      "System-Prompt",
      "Automations-Logik"
    ],
    tech: [
      "Codebasis",
      "API-Design",
      "Backend-Flow",
      "Datenmodell",
      "State Machine",
      "Architektur",
      "Repository-Struktur",
      "Software-System"
    ],
    brand: [
      "Markenidentität",
      "Naming",
      "Claim",
      "Positionierung",
      "Narrative Struktur",
      "Messaging-System",
      "Kommunikationsstrategie",
      "Storyline"
    ],
    strategy: [
      "Geschäftsmodell",
      "Angebotsarchitektur",
      "Entscheidungsbaum",
      "Regelwerk",
      "Organisationsstruktur",
      "Prozesslogik",
      "Produktstrategie",
      "Gesamtstrategie"
    ]
  }
} as const

export type LanguageCode = keyof typeof OFFER_TERMS
export type CategoryKey = keyof typeof OFFER_TERMS['EN']

export function getAllTerms(lang: LanguageCode): string[] {
  const categories = OFFER_TERMS[lang]
  return Object.values(categories).flat()
}

export function getRandomTerm(lang: LanguageCode): string {
  const allTerms = getAllTerms(lang)
  return allTerms[Math.floor(Math.random() * allTerms.length)]
}
