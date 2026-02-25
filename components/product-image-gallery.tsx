"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductImageGallery({ images, productName, className = "" }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showThumbnails, setShowThumbnails] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const touchStartX = useRef<number | null>(null)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (hasMultipleImages) touchStartX.current = e.touches[0].clientX
    },
    [hasMultipleImages]
  )
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!hasMultipleImages || touchStartX.current == null) return
      const endX = e.changedTouches[0].clientX
      const deltaX = endX - touchStartX.current
      touchStartX.current = null
      if (deltaX < -40) goToNext()
      else if (deltaX > 40) goToPrevious()
    },
    [hasMultipleImages, goToNext, goToPrevious]
  )

  return (
    <div className={`relative group ${className}`} onMouseEnter={() => setShowThumbnails(true)} onMouseLeave={() => setShowThumbnails(false)}>
      {/* Main Image Container */}
      <div
        className="relative rounded-2xl overflow-hidden warm-vignette touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-[400px] md:h-[500px] cursor-pointer"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x
              if (swipe < -10000) {
                goToNext()
              } else if (swipe > 10000) {
                goToPrevious()
              }
            }}
            onClick={() => hasMultipleImages && goToNext()}
          >
            <Image
              src={currentImage}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              className="object-cover select-none"
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Navigation Dots - Always visible but minimal */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-8 h-1.5 bg-[#F3DEC3] shadow-[0_0_8px_rgba(243,222,195,0.6)]"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Subtle Navigation Arrows - Only on hover */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full z-10 border border-white/10"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full z-10 border border-white/10"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Warm Golden Rim Light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(247,231,192,0.2) 0%, transparent 30%, transparent 70%, rgba(247,231,192,0.15) 100%)",
          }}
        />

        {/* Soft Blur Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

        {/* Warm Dust Swirls on Hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.25] transition-opacity duration-700"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(247,231,192,0.6), transparent 50%), radial-gradient(circle at 70% 60%, rgba(247,231,192,0.5), transparent 50%)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Elegant Thumbnail Gallery - Only visible on hover, subtle and integrated */}
      {hasMultipleImages && (
        <AnimatePresence>
          {showThumbnails && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute -bottom-16 left-0 right-0 flex justify-center gap-2 z-20"
            >
              <div className="flex gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border transition-all ${
                      currentIndex === index
                        ? "border-[#F3DEC3] shadow-[0_0_12px_rgba(243,222,195,0.5)] scale-110"
                        : "border-white/20 hover:border-white/40 opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={image} alt={`${productName} thumbnail ${index + 1}`} fill className="object-cover" sizes="48px" />
                    {currentIndex === index && (
                      <motion.div
                        className="absolute inset-0 bg-[#F3DEC3]/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

