"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/contexts/locale-context"

export interface SizeOption {
  size: string
  subtitle: string
  priceLabel: string
  priceInCents: number
}

interface SizeSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  options: SizeOption[]
  onSelect: (option: SizeOption) => void
  mode?: "add-to-cart" | "buy-now"
}

export function SizeSelectDialog({
  open,
  onOpenChange,
  productName,
  options,
  onSelect,
  mode = "add-to-cart",
}: SizeSelectDialogProps) {
  const { t } = useLocale()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] max-w-md mx-auto">
        <DialogHeader className="space-y-1.5 md:space-y-2">
          <DialogTitle className="font-serif text-xl md:text-2xl text-[#3f210c]">
            {mode === "buy-now" ? t("sizeSelect.titleBuy") : t("sizeSelect.titleAdd")}
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base text-[#3f210c]/80">
            {productName || t("sizeSelect.selectProduct")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 md:space-y-3 pt-3 md:pt-4">
          {options.map((option) => {
            const sizeLabel =
              option.size === "Mediana" ? t("common.sizeMediana") : option.size === "Grande" ? t("common.sizeGrande") : option.size
            const piecesMatch = option.subtitle.match(/^(\d+)\s/)
            const subtitleLabel = piecesMatch
              ? `${piecesMatch[1]} ${t("common.pieces")}`
              : option.subtitle
            return (
            <Button
              key={option.size}
              variant="outline"
              className="w-full justify-between rounded-xl md:rounded-2xl border-[#fdebea] bg-gradient-to-r from-[#FFF5E9] to-white text-[#3f210c] hover:bg-[#FDEDF5] py-3 md:py-4"
              onClick={() => onSelect(option)}
            >
              <div className="text-left">
                <p className="font-semibold text-sm md:text-base">{sizeLabel}</p>
                <p className="text-[11px] md:text-xs text-[#3f210c]/70">{subtitleLabel}</p>
              </div>
              <span
                className="text-sm md:text-base text-[#5A1028]"
                style={{ fontFamily: "var(--font-price), 'Inter', sans-serif", letterSpacing: "0.02em" }}
              >
                {option.priceLabel}
              </span>
            </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

