"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Calendar, Truck } from "lucide-react"
import { motionVariants, transitions, useReplayViewport } from "@/utils/motion"
import { useLocale } from "@/contexts/locale-context"

export function CinematicComoFunciona() {
  const { ref, inView } = useReplayViewport()
  const { t } = useLocale()
  const steps = [
    { icon: ShoppingCart, titleKey: "step1" as const },
    { icon: Calendar, titleKey: "step2" as const },
    { icon: Truck, titleKey: "step3" as const },
  ]
  return (
    <section ref={ref} className="py-14 md:py-28 px-5 sm:px-6 bg-[#F5E8D8]">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={motionVariants.sectionReveal}
        transition={transitions.smooth}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={motionVariants.fadeInUp}
            transition={transitions.smooth}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="font-serif text-2xl md:text-4xl text-[#3f210c] font-semibold mb-2 md:mb-3 px-2">
              {t("comoFunciona.title")}
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={motionVariants.fadeInUp}
                  transition={{ ...transitions.smooth, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center space-y-2 md:space-y-4 flex-1 max-w-[220px] relative"
                >
                  <motion.div
                    className="w-full h-full px-4 md:px-6 py-4 md:py-8 flex flex-col items-center space-y-2 md:space-y-4 relative"
                    whileHover={{
                      y: -4,
                      transition: { duration: 0.35 },
                    }}
                  >
                    <motion.div
                      className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center relative"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.4 },
                      }}
                    >
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-[#3A0215] relative z-10" strokeWidth={1.6} />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "radial-gradient(circle, rgba(243,222,195,0.45), transparent 70%)",
                          filter: "blur(12px)",
                        }}
                        animate={{
                          opacity: [0.25, 0.4, 0.25],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                    <p className="text-sm md:text-lg text-[#2A1B16] font-medium">{t(`comoFunciona.${step.titleKey}`)}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

