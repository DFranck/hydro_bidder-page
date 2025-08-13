"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useEffect, useMemo, useRef, useState } from "react"
import { useMarketplaceData } from "../../marketplace/context/MarketplaceDataProvider"
import { MarketplaceLockup } from "../../marketplace/types"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getAllowedPaymentDenoms } from "../../utils/getAllowedPaymentDenoms"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { useLockupTotals } from "../hooks/useLockupPricing"
import { LockupActionPayloadFor } from "../types"
import { getLowestComparablePrice } from "../utils/getLowestComparablePrice"
import LockupActionCardValue from "./LockupActionCardValue"
import LockupPremiumSelect from "./LockupPremiumSelect"

type LockupActionCardPriceProps<L extends AugmentedLockup | MarketplaceLockup> =
  {
    lockup: L
    onChange?: (values: Partial<LockupActionPayloadFor<"list">>) => void
  }

const round = (n: number, decimals = 6) => {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}

const LockupActionCardPrice = <L extends AugmentedLockup | MarketplaceLockup>({
  lockup,
  onChange,
}: LockupActionCardPriceProps<L>) => {
  const collections = useBackendData().collections
  const atomPrice = useBackendData().atomPrice
  const { marketplaceLockups } = useMarketplaceData()

  const { totalAtom } = useLockupTotals(lockup)
  const base = Number.isFinite(totalAtom) ? (totalAtom as number) : 0

  const [premium, setPremium] = useState<number>(50)

  const [priceInput, setPriceInput] = useState<string>("")

  const lastChanged = useRef<"premium" | "price" | null>(null)

  useEffect(() => {
    if (!Number.isFinite(base) || base <= 0) {
      setPriceInput((prev) => (prev === "" ? prev : ""))
      return
    }
    if (lastChanged.current === "price") return

    const p = round(base * (1 + (premium || 0) / 100), 2)
    const next = String(p)
    setPriceInput((prev) => (prev === next ? prev : next))
  }, [base, premium])

  const handlePriceChange = (s: string) => {
    setPriceInput(s)
    lastChanged.current = "price"

    if (!Number.isFinite(base) || base <= 0) return
    const n = Number(s.replace(",", "."))
    if (!Number.isFinite(n)) return

    const next = (n / base - 1) * 100

    setPremium(next)
  }

  const handlePremiumChange = (v: number) => {
    lastChanged.current = "premium"
    setPremium(v)
  }

  const allowedPaymentDenoms = useMemo(
    () => getAllowedPaymentDenoms(collections),
    [collections]
  )
  const lowestComparable = formatDenomAmount(
    getLowestComparablePrice(marketplaceLockups, lockup) || "",
    getDenomExponent(allowedPaymentDenoms[0])
  )
  const priceDisplayDenom = getDisplayDenom(allowedPaymentDenoms[0])

  useEffect(() => {
    if (!onChange) return
    onChange({
      price: { denom: allowedPaymentDenoms[0], amount: priceInput },
    })
  }, [priceInput, allowedPaymentDenoms, onChange])

  return (
    <LockupActionCardValue
      className="from-palette-green/0 to-palette-green/20 flex flex-col bg-gradient-to-r lg:flex-row "
      leftContent={
        <div className="flex flex-col gap-4">
          <span className="flex h-[36px] items-center">
            <Icon name="solid:tag" className="mr-3 text-base" />
            sale price
          </span>
        </div>
      }
      leftClassName="opacity-100 text-palette-green"
      rightContent={
        <div className="text-palette-green flex flex-col gap-4 text-[24px] font-bold">
          <span className="relative flex items-center self-end">
            <LockupPremiumSelect
              value={premium}
              onChange={handlePremiumChange}
              presets={[10, 20, 50]}
              defaultCustom={50}
            />

            <StyledText
              as="input"
              type="text"
              variant="input.text"
              aria-label="Price"
              autoFocus
              value={priceInput}
              min={0}
              step="any"
              onChange={(e) => handlePriceChange(e.target.value)}
              className="border-palette-beige text-palette-beige focus:border-palette-beige mr-1 h-[36px] max-w-[120px] [appearance:textfield] bg-none px-2 text-center
              text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder={base > 0 ? "0.0" : "N/A"}
            />
            {priceDisplayDenom}
          </span>
          <div>
            <StyledText
              as="p"
              className="font-inter text-end text-[10px] text-white"
            >
              {(() => {
                const numericPrice = Number(priceInput.replace(",", "."))
                if (!Number.isFinite(numericPrice) || numericPrice <= 0)
                  return null

                const usdValue = numericPrice * atomPrice
                return (
                  <span className="opacity-80">
                    (~${usdValue ? usdValue.toFixed(2) : "N/A"} USD)
                  </span>
                )
              })()}
            </StyledText>
            <StyledText
              as="p"
              className="font-inter text-end text-[10px] text-white"
            >
              {lowestComparable !== "0" ? (
                <>
                  <span className="opacity-60">
                    The lowest price for comparable lockups <br /> right now is
                  </span>{" "}
                  <span>
                    {lowestComparable} {priceDisplayDenom}
                  </span>
                </>
              ) : (
                <span className="opacity-60">No comparable lockups found</span>
              )}
            </StyledText>
          </div>
        </div>
      }
    />
  )
}

export default LockupActionCardPrice
