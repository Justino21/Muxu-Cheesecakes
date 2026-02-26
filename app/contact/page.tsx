"use client"

import { useState, useEffect, useRef } from "react"
import HeaderWithLogo from "@/components/header-with-logo"
import { CinematicFooter } from "@/components/cinematic-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { useLocale } from "@/contexts/locale-context"
import { useLenis } from "@/components/lenis-provider"
import Link from "next/link"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"

const COUNTRY_CODES = [
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
]

interface FormErrors {
  name?: string
  surname?: string
  email?: string
  terms?: string
  captcha?: string
}

export default function ContactPage() {
  const { t, locale } = useLocale()
  const lenis = useLenis()
  const [countryCode, setCountryCode] = useState("+34")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  useEffect(() => {
    if (lenis) {
      lenis.start()
    }
  }, [lenis])
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    message: "",
    terms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode)

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("contact.requiredField")
    }
    if (!formData.surname.trim()) {
      newErrors.surname = t("contact.requiredField")
    }
    if (!formData.email.trim()) {
      newErrors.email = t("contact.requiredField")
    }
    if (!formData.terms) {
      newErrors.terms = t("contact.acceptTerms")
    }
    if (!turnstileToken) {
      newErrors.captcha = t("contact.captchaRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          countryCode: countryCode,
          message: formData.message,
          turnstileToken: turnstileToken,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      
      setSubmitted(true)
      setFormData({
        name: "",
        surname: "",
        email: "",
        phone: "",
        message: "",
        terms: false,
      })
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    } catch (error) {
      console.error("Submit error:", error)
      setSubmitError(t("contact.submitError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      <HeaderWithLogo />

      <main className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16 px-5 sm:px-6 bg-[#F0E2D0]">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-2xl md:text-5xl font-bold mb-2 md:mb-4 text-center text-[#3f210c]">
            {t("contact.title")}
          </h1>
          <p className="text-center text-[#3f210c]/70 text-xs md:text-lg mb-6 md:mb-12 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5 order-1 md:order-1">
              {/* Name */}
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-[#3f210c]">
                  {t("contact.name")} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t("contact.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`bg-white/80 border-[#3f210c]/20 text-[#3f210c] placeholder:text-[#3f210c]/40 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Surname */}
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-[#3f210c]">
                  {t("contact.surname")} <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder={t("contact.surnamePlaceholder")}
                  value={formData.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  className={`bg-white/80 border-[#3f210c]/20 text-[#3f210c] placeholder:text-[#3f210c]/40 ${errors.surname ? "border-red-500" : ""}`}
                />
                {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-[#3f210c]">
                  {t("contact.email")} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`bg-white/80 border-[#3f210c]/20 text-[#3f210c] placeholder:text-[#3f210c]/40 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-[#3f210c]">
                  {t("contact.phone")}{" "}
                  <span className="text-[#3f210c]/50 font-normal">({t("contact.phoneOptional")})</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none h-10 pl-3 pr-8 rounded-md border border-[#3f210c]/20 bg-white/80 text-[#3f210c] text-sm focus:outline-none focus:ring-2 focus:ring-[#3f210c]/30"
                    >
                      {COUNTRY_CODES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#3f210c]/50">
                      ▾
                    </div>
                  </div>
                  <Input
                    type="tel"
                    placeholder={t("contact.phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="flex-1 bg-white/80 border-[#3f210c]/20 text-[#3f210c] placeholder:text-[#3f210c]/40"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-1.5 text-[#3f210c]">
                  {t("contact.message")}{" "}
                  <span className="text-[#3f210c]/50 font-normal">({t("contact.messageOptional")})</span>
                </label>
                <Textarea
                  placeholder={t("contact.messagePlaceholder")}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="bg-white/80 border-[#3f210c]/20 text-[#3f210c] placeholder:text-[#3f210c]/40 resize-none"
                />
              </div>

              {/* Terms checkbox */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) => handleChange("terms", e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#3f210c]/30 text-[#3f210c] focus:ring-[#3f210c]/30"
                  />
                  <span className="text-xs md:text-sm text-[#3f210c]/80">
                    {t("contact.termsLabel")}{" "}
                    <Link href="/Muxu_Terms_of_Use.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#3f210c]">
                      {t("contact.termsLink")}
                    </Link>
                    ,{" "}
                    <Link href="/Muxu_Privacy_Policy.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#3f210c]">
                      {t("contact.privacyLink")}
                    </Link>{" "}
                    {t("contact.and")}{" "}
                    <Link href="/Muxu_Cookie_Policy.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#3f210c]">
                      {t("contact.cookiesLink")}
                    </Link>
                    . <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
              </div>

              {/* Turnstile CAPTCHA */}
              <div className="flex flex-col items-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => {
                    setTurnstileToken(token)
                    if (errors.captcha) {
                      setErrors((prev) => ({ ...prev, captcha: undefined }))
                    }
                  }}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                  options={{
                    theme: "light",
                    language: locale === "es" ? "es" : "en",
                  }}
                />
                {errors.captcha && <p className="text-red-500 text-xs mt-2">{errors.captcha}</p>}
              </div>

              <style jsx>{`
                .muxu-submit-btn {
                  background-color: #fdebea;
                  color: #3f210c;
                  width: 100%;
                  border-radius: 9999px;
                  padding: 0.75rem;
                  font-size: 0.875rem;
                  font-weight: 500;
                  cursor: pointer;
                  border: 2px solid rgba(63, 33, 12, 0.15);
                  transition: opacity 0.2s;
                }
                @media (min-width: 768px) {
                  .muxu-submit-btn {
                    padding: 1rem;
                    font-size: 1rem;
                  }
                }
                .muxu-submit-btn:hover:not(:disabled) {
                  opacity: 0.9;
                }
                .muxu-submit-btn:disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
                }
              `}</style>
              <button
                type="submit"
                className="muxu-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("contact.sending") : t("contact.submit")}
              </button>

              {submitError && (
                <p className="text-red-500 text-center text-sm">
                  {submitError}
                </p>
              )}

              {submitted && (
                <p className="text-green-600 text-center text-sm">
                  ✓ {t("contact.successMessage")}
                </p>
              )}
            </form>

            {/* Contact Info */}
            <div className="space-y-6 md:space-y-8 order-2 md:order-2">
              <div className="flex gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3f210c]/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#3f210c]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base text-[#3f210c]">{t("contact.email")}</h3>
                  <p className="text-[#3f210c]/70 text-sm md:text-base">chisscake.cc@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3f210c]/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#3f210c]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base text-[#3f210c]">{t("contact.phone")}</h3>
                  <p className="text-[#3f210c]/70 text-sm md:text-base">
                    <span className="text-xs text-[#3f210c]/50">USA:</span> +1 619 247 6644
                    <br />
                    <span className="text-xs text-[#3f210c]/50">ES:</span> +34 603 042 080
                  </p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3f210c]/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#3f210c]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5 md:mb-1 text-sm md:text-base text-[#3f210c]">{t("contact.location")}</h3>
                  <p className="text-[#3f210c]/70 text-sm md:text-base">
                    Calle Golondrina, 45
                    <br />
                    28023 Madrid
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CinematicFooter />
    </>
  )
}
