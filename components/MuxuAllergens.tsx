"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, X, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocale } from "@/contexts/locale-context"

type Flavour =
  | "clasica"
  | "chocolate-blanco"
  | "pistacho"
  | "oreo"
  | "lotus"
  | "turron-blando"
  | "turron-suchard"

type Allergen = "trigo" | "huevos" | "leche" | "nueces" | "soja"

interface MuxuAllergensProps {
  flavour: Flavour
}

const allergenMap: Record<Flavour, Allergen[]> = {
  clasica: ["trigo", "huevos", "leche"],
  "chocolate-blanco": ["trigo", "huevos", "leche", "soja"],
  pistacho: ["trigo", "huevos", "leche", "nueces", "soja"],
  oreo: ["trigo", "huevos", "leche", "soja"],
  lotus: ["trigo", "huevos", "leche", "soja", "nueces"],
  "turron-blando": ["trigo", "huevos", "leche", "nueces"],
  "turron-suchard": ["trigo", "huevos", "leche", "soja", "nueces"],
}

// Button component that can be placed on images
export function MuxuAllergensButton({ flavour }: MuxuAllergensProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageContainerRect, setImageContainerRect] = useState<DOMRect | null>(null)
  const { t } = useLocale()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Find the image container by looking for the parent with class 'group/image' or 'group'
    let element: HTMLElement | null = e.currentTarget.parentElement

    while (element && element !== document.body) {
      if (
        element.classList.contains("relative") &&
        (element.classList.contains("h-72") ||
          element.classList.contains("h-80") ||
          element.classList.contains("h-56") ||
          element.classList.contains("overflow-hidden"))
      ) {
        const rect = element.getBoundingClientRect()
        setImageContainerRect(rect)
        setIsOpen(true)
        return
      }
      element = element.parentElement
    }

    // Fallback: use button's parent container
    const parent = e.currentTarget.parentElement
    if (parent) {
      const rect = parent.getBoundingClientRect()
      setImageContainerRect(rect)
    }

    setIsOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#EED6C4]/60 text-[#3A0215]/70 hover:text-[#3A0215] transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
        aria-label={t("allergens.viewInfo")}
      >
        <Info className="w-4 h-4" />
      </button>

      <MuxuAllergensModal
        flavour={flavour}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setImageContainerRect(null)
        }}
        imageContainerRect={imageContainerRect}
      />
    </>
  )
}

