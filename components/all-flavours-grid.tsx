"use client"

import { motion, AnimatePresence } from "framer-motion"
import { PRODUCTS, type Product, getProductPricingOptions } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { motionVariants, transitions, useReplayViewport } from "@/utils/motion"
import { SizeSelectDialog, type SizeOption } from "@/components/size-select-dialog"
import { createCheckout } from "@/lib/stripe/checkout"
import { getStripePriceId } from "@/lib/stripe/price-mapping"
import { CheckoutLoadingOverlay } from "@/components/checkout-loading-overlay"
import { useState, useMemo, memo, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { MuxuAllergensButton } from "@/components/MuxuAllergens"
import { useLocale } from "@/contexts/locale-context"
import { getTranslatedProductField } from "@/contexts/locale-context"

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
        className="relative h-72 md:h-80 overflow-hidden mb-4 -mx-4 -mt-4 rounded-t-2xl group/image touch-pan-y"
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
            className="relative w-full h-full rounded-t-2xl overflow-hidden"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className="object-cover rounded-t-2xl"
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
    return (
      prevProps.productName === nextProps.productName &&
      prevProps.allergenFlavour === nextProps.allergenFlavour &&
      prevProps.images.length === nextProps.images.length &&
      prevProps.images.every((img, i) => img === nextProps.images[i])
    )
  },
)

