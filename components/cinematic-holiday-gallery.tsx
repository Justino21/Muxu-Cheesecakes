"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { memo } from "react"
import { useLocale } from "@/contexts/locale-context"

const galleryKeys = [
  { image: "/momentos-turron.jpeg", key: "dulzura" as const },
  { image: "/original-preview.jpeg", key: "familia" as const },
  { image: "/momentos-original.jpeg", key: "compartir" as const },
  { image: "/momentos-lotus.jpeg", key: "tradicion" as const },
  { image: "/momentos-pistacho.jpeg", key: "recuerdos" as const },
  { image: "/momentos-turron-2.jpeg", key: "amor" as const },
]

const CONVEYOR_DURATION = 45

export function CinematicHolidayGallery() {
  const { t } = useLocale()
  const galleryItems = galleryKeys.map(({ image, key }) => ({
    image,
    caption: t(`momentos.captions.${key}`),
    subtitle: t(`momentos.captions.${key}Sub`),
  }))
  const dustParticles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${(i * 12) % 100}%`,
    delay: i * 1.5,
  }))

  return (
    <section
      className="relative pt-6 md:pt-10 pb-8 md:pb-12 overflow-hidden bg-[#F0E2D0]"
      aria-label="Momentos Muxu gallery"
    >
      {/* Subtle Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(238,214,196,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(238,214,196,0.15) 0%, transparent 50%)",
        }}
      />

      {/* Gold Dust */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(247,231,192,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(247,231,192,0.3), transparent 50%)",
        }}
      />

      {/* Floating Dust Particles */}
      {dustParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            left: particle.left,
            top: "20%",
            background: "radial-gradient(circle, rgba(247,231,192,0.8), transparent)",
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0.6, 0.8, 0],
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-5 sm:px-6 mb-5 md:mb-8 relative z-20">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-[#3f210c] font-semibold mb-1.5 md:mb-2">{t("momentos.title")}</h2>
          <p className="text-xs md:text-base text-[#3f210c]/60 font-light tracking-wide">{t("momentos.subtitle")}</p>
        </div>
      </div>

      {/* Conveyor belt: duplicated strip, continuous horizontal scroll */}
      <div className="relative z-20 w-full overflow-hidden">
        <motion.div
          className="flex gap-3 md:gap-4 pb-2"
          style={{ width: "max-content", willChange: "transform" }}
          animate={{ x: "-50%" }}
          transition={{
            duration: CONVEYOR_DURATION,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          {[...galleryItems, ...galleryItems].map((item, index) => (
            <div
              key={`${index}-${item.caption}`}
              className="flex-shrink-0 w-[180px] sm:w-[240px] md:w-[280px] h-[220px] sm:h-[280px] md:h-[320px] rounded-xl overflow-hidden"
            >
              <CinematicGallerySlide item={item} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const CinematicGallerySlide = memo(function CinematicGallerySlide({
  item,
  index,
}: {
  item: { image: string; caption: string; subtitle: string }
  index: number
}) {
  return (
    <div
      className="relative w-full h-full min-h-[180px] rounded-xl overflow-hidden group"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(243,222,195,0.1) inset",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.caption}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 60vw, 40vw"
          priority={index < 2}
          unoptimized={false}
          style={{ willChange: "transform" }}
        />
      </div>

      {/* Cinematic Vignette - Stronger */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Static Golden Sparkles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            width: "2px",
            height: "2px",
            background: "radial-gradient(circle, rgba(243,222,195,0.6), transparent)",
            boxShadow: "0 0 8px rgba(243,222,195,0.4)",
            opacity: 0.5,
          }}
        />
      ))}

      {/* Static Candlelight Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 35%, rgba(243,222,195,0.12), transparent 65%)",
        }}
      />

      {/* Static Secondary Glow Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(247,231,192,0.08), transparent 50%)",
        }}
      />

      {/* Dramatic Bottom Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)",
        }}
      />

      {/* Warm Gold Caption with Magical Glow */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5 z-10">
        <p
          className="font-serif text-lg md:text-xl text-[#F3DEC3] font-semibold relative leading-tight"
          style={{
            textShadow:
              "0 0 12px rgba(243,222,195,0.5), 0 2px 16px rgba(0,0,0,0.7), 0 0 30px rgba(243,222,195,0.25)",
            filter: "drop-shadow(0 0 4px rgba(243,222,195,0.4))",
          }}
        >
          {item.caption}
        </p>
        <span
          className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#F3DEC3] font-light"
          style={{
            textShadow: "0 0 10px rgba(243,222,195,0.4), 0 1px 10px rgba(0,0,0,0.6)",
          }}
        >
          {item.subtitle}
        </span>
      </div>

      {/* Static Shimmer Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 50% at 50% 50%, rgba(243,222,195,0.06), transparent 70%)",
        }}
      />

      {/* Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] film-grain"
        style={{
          mixBlendMode: "overlay",
        }}
      />
    </div>
  )
})