// Modal inner content (shared between mobile and desktop)
function ModalInnerContent({
  allergens,
  isExpanded,
  setIsExpanded,
  scrollContainerRef,
  onClose,
  t,
}: {
  allergens: Allergen[]
  isExpanded: boolean
  setIsExpanded: (v: boolean) => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
  onClose: () => void
  t: (key: string) => string
}) {
  return (
    <>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3A0215]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-[#EED6C4]/60 text-[#3A0215]/60 hover:text-[#3A0215] transition-all hover:scale-110 flex items-center justify-center shadow-sm z-10"
        aria-label={t("allergens.close")}
      >
        <X className="w-4 h-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto pr-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(58, 2, 21, 0.2) transparent",
        }}
      >
        {/* Title */}
        <h3 className="uppercase tracking-[0.12em] text-[#3A0215] text-xs mb-4 font-semibold font-serif pr-8">
          {t("allergens.title")}
        </h3>

        {/* Allergen Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {allergens.map((allergen) => (
            <span
              key={allergen}
              className="inline-flex items-center px-2.5 py-1 border border-[#3A0215]/20 bg-white/90 text-[11px] rounded-full backdrop-blur-sm text-[#2A1B16] font-medium shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mr-1.5 flex-shrink-0" />
              {t(`allergens.labels.${allergen}`)}
            </span>
          ))}
        </div>

        {/* Summary Sentence */}
        <p className="text-[#2A1B16]/75 text-[12px] mb-4 leading-relaxed">
          {t("allergens.summary")}
        </p>

        {/* Accordion */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="flex items-center gap-2 text-[#3A0215]/80 hover:text-[#3A0215] transition-colors text-[12px] font-medium group w-full"
          >
            <span>{isExpanded ? t("allergens.lessInfo") : t("allergens.moreInfo")}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 text-[#3A0215]/60 group-hover:text-[#3A0215] ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[#EED6C4]/60 pt-3 mt-3 text-[12px] space-y-2 text-[#2A1B16]/80 pb-2">
                  {allergens.map((allergen) => (
                    <div key={allergen} className="leading-relaxed">
                      <span className="font-semibold text-[#3A0215]">{t(`allergens.labels.${allergen}`)}:</span>{" "}
                      {t(`allergens.descriptions.${allergen}`)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

// Modal component (separated for reuse)
function MuxuAllergensModal({
  flavour,
  isOpen,
  onClose,
  imageContainerRect,
}: MuxuAllergensProps & {
  isOpen: boolean
  onClose: () => void
  imageContainerRect: DOMRect | null
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useLocale()
  const allergens = allergenMap[flavour]

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reset expanded state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false)
    }
  }, [isOpen])

  // Auto-scroll to expanded content when accordion opens
  useEffect(() => {
    if (isExpanded && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const expandedContent = scrollContainerRef.current.querySelector('[class*="border-t"]')
          if (expandedContent) {
            expandedContent.scrollIntoView({ behavior: "smooth", block: "nearest" })
          }
        }
      }, 250)
    }
  }, [isExpanded])

  // Calculate desktop modal position
  const getDesktopPosition = () => {
    if (!imageContainerRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    }

    const modalWidth = 400
    const padding = 16
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const imageCenterX = imageContainerRect.left + imageContainerRect.width / 2
    let left = imageCenterX - modalWidth / 2

    const currentScrollY = window.scrollY
    let top = imageContainerRect.top + currentScrollY + 20

    if (left < padding) left = padding
    if (left + modalWidth > viewportWidth - padding) {
      left = viewportWidth - modalWidth - padding
    }

    const maxModalHeight = viewportHeight * 0.85
    const estimatedModalHeight = Math.min(400, maxModalHeight)
    const documentHeight = document.documentElement.scrollHeight
    
    if (top + estimatedModalHeight > documentHeight - padding) {
      top = Math.max(padding, documentHeight - estimatedModalHeight - padding)
    }
    if (top < padding) top = padding

    return {
      top: `${top}px`,
      left: `${left}px`,
      transform: "none",
    }
  }

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
          />

          {/* Modal - Different layout for mobile vs desktop */}
          {isMobile ? (
            // Mobile: Fixed centered modal
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-[101] inset-x-4 top-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="bg-[#F5E8D8] border border-[#EED6C4]/80 rounded-2xl p-4 shadow-2xl w-full pointer-events-auto relative overflow-hidden flex flex-col"
                style={{ maxHeight: "calc(100vh - 80px)" }}
              >
                <ModalInnerContent
                  allergens={allergens}
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                  scrollContainerRef={scrollContainerRef}
                  onClose={onClose}
                  t={t}
                />
              </div>
            </motion.div>
          ) : (
            // Desktop: Positioned near image
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute z-[101] pointer-events-none"
              style={getDesktopPosition()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#F5E8D8] border border-[#EED6C4]/80 rounded-3xl p-6 shadow-2xl max-w-md w-[400px] pointer-events-auto relative overflow-hidden max-h-[85vh] flex flex-col">
                <ModalInnerContent
                  allergens={allergens}
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                  scrollContainerRef={scrollContainerRef}
                  onClose={onClose}
                  t={t}
                />
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

// Legacy export for backwards compatibility
export function MuxuAllergens({ flavour }: MuxuAllergensProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLocale()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5E8D8]/80 hover:bg-[#F5E8D8] border border-[#EED6C4]/60 text-[#3A0215]/70 hover:text-[#3A0215] transition-all hover:scale-110 shadow-sm backdrop-blur-sm"
        aria-label={t("allergens.viewInfo")}
      >
        <Info className="w-4 h-4" />
      </button>

      <MuxuAllergensModal
        flavour={flavour}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        imageContainerRect={null}
      />
    </>
  )
}
