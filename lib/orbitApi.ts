export interface OrbitTerm {
  id: string
  nameEN: string
  displayName: string
  pdfUrl: string
  pdfTitle: string
}

export async function fetchOrbitStructure(language: string): Promise<OrbitTerm[]> {
  try {
    const response = await fetch(
      `https://audit.syntx-system.com/structure?language=${language}`
    )
    
    if (!response.ok) throw new Error('Structure fetch failed')
    
    const data = await response.json()
    
    // Extract categories with exactly 1 active PDF
    const terms: OrbitTerm[] = []
    
    data.forEach((superCat: any) => {
      superCat.categories.forEach((cat: any) => {
        // /structure already filters to active PDFs only
        // Only include categories that have at least 1 PDF
        if (cat.pdfs && cat.pdfs.length >= 1) {
          // Take first PDF (should be the active one)
          terms.push({
            id: cat.id,
            nameEN: cat.name,
            displayName: cat.name,
            pdfUrl: cat.pdfs[0].file_url,
            pdfTitle: cat.pdfs[0].title
          })
        }
      })
    })
    
    return terms
  } catch (error) {
    console.error('Orbit structure fetch failed:', error)
    return []
  }
}