"use client"

import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS } from "@/lib/products"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { motionVariants, transitions, useReplayViewport } from "@/utils/motion"
import { SizeSelectDialog, type SizeOption } from "@/components/size-select-dialog"
import { useState, useMemo, memo, useRef, useCallback } from "react"
import { type Product, getProductPricingOptions } from "@/lib/products"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createCheckout } from "@/lib/stripe/checkout"
import { getStripePriceId } from "@/lib/stripe/price-mapping"
import { CheckoutLoadingOverlay } from "@/components/checkout-loading-overlay"
import { MuxuAllergensButton } from "@/components/MuxuAllergens"
import { useLocale, getTranslatedProductField } from "@/contexts/locale-context"

const ProductCardImageGallery = memo(
  function ProductCardImageGallery({
    images,
    productName,
    allergenFlavour,
  }: {
    images: string[]
    productName: string
    allergenFlavour?:
      | "clasica"
      | "chocolate-blanco"
      | "pistacho"
      | "oreo"
      | "lotus"
      | "turron-blando"
      | "turron-suchard"
  }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const hasMultipleImages = images.length > 1

    const goToNext = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const goToPrevious = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const touchStartX = useRef<number | null>(null)
    const onTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (hasMultipleImages) touchStartX.current = e.touches[0].clientX
      },
      [hasMultipleImages]
    )
    const onTouchEnd = useCallback(
      (e: React.TouchEvent) => {
        if (!hasMultipleImages || touchStartX.current == null) return
        const endX = e.changedTouches[0].clientX
        const deltaX = endX - touchStartX.current
        touchStartX.current = null
        if (deltaX < -40) setCurrentIndex((prev) => (prev + 1) % images.length)
        else if (deltaX > 40) setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      },
      [hasMultipleImages, images.length]
    )

    const ImageContent = () => (
      <div
        className="relative h-56 md:h-80 overflow-hidden mb-3 md:mb-4 -mx-3 md:-mx-4 -mt-3 md:-mt-4 rounded-t-xl md:rounded-t-2xl group/image touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full rounded-t-xl md:rounded-t-2xl overflow-hidden"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className="object-cover rounded-t-xl md:rounded-t-2xl group-hover/image:scale-105 transition-transform duration-500 ease-[0.25,0.46,0.45,0.94]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-opacity rounded-full p-2 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover/image:opacity-100 transition-opacity rounded-full p-2 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    currentIndex === index ? "w-4 bg-[#F3DEC3] shadow-md" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Warm vignette overlay */}
        <div className="absolute inset-0 pointer-events-none warm-vignette opacity-60" />

        {/* Allergen Info Button */}
        {allergenFlavour && <MuxuAllergensButton flavour={allergenFlavour} />}
      </div>
    )

    return <ImageContent />
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if images array actually changed
    return (
      prevProps.productName === nextProps.productName &&
      prevProps.allergenFlavour === nextProps.allergenFlavour &&
      prevProps.images.length === nextProps.images.length &&
      prevProps.images.every((img, i) => img === nextProps.images[i])
    )
  },
)