export function AllFlavoursGrid() {
  const { addToCart } = useCart()
  const [sizeDialogProduct, setSizeDialogProduct] = useState<Product | null>(null)
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null)
  const [isBuyNowDialogOpen, setIsBuyNowDialogOpen] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, { isExpanded: boolean; expandedText: string; isTyping: boolean }>
  >({})

  // Show ALL products (limited edition + regular)
  const allProducts = PRODUCTS
  const { ref, inView } = useReplayViewport()
  const { t } = useLocale()

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
      setBuyNowProduct(null)
    } catch (error) {
      console.error("Error creating checkout:", error)
      setIsCheckoutLoading(false)
      setBuyNowProduct(null)
      alert(t("errors.checkoutFailed"))
    }
  }

  const handleConocerMas = (product: Product) => {
    const fullDescT = getTranslatedProductField(t, product.id, "fullDescription", product.fullDescription ?? "")
    if (!fullDescT || expandedProducts[product.id]?.isExpanded) {
      setExpandedProducts((prev) => ({
        ...prev,
        [product.id]: { isExpanded: false, expandedText: "", isTyping: false },
      }))
      return
    }

    setExpandedProducts((prev) => ({
      ...prev,
      [product.id]: { isExpanded: true, expandedText: "", isTyping: true },
    }))

    const shortDesc = getTranslatedProductField(t, product.id, "description", product.description)
    const fullDesc = fullDescT
    const textToAdd = fullDesc.slice(shortDesc.length).trim()

    let currentIndex = 0
    const writeNextChar = () => {
      if (currentIndex < textToAdd.length) {
        setExpandedProducts((prev) => ({
          ...prev,
          [product.id]: {
            ...prev[product.id],
            expandedText: textToAdd.slice(0, currentIndex + 1),
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
            ...prev[product.id],
            isTyping: false,
          },
        }))
      }
    }

    writeNextChar()
  }

  const openSizeDialog = (product: Product) => {
    setSizeDialogProduct(product)
    setIsSizeDialogOpen(true)
  }

  const openBuyNowDialog = (product: Product) => {
    setBuyNowProduct(product)
    setIsBuyNowDialogOpen(true)
  }

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

  return (
    <>
      <CheckoutLoadingOverlay isVisible={isCheckoutLoading} />

      <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {allProducts.map((product, index) => {
          const productImages = useMemo(() => {
            return product.images || [product.image || "/placeholder.svg"]
          }, [product.id])

          const allergenFlavour = flavourMap[product.id]
          const isLimited = product.isLimitedEdition

          return (
            <motion.div
              key={product.id}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={motionVariants.fadeInUp}
              transition={{ ...transitions.smooth, delay: index * 0.1 }}
              className="group h-full flex"
              whileHover={{ y: -4, transition: transitions.hover }}
            >
              {/* Container with different styling for limited edition */}
              <div
                className={`relative rounded-2xl p-4 border transition-all duration-500 flex flex-col w-full ${
                  isLimited
                    ? "border-[#F4E1B5]/30 shadow-[0_4px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] group-hover:border-[#F4E1B5]/50"
                    : "bg-gradient-to-b from-[#FFF5EA]/50 to-[#F5E8D8]/30 border-[#EED6C4]/40 shadow-[0_4px_20px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:border-[#EED6C4]/60"
                }`}
                style={isLimited ? { backgroundColor: "#3A0215" } : {}}
              >
                {/* Elegant outline glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isLimited
                      ? "bg-gradient-to-br from-[#F4E1B5]/15 via-[#F7E7C0]/10 to-[#F4E1B5]/15"
                      : "bg-gradient-to-br from-[#F3DEC3]/15 via-[#EED6C4]/10 to-[#F3DEC3]/15"
                  }`}
                  style={{
                    boxShadow: isLimited
                      ? "inset 0 0 0 1px rgba(244,225,181,0.3)"
                      : "inset 0 0 0 1px rgba(243,222,195,0.3)",
                  }}
                />

                {/* Limited Edition Badge */}
                {isLimited && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block bg-[#FFF5EA] text-[#4A0F22] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg">
                      {t("flavours.limitedEdition")}
                    </span>
                  </div>
                )}

                {/* Image Gallery */}
                <ProductCardImageGallery images={productImages} productName={getTranslatedProductField(t, product.id, "name", product.name)} allergenFlavour={allergenFlavour} />

                {/* Content */}
                <div className="space-y-3 relative z-10 flex flex-col flex-grow">
                  <h3
                    className={`font-serif text-xl md:text-2xl font-semibold mb-1 ${
                      isLimited ? "text-[#FFF5E9]" : "text-[#3f210c]"
                    }`}
                  >
                    {getTranslatedProductField(t, product.id, "name", product.name)}
                  </h3>
                  <div className="space-y-2">
                    <p
                      className={`text-sm ${isLimited ? "text-[#F4E1B5]/80" : "text-[#3f210c]/60"}`}
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
                                    className={`inline-block w-0.5 h-4 ml-0.5 ${isLimited ? "bg-[#F4E1B5]" : "bg-[#4A0F22]"}`}
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
                        className={`text-xs underline underline-offset-2 transition-colors ${
                          isLimited ? "text-[#F4E1B5]/70 hover:text-[#F4E1B5]" : "text-[#4A0F22]/70 hover:text-[#4A0F22]"
                        }`}
                      >
                        {t("flavours.conocerMas")}
                      </button>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between pt-2">
                    <div>
                      <span className={`text-xs uppercase tracking-wider block mb-0.5 ${isLimited ? "text-[#F4E1B5]/60" : "text-[#3f210c]/50"}`}>
                        {t("flavours.desde")}
                      </span>
                      <span
                        className={`text-lg md:text-xl font-medium ${isLimited ? "text-[#F4E1B5]" : "text-[#4A0F22]/80"}`}
                        style={{ fontFamily: "var(--font-price), 'Inter', sans-serif", letterSpacing: "0.02em" }}
                      >
                        {getProductPricingOptions(product)[0].priceLabel}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 mt-auto">
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        openBuyNowDialog(product)
                      }}
                      className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] ${
                        isLimited
                          ? "bg-[#F3DEC3] hover:bg-[#F3DEC3]/90 text-[#3A0215] shadow-[0_6px_22px_rgba(243,222,195,0.35)]"
                          : "bg-[#F3DEC3] hover:bg-[#F3DEC3]/90 text-[#3A0215] shadow-[0_4px_15px_rgba(243,222,195,0.3)]"
                      }`}
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
                      className={`flex-1 border-2 rounded-full py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] ${
                        isLimited
                          ? "border-[#F3DEC3] text-[#F3DEC3] hover:bg-[#3A0215] hover:text-[#F3DEC3] bg-transparent"
                          : "border-[#3A0215] text-[#3A0215] hover:bg-[#3A0215] hover:text-[#F3DEC3]"
                      }`}
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
    </>
  )
}

