"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useEffect, useState } from "react"
import { useMarketplaceData } from "../../marketplace/context/MarketplaceDataProvider"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getAllowedPaymentDenoms } from "../../utils/getAllowedPaymentDenoms"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { LockupActionPayloadFor } from "../types"
import { getLowestComparablePrice } from "../utils/getLowestComparablePrice"
import LockupActionCardValue from "./LockupActionCardValue"

type LockupActionCardPriceProps<L extends AugmentedLockup | MarketplaceLockup> =
  {
    lockup: L
    onChange?: (values: Partial<LockupActionPayloadFor<"list">>) => void
  }

const LockupActionCardPrice = <L extends AugmentedLockup | MarketplaceLockup>({
  lockup,
  onChange,
}: LockupActionCardPriceProps<L>) => {
  const collections = useBackendData().collections
  const { marketplaceLockups } = useMarketplaceData()
  const isListed = isListedMarketplaceLockup(lockup)

  const [priceInput, setPriceInput] = useState<string>(
    String(
      isListed
        ? formatDenomAmount(
            lockup.listing.price.amount,
            getDenomExponent(lockup.listing.price.denom),
          )
        : lockup.funds.amount,
    ),
  )

  const allowedPaymentDenoms = getAllowedPaymentDenoms(collections)
  const lowestComparable = formatDenomAmount(
    getLowestComparablePrice(marketplaceLockups, lockup) || "",
    getDenomExponent(allowedPaymentDenoms[0]),
  )
  const priceDisplayDenom = getDisplayDenom(allowedPaymentDenoms[0])
  useEffect(() => {
    onChange?.({
      price: {
        denom: allowedPaymentDenoms[0],
        amount: priceInput,
      },
    })
  }, [lockup.funds.denom, priceInput, onChange])

  return (
    <LockupActionCardValue
      className="bg-gradient-to-r from-palette-green/0 to-palette-green/20 "
      leftContent={
        <div className={`flex flex-col gap-4`}>
          <span className="flex h-[36px] items-center">
            <Icon name="solid:tag" className={`mr-3 text-base `} />
            sale price
          </span>
        </div>
      }
      leftClassName="opacity-100 text-palette-green"
      rightContent={
        <div
          className={`flex flex-col gap-4 text-[24px] font-bold text-palette-green`}
        >
          <span className="relative flex items-center self-end">
            <StyledText
              as="input"
              type="number"
              variant="input.text"
              aria-label="Price"
              autoFocus
              value={priceInput}
              min={1}
              step={1}
              onChange={(e) => setPriceInput(e.target.value)}
              className="mr-1 h-[36px] max-w-[100px] border-palette-beige bg-none px-2 text-center text-2xl text-palette-beige [appearance:textfield]
              focus:border-palette-beige [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Price"
            />

            {priceDisplayDenom}
          </span>{" "}
          <StyledText
            as="p"
            className="text-end font-inter text-[10px] text-white"
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
      }
    />
  )
}

export default LockupActionCardPrice