export function CinematicPremiumFlavours() {
  const { addToCart } = useCart()
  const { t } = useLocale()
  const [sizeDialogProduct, setSizeDialogProduct] = useState<Product | null>(null)
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null)
  const [isBuyNowDialogOpen, setIsBuyNowDialogOpen] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, { isExpanded: boolean; expandedText: string; isTyping: boolean }>
  >({})

  // Show all regular flavours (not limited edition)
  const regularProducts = PRODUCTS.filter((p) => !p.isLimitedEdition)
  const { ref, inView } = useReplayViewport()

  const handleSizeSelect = (option: SizeOption) => {
    if (!sizeDialogProduct) return
    addToCart(sizeDialogProduct.id, option.size, option.priceInCents)
    setIsSizeDialogOpen(false)
    setSizeDialogProduct(null)
  }

  const handleBuyNowWithSize = async (option: SizeOption) => {
    if (!buyNowProduct) return

    setIsBuyNowDialogOpen(false)
    setIsCheckoutLoading(true)

    try {
      const stripeProductId = getStripePriceId(buyNowProduct.id, option.size)
      if (!stripeProductId) {
        console.error(`No Stripe product found for ${buyNowProduct.id} size ${option.size}`)
        alert(t("errors.checkoutConfig"))
        setIsCheckoutLoading(false)
        return
      }

      const checkoutUrl = await createCheckout(stripeProductId, 1, option.priceInCents)

      if (!checkoutUrl) {
        console.error("Invalid checkout URL:", checkoutUrl)
        alert(t("errors.checkoutInvalid"))
        setIsCheckoutLoading(false)
        return
      }

      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Error creating checkout:", error)
      setIsCheckoutLoading(false)
      const errorMessage =
        error instanceof Error ? error.message : t("errors.checkoutFailed")
      alert(errorMessage)
    }
  }

  const openSizeDialog = (product: Product) => {
    setSizeDialogProduct(product)
    setIsSizeDialogOpen(true)
  }

  const openBuyNowDialog = (product: Product) => {
    setBuyNowProduct(product)
    setIsBuyNowDialogOpen(true)
  }

  const handleConocerMas = (product: Product) => {
    const fullDescT = getTranslatedProductField(t, product.id, "fullDescription", product.fullDescription ?? "")
    if (!fullDescT || expandedProducts[product.id]?.isExpanded) return

    const shortDesc = getTranslatedProductField(t, product.id, "description", product.description)
    const fullDesc = fullDescT
    const textToAdd = fullDesc.slice(shortDesc.length).trim()

    setExpandedProducts((prev) => ({
      ...prev,
      [product.id]: { isExpanded: true, expandedText: "", isTyping: true },
    }))

    let currentIndex = 0
    const writeNextChar = () => {
      if (currentIndex < textToAdd.length) {
        setExpandedProducts((prev) => ({
          ...prev,
          [product.id]: {
            isExpanded: true,
            expandedText: textToAdd.slice(0, currentIndex + 1),
            isTyping: true,
          },
        }))
        currentIndex++

        const baseDelay = 25
        const variation = Math.random() * 10 - 5
        const delay = baseDelay + variation

        if (textToAdd[currentIndex - 1]?.match(/[.,;:!?]/)) {
          setTimeout(writeNextChar, delay + 50)
        } else if (textToAdd[currentIndex - 1] === " ") {
          setTimeout(writeNextChar, delay + 10)
        } else {
          setTimeout(writeNextChar, delay)
        }
      } else {
        setExpandedProducts((prev) => ({
          ...prev,
          [product.id]: {
            isExpanded: true,
            expandedText: textToAdd,
            isTyping: false,
          },
        }))
      }
    }

    writeNextChar()
  }

  return (
    <>
      <section ref={ref} className="pt-8 md:pt-12 pb-16 md:pb-32 px-3 sm:px-4 bg-[#F5E8D8]">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={motionVariants.sectionReveal}
          transition={transitions.smooth}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={motionVariants.fadeInUp}
              transition={transitions.smooth}
              className="text-center mb-12 md:mb-16 space-y-3"
            >
              <h2 className="font-serif text-3xl md:text-5xl text-[#3f210c] font-semibold px-2">{t("flavours.sectionTitle")}</h2>
              <p className="text-base md:text-xl text-[#3f210c]/70 px-2">{t("flavours.sectionSubtitle")}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {regularProducts.map((product, index) => {
                const productImages = useMemo(() => {
                  return product.images || [product.image || "/placeholder.svg"]
                }, [product.id])

                // Map product ID to flavour for allergens component
                const flavourMap: Record<
                  string,
                  | "clasica"
                  | "chocolate-blanco"
                  | "pistacho"
                  | "oreo"
                  | "lotus"
                  | "turron-blando"
                  | "turron-suchard"
                  | undefined
                > = {
                  "classic-new-york": "clasica",
                  "white-chocolate": "chocolate-blanco",
                  pistachio: "pistacho",
                  oreo: "oreo",
                  lotus: "lotus",
                  "turron-cheesecake": "turron-blando",
                  "suchard-cheesecake": "turron-suchard",
                }

                const allergenFlavour = flavourMap[product.id]

                return (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={motionVariants.fadeInUp}
                    transition={{ ...transitions.smooth, delay: index * 0.1 }}
                    className="group"
                    whileHover={{ y: -4, transition: transitions.hover }}
                  >
                    <div className="relative bg-gradient-to-b from-[#FFF5EA]/50 to-[#F5E8D8]/30 rounded-xl md:rounded-2xl p-3 md:p-4 border border-[#EED6C4]/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:border-[#EED6C4]/60 transition-all duration-500">
                      {/* Elegant outline glow on hover */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(243,222,195,0.15) 0%, rgba(238,214,196,0.1) 50%, rgba(243,222,195,0.15) 100%)",
                          boxShadow: "inset 0 0 0 1px rgba(243,222,195,0.3)",
                        }}
                      />

                      {/* Image Gallery */}
                      <ProductCardImageGallery images={productImages} productName={getTranslatedProductField(t, product.id, "name", product.name)} allergenFlavour={allergenFlavour} />

                      {/* Content */}
                      <div className="space-y-2 md:space-y-3 relative z-10">
                        <h3 className="font-serif text-lg md:text-2xl font-semibold text-[#3f210c] mb-1">
                          {getTranslatedProductField(t, product.id, "name", product.name)}
                        </h3>
                        <div className="space-y-2">
                          <p
                            className="text-sm text-[#3f210c]/60"
                            style={{
                              fontFamily: "var(--font-seanos), 'The Seanos', serif",
                            }}
                          >
                            <span>{getTranslatedProductField(t, product.id, "description", product.description)}</span>
                            {expandedProducts[product.id]?.isExpanded && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="inline">
                                {" "}
                                {expandedProducts[product.id].expandedText.split("").map((char, index) => {
                                  const isVisible = index < expandedProducts[product.id].expandedText.length
                                  const isLastChar =
                                    index === expandedProducts[product.id].expandedText.length - 1 && expandedProducts[product.id].isTyping

                                  return (
                                    <motion.span
                                      key={index}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: isVisible ? 1 : 0 }}
                                      className="inline"
                                      style={{
                                        wordBreak: "normal",
                                        overflowWrap: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {char}
                                      {isLastChar && (
                                        <motion.span
                                          className="inline-block w-0.5 h-4 bg-[#4A0F22] ml-0.5"
                                          animate={{ opacity: [1, 0, 1] }}
                                          transition={{ duration: 0.8, repeat: Infinity }}
                                        />
                                      )}
                                    </motion.span>
                                  )
                                })}
                              </motion.span>
                            )}
                          </p>
                          {getTranslatedProductField(t, product.id, "fullDescription", product.fullDescription ?? "") && !expandedProducts[product.id]?.isExpanded && (
                            <button
                              onClick={() => handleConocerMas(product)}
                              className="text-xs text-[#4A0F22]/70 hover:text-[#4A0F22] underline underline-offset-2 transition-colors"
                            >
                              {t("flavours.conocerMas")}
                            </button>
                          )}
                        </div>
                        <div className="flex items-baseline justify-between pt-2">
                          <div>
                            <span className="text-xs uppercase tracking-wider text-[#3f210c]/50 block mb-0.5">{t("flavours.desde")}</span>
                            <span
                              className="text-lg md:text-xl font-medium text-[#4A0F22]/80"
                              style={{ fontFamily: "var(--font-price), 'Inter', sans-serif", letterSpacing: "0.02em" }}
                            >
                              {getProductPricingOptions(product)[0].priceLabel}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              openBuyNowDialog(product)
                            }}
                            className="flex-1 bg-[#F3DEC3] hover:bg-[#F3DEC3]/90 text-[#3A0215] rounded-full py-2 md:py-2.5 text-xs md:text-sm font-semibold transition-all hover:scale-105 shadow-[0_4px_15px_rgba(243,222,195,0.3)]"
                            disabled={isCheckoutLoading}
                          >
                            {t("flavours.buyNow")}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              openSizeDialog(product)
                            }}
                            variant="outline"
                            className="flex-1 border-2 border-[#3A0215] text-[#3A0215] hover:bg-[#3A0215] hover:text-[#F3DEC3] rounded-full py-2 md:py-2.5 text-xs md:text-sm font-semibold transition-all hover:scale-105"
                          >
                            {t("flavours.addToCart")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </section>

      <SizeSelectDialog
        open={isSizeDialogOpen}
        onOpenChange={(open) => {
          setIsSizeDialogOpen(open)
          if (!open) {
            setSizeDialogProduct(null)
          }
        }}
        productName={sizeDialogProduct ? getTranslatedProductField(t, sizeDialogProduct.id, "name", sizeDialogProduct.name) : ""}
        options={sizeDialogProduct ? getProductPricingOptions(sizeDialogProduct) : []}
        onSelect={handleSizeSelect}
        mode="add-to-cart"
      />
      <SizeSelectDialog
        open={isBuyNowDialogOpen}
        onOpenChange={(open) => {
          setIsBuyNowDialogOpen(open)
          if (!open) {
            setBuyNowProduct(null)
          }
        }}
        productName={buyNowProduct ? getTranslatedProductField(t, buyNowProduct.id, "name", buyNowProduct.name) : ""}
        options={buyNowProduct ? getProductPricingOptions(buyNowProduct) : []}
        onSelect={handleBuyNowWithSize}
        mode="buy-now"
      />
      <CheckoutLoadingOverlay isVisible={isCheckoutLoading} />
    </>
  )
}

