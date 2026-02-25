"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/contexts/locale-context"

function LanguageSelector() {
  const { locale, setLocale, t } = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-[#3f210c] hover:text-[#3f210c]/70 hover:bg-[#EAD8C8]/20"
        aria-label="Language"
      >
        <Globe className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#3f210c] hover:text-[#3f210c]/70 hover:bg-[#EAD8C8]/20"
          aria-label={t("language.label")}
        >
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-[#fdebea] border-[#3f210c]/15">
        <DropdownMenuItem
          className="text-[#3f210c] focus:bg-[#3f210c]/10 focus:text-[#3f210c] cursor-pointer"
          onClick={() => setLocale("es")}
        >
          {t("language.es")}
          {locale === "es" && " ✓"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-[#3f210c] focus:bg-[#3f210c]/10 focus:text-[#3f210c] cursor-pointer"
          onClick={() => setLocale("en")}
        >
          {t("language.en")}
          {locale === "en" && " ✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelector
