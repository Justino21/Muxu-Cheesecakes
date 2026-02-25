"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { PRODUCTS, type Product, getProductPricingOptions } from "@/lib/products"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useState, useRef } from "react"
import { motionVariants, transitions, replayViewportOptions } from "@/utils/motion"
import { SizeSelectDialog, type SizeOption } from "@/components/size-select-dialog"
import { createCheckout } from "@/lib/stripe/checkout"
import { getStripePriceId } from "@/lib/stripe/price-mapping"
import { CheckoutLoadingOverlay } from "@/components/checkout-loading-overlay"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { MuxuAllergensButton } from "@/components/MuxuAllergens"
import { useLocale } from "@/contexts/locale-context"
import { getTranslatedProductField } from "@/contexts/locale-context"

// Set to true to show each limited-edition section on the home page (hidden for now, not deleted)
const SHOW_TURRON_SECTION = false
const SHOW_SUCHARD_SECTION = false

export function CinematicLimitedScenes() {
  const { addToCart } = useCart()
  const { t } = useLocale()
  const [sizeDialogProduct, setSizeDialogProduct] = useState<Product | null>(null)
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [buyNowProduct, setBuyNowProduct] = useState<Product | null>(null)
  const [isBuyNowDialogOpen, setIsBuyNowDialogOpen] = useState(false)

  const limitedProducts = PRODUCTS.filter(
    (p) => p.isLimitedEdition && (p.id === "turron-cheesecake" || p.id === "suchard-cheesecake"),
  )

  const handleSizeSelect = (option: SizeOption) => {
    if (!sizeDialogProduct) return
    addToCart(sizeDialogProduct.id, option.size, option.priceInCents)
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "add_to_cart", {
        currency: "EUR",
        value: option.priceInCents / 100,
        items: [
          {
            item_id: sizeDialogProduct.id,
            item_name: sizeDialogProduct.name,
            price: option.priceInCents / 100,
          },
        ],
        isLimited: true,
      })
    }
    setIsSizeDialogOpen(false)
    setSizeDialogProduct(null)
  }

  const openSizeDialog = (product: Product) => {
    setSizeDialogProduct(product)
    setIsSizeDialogOpen(true)
  }

  const handleBuyNow = (product: Product) => {
    // Show size selection dialog first
    setBuyNowProduct(product)
    setIsBuyNowDialogOpen(true)
  }

  const handleBuyNowWithSize = async (option: SizeOption) => {
    if (!buyNowProduct) return

    try {
      setIsCheckoutLoading(true)
      setIsBuyNowDialogOpen(false)

      // Get Stripe Product ID for the selected size
      const stripeProductId = getStripePriceId(buyNowProduct.id, option.size)

      if (!stripeProductId) {
        console.error(`No Stripe product found for ${buyNowProduct.id} size ${option.size}`)
        alert(t("errors.checkoutConfig"))
        setIsCheckoutLoading(false)
        setBuyNowProduct(null)
        return
      }

      // Create Stripe checkout (amount from app: option.priceInCents)
      const checkoutUrl = await createCheckout(stripeProductId, 1, option.priceInCents)

      // Track event
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "begin_checkout", {
          currency: "EUR",
          value: option.priceInCents / 100,
          items: [
            {
              item_id: buyNowProduct.id,
              item_name: buyNowProduct.name,
              price: option.priceInCents / 100,
            },
          ],
        })
      }

      // Log the checkout URL for debugging
      console.log("Redirecting to Stripe checkout:", checkoutUrl)
      console.log("Stripe Product ID used:", stripeProductId)
      console.log("Size selected:", option.size)

      if (!checkoutUrl) {
        console.error("Invalid checkout URL:", checkoutUrl)
        alert(t("errors.checkoutInvalid"))
        setIsCheckoutLoading(false)
        setBuyNowProduct(null)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl
      setBuyNowProduct(null)
    } catch (error) {
      console.error("Error creating checkout:", error)
      setIsCheckoutLoading(false)
      setBuyNowProduct(null)

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : t("errors.checkoutFailed")
      alert(errorMessage)
    }
  }

  const turronProduct = limitedProducts.find((p) => p.id === "turron-cheesecake")
  const suchardProduct = limitedProducts.find((p) => p.id === "suchard-cheesecake")

  return (
    <>
      <CheckoutLoadingOverlay isVisible={isCheckoutLoading} />

      {/* Scene 1 - Turrón (hidden via SHOW_TURRON_SECTION, not deleted) */}
      {SHOW_TURRON_SECTION && turronProduct && (
        <CinematicLimitedScene
          product={turronProduct}
          isReversed={false}
          onBuyNow={handleBuyNow}
          onAddToCart={openSizeDialog}
          isCheckoutLoading={isCheckoutLoading}
        />
      )}

      {/* Scene 2 - Suchard (hidden via SHOW_SUCHARD_SECTION, not deleted) */}
      {SHOW_SUCHARD_SECTION && suchardProduct && (
        <CinematicLimitedScene
          product={suchardProduct}
          isReversed={true}
          onBuyNow={handleBuyNow}
          onAddToCart={openSizeDialog}
          isCheckoutLoading={isCheckoutLoading}
        />
      )}

      {/* Size Dialog for Add to Cart */}
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
      />

      {/* Size Dialog for Buy Now */}
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

function CinematicLimitedScene({
  product,
  isReversed,
  onBuyNow,
  onAddToCart,
  isCheckoutLoading,
}: {
  product: Product
  isReversed: boolean
  onBuyNow: (product: Product) => void
  onAddToCart: (product: Product) => void
  isCheckoutLoading: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, replayViewportOptions)
  const { t } = useLocale()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedText, setExpandedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, -60])
  const bgParallax = useTransform(scrollYProgress, [0, 1], [0, 20])

  // Floating glowing dust particles (hug the cake side)
  const dustParticles = Array.from({ length: 10 }, (_, i) => {
    const offset = isReversed ? 55 : 5
    const spread = 30
    return {
      id: i,
      left: `${offset + ((i * 7) % spread)}%`,
      top: `${25 + (i % 4) * 15}%`,
      delay: i * 0.8,
    }
  })

  const microcopy = getTranslatedProductField(t, product.id, "description", product.description)
  const fullDescT = getTranslatedProductField(t, product.id, "fullDescription", product.fullDescription ?? "")

  // Handle "Conocer más" click - typewrite the rest of the description
  const handleConocerMas = () => {
    if (!fullDescT || isExpanded) return

    setIsExpanded(true)
    setIsTyping(true)

    // Get the text that needs to be added (everything after the short description)
    const shortDesc = microcopy
    const fullDesc = fullDescT
    const textToAdd = fullDesc.slice(shortDesc.length).trim()

    // Typewrite the additional text
    let currentIndex = 0
    const writeNextChar = () => {
      if (currentIndex < textToAdd.length) {
        setExpandedText(textToAdd.slice(0, currentIndex + 1))
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
        setIsTyping(false)
      }
    }

    writeNextChar()
  }

  return (
    <motion.div
      ref={ref}
      className="relative min-h-[60vh] md:min-h-[70vh] overflow-hidden film-grain bg-[#3A0215]"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={motionVariants.sectionReveal}
      transition={transitions.smooth}
    >
      <div className="absolute inset-0 warm-particle-layer opacity-60" />
      <div className="absolute inset-0 warm-vignette pointer-events-none" />
      {/* Background Parallax Layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgParallax,
          background: "radial-gradient(circle at center, rgba(0,0,0,0.35), transparent 70%)",
        }}
      />

      {/* Candle Glow Behind the Cake */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isReversed
            ? "radial-gradient(circle at 70% 50%, rgba(243,222,195,0.18), transparent 65%)"
            : "radial-gradient(circle at 30% 50%, rgba(243,222,195,0.18), transparent 65%)",
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Glowing Dust Particles */}
      {dustParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            background: "radial-gradient(circle, rgba(247,231,192,0.6), transparent)",
            boxShadow: "0 0 10px rgba(247,231,192,0.4)",
          }}
          animate={{
            y: [0, -30, -60, -90],
            x: [0, 10, -5, 15],
            opacity: [0.6, 0.8, 0.6, 0],
            scale: [1, 1.2, 0.8, 0],
          }}
          transition={{
            duration: 8 + particle.id * 0.5,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Very Faint Gold Streak Behind Text (Soft Comet) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isReversed
            ? "linear-gradient(135deg, transparent 0%, rgba(247,231,192,0.05) 30%, transparent 60%)"
            : "linear-gradient(225deg, transparent 0%, rgba(247,231,192,0.05) 30%, transparent 60%)",
        }}
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10" variants={motionVariants.childFade}>
        <motion.div
          className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-center relative ${isReversed ? "md:grid-flow-dense" : ""}`}
          variants={motionVariants.staggerContainer}
        >
          {
            /* Image Gallery - Glides in like a film reveal */}
          <motion.div
            variants={motionVariants.childFade}
            className={`relative spotlight-halo ${isReversed ? "md:col-start-2" : ""}`}
            style={{ y: imageParallax }}
            whileHover={{ scale: 1.02, y: -4, transition: transitions.hover }}
          >
            <div className="relative">
              {/* EDICIÓN LIMITADA Badge - Top Left */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-block bg-[#FFF5EA] text-[#4A0F22] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg">
                  {t("flavours.limitedEdition")}
                </span>
              </div>

              {/* Allergen Info Button - Top Right */}
              <div className="absolute top-1 right-4 z-20">
                <MuxuAllergensButton flavour={product.id === "turron-cheesecake" ? "turron-blando" : "turron-suchard"} />
              </div>

              <ProductImageGallery images={product.images || [product.image || "/placeholder.svg"]} productName={getTranslatedProductField(t, product.id, "name", product.name)} />
            </div>
          </motion.div>

          {/* Text Block - Fades + Glows Softly */}
          <motion.div
            variants={motionVariants.childFade}
            className={`space-y-6 relative ${isReversed ? "md:col-start-1 md:row-start-1" : ""}`}
          >
            <div
              className="absolute -inset-x-10 inset-y-4 pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(243,222,195,0.35) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
            />

            {/* Title with Warm Golden Underglow */}
            <motion.h2
              variants={motionVariants.fadeInUp}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F7E7C0] font-semibold leading-tight relative"
            >
              <motion.span
                className="absolute -inset-4 candle-glow"
                style={{
                  background: "radial-gradient(circle, rgba(247,231,192,0.2), transparent 70%)",
                  filter: "blur(25px)",
                }}
                animate={{
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10 inline-block">{getTranslatedProductField(t, product.id, "name", product.name)}</span>
              <span className="light-sweep rounded-full opacity-60" />
            </motion.h2>

            {/* Microcopy */}
            <motion.div variants={motionVariants.fadeInUp} className="space-y-3">
              <div
                className="text-lg md:text-xl text-[#F7E7C0]/90 leading-relaxed"
                style={{
                  fontFamily: "var(--font-seanos), 'The Seanos', serif",
                }}
              >
                <span>{microcopy}</span>
                {isExpanded && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="inline">
                    {" "}
                    {expandedText.split("").map((char, index) => {
                      const isVisible = index < expandedText.length
                      const isLastChar = index === expandedText.length - 1 && isTyping
                      const isSpace = char === " "

                      return (
                        <motion.span
                          key={index}
                          initial={{
                            opacity: 0,
                            scale: 0.5,
                            clipPath: "inset(0 100% 0 0)",
                          }}
                          animate={{
                            opacity: isVisible ? 1 : 0,
                            scale: isVisible ? 1 : 0.5,
                            clipPath: isVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{
                            transformOrigin: "bottom left",
                            display: "inline",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {isSpace ? " " : char}
                          {isLastChar && !isSpace && (
                            <motion.span
                              className="inline-block ml-0.5"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              style={{
                                width: "2px",
                                height: "2px",
                                borderRadius: "50%",
                                background: "#F3DEC3",
                                verticalAlign: "middle",
                              }}
                            />
                          )}
                        </motion.span>
                      )
                    })}
                  </motion.span>
                )}
              </div>
              {fullDescT && !isExpanded && (
                <button
                  onClick={handleConocerMas}
                  className="text-sm text-[#F3DEC3] hover:text-[#F7E7C0] underline underline-offset-4 decoration-[#F3DEC3]/50 hover:decoration-[#F3DEC3] transition-all font-medium"
                >
                  {t("flavours.conocerMas")}
                </button>
              )}
            </motion.div>

            {/* Price */}
            <motion.div variants={motionVariants.fadeInUp} className="pt-2">
              <span className="text-xs uppercase tracking-wider text-[#F7E7C0]/60 block mb-1">{t("flavours.desde")}</span>
              <span
                className="text-2xl md:text-3xl text-[#F3DEC3]/90 font-medium"
                style={{ fontFamily: "var(--font-price), 'Inter', sans-serif", letterSpacing: "0.02em" }}
              >
                {getProductPricingOptions(product)[0].priceLabel}
              </span>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={motionVariants.fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => onBuyNow(product)}
                className="bg-[#F3DEC3] hover:bg-[#F3DEC3]/90 text-[#3A0215] rounded-full py-6 px-8 text-base font-semibold transition-all hover:scale-[1.02] shadow-[0_6px_22px_rgba(243,222,195,0.35)]"
                size="lg"
                disabled={isCheckoutLoading}
              >
                {t("flavours.buyNow")}
              </Button>
              <Button
                onClick={() => onAddToCart(product)}
                variant="outline"
                className="border-2 border-[#F3DEC3] text-[#F3DEC3] hover:bg-[#3A0215] hover:text-[#F3DEC3] rounded-full py-6 px-8 text-base font-semibold bg-transparent transition-all hover:scale-[1.02]"
                size="lg"
              >
                {t("flavours.addToCart")}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

