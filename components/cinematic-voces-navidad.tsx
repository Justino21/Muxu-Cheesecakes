"use client"

import { motion } from "framer-motion"
import { motionVariants, transitions, useReplayViewport } from "@/utils/motion"
import { useLocale } from "@/contexts/locale-context"

function CinematicVocesNavidad() {
  const { ref, inView } = useReplayViewport()
  const { t } = useLocale()

  const dustParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${(i * 8) % 100}%`,
    delay: i * 1.2,
  }))

  return (
    <motion.section
      ref={ref}
      className="relative py-16 md:py-32 px-5 sm:px-6 overflow-hidden bg-[#F0E2D0]"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={motionVariants.sectionReveal}
      transition={transitions.smooth}
    >
      {/* Floating Dust Particles */}
      {dustParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: particle.left,
            top: "10%",
            background: "radial-gradient(circle, rgba(63,33,12,0.25), transparent)",
          }}
          animate={{
            y: [0, -150, -300],
            opacity: [0.6, 0.8, 0],
            scale: [1, 1.3, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Soft center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(63,33,12,0.04), transparent 60%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={motionVariants.childFade}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-[#3f210c] font-semibold">{t("voces.title")}</h2>
        </motion.div>

        {/* Paragraphs */}
        <div className="space-y-5 md:space-y-8">
          {["paragraph1", "paragraph2", "paragraph3", "paragraph4"].map((key, index) => (
            <motion.p
              key={key}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={motionVariants.fadeInUp}
              transition={{ ...transitions.smooth, delay: 0.1 + index * 0.1 }}
              className="text-sm md:text-lg text-[#3f210c]/85 leading-relaxed text-center"
              style={{ fontFamily: "var(--font-seanos), 'The Seanos', serif" }}
            >
              {t(`voces.${key}`)}
            </motion.p>
          ))}
        </div>

        {/* Brand signature */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={motionVariants.fadeInUp}
          transition={{ ...transitions.smooth, delay: 0.6 }}
          className="mt-10 md:mt-16 text-center"
        >
          <p className="font-serif text-xl md:text-3xl text-[#3f210c] font-semibold mb-1.5 md:mb-2">
            {t("voces.brandName")}
          </p>
          <p className="text-xs md:text-base text-[#3f210c]/70 italic tracking-wide">
            {t("voces.tagline")}
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export { CinematicVocesNavidad }

