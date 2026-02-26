/**
 * PDF paths for legal documents. Spanish versions use _ES suffix.
 * Add these files to public/: Muxu_Terms_of_Use_ES.pdf, Muxu_Privacy_Policy_ES.pdf, Muxu_Cookie_Policy_ES.pdf
 */
export type LegalDoc = "terms" | "privacy" | "cookies"

const PATHS: Record<LegalDoc, { en: string; es: string }> = {
  terms: { en: "/Muxu_Terms_of_Use.pdf", es: "/Muxu_Terms_of_Use_ES.pdf" },
  privacy: { en: "/Muxu_Privacy_Policy.pdf", es: "/Muxu_Privacy_Policy_ES.pdf" },
  cookies: { en: "/Muxu_Cookie_Policy.pdf", es: "/Muxu_Cookie_Policy_ES.pdf" },
}

export function getLegalPdfUrl(doc: LegalDoc, locale: string): string {
  return PATHS[doc][locale === "es" ? "es" : "en"]
}
