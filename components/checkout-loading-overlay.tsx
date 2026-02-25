"use client"

import { motion } from "framer-motion"
import { useLocale } from "@/contexts/locale-context"

interface CheckoutLoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function CheckoutLoadingOverlay({ isVisible, message }: CheckoutLoadingOverlayProps) {
  const { t } = useLocale()
  const displayMessage = message ?? t("checkout.loadingMessage")
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#fdebea] backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6 px-8 relative"
      >
        {/* Animated Spinner */}
        <div className="flex justify-center">
          <motion.div
            className="w-16 h-16 border-4 border-[#3f210c]/20 border-t-[#3f210c] rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-2xl md:text-3xl text-[#3f210c] font-medium"
        >
          {displayMessage}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

