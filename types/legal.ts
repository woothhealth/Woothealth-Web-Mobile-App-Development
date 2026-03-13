export interface LegalSection {
  id: number
  title: string
  content: string | string[]
}

export interface LegalDocument {
  title: string
  effectiveDate: string
  introduction: string
  sections: LegalSection[]
}