"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export function TopBrandBar() {
  return (
    <Link
      href="/"
      className={cn(
        "block w-full h-0 bg-transparent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f210c] focus-visible:ring-offset-1",
      )}
      aria-label="Return to home"
      tabIndex={0}
    />
  )
}
