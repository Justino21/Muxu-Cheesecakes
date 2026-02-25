"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import type { RefObject } from "react"
import type { Variants, Transition } from "framer-motion"

const baseEase = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] // Smoother, more fluid easing

export const motionVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  sectionReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  childFade: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  },
  staggerTight: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
}

export const transitions: Record<string, Transition> = {
  smooth: { duration: 0.8, ease: baseEase },
  slow: { duration: 1.0, ease: baseEase },
  quick: { duration: 0.4, ease: baseEase },
  hover: { duration: 0.3, ease: baseEase },
}

export const viewportSettings = {
  once: true,
  margin: "0px 0px -80px 0px",
  amount: 0.2,
}

/** Same as viewportSettings but with once: false for useInView (replay on scroll up/down). */
export const replayViewportOptions = {
  margin: "0px 0px -80px 0px",
  amount: 0.2,
  once: false,
} as const

/**
 * Use this so a section animates in when it enters the viewport (scroll down or up)
 * and resets when it leaves, so it can animate again on the next pass.
 */
export function useReplayViewport(): { ref: RefObject<HTMLElement | null>; inView: boolean } {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, replayViewportOptions)
  return { ref, inView }
}

