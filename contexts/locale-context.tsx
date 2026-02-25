"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"

export type Locale = "es" | "en"

const STORAGE_KEY = "muxu-locale"

type Messages = Record<string, unknown>

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  messages: Messages
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

function getNested(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    text,
  )
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")
  const [messages, setMessages] = useState<Messages>({})

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored === "es" || stored === "en") setLocaleState(stored)
  }, [])

  useEffect(() => {
    import(`@/messages/${locale}.json`)
      .then((m) => setMessages(m.default as Messages))
      .catch(() => setMessages({}))
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = getNested(messages as Record<string, unknown>, key)
      if (typeof value === "string") return interpolate(value, params)
      return key
    },
    [messages],
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (ctx === undefined) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}

export function useTranslation() {
  const { t, locale } = useLocale()
  return { t, locale }
}

/** Translate product field; falls back to product field if translation key is missing */
export function getTranslatedProductField(
  t: (key: string) => string,
  productId: string,
  field: "name" | "description" | "tagline" | "fullDescription",
  fallback: string,
): string {
  const value = t(`products.${productId}.${field}`)
  return value.startsWith("products.") ? fallback : value
}
