"use client"

import { Listing } from "@/app/ts_types/MarketplaceBase.types"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import type { AugmentedLockup } from "@/contract-apis/types"
import { usePathname, useRouter } from "next/navigation"
import type { MarketplaceLockup } from "../../marketplace/types"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { LockupActionCard } from "./LockupActionCard"

function toHumanAmount(amount: number, denom: string, exponent?: number) {
  const exp = exponent ?? getDenomExponent(denom) ?? 6
  return amount / Math.pow(10, exp)
}

export function ListingSuccessModal({
  open,
  onClose,
  lockup,
  listing,
}: {
  open: boolean
  onClose: () => void
  lockup?: AugmentedLockup | MarketplaceLockup
  listing?: Listing
}) {
  const pathname = usePathname()
  const action = "unlist"
  const handleChange = () => {}
  const router = useRouter()
  return (
    <ModalWindow
      isOpen={open}
      onClose={onClose}
      className="max-w-[98%]"
      propsForBackdrop={{
        className: "bg-black/30 backdrop-blur-sm",
      }}
    >
      <div className="border-palette-green rounded-xl border-2 bg-black p-0">
        <div className="h-[48px] gap-[10px] rounded-t-xl bg-[#FFE1B81A] px-6 py-3 text-lg">
          <h2 className="font-inter text-[18px] leading-6 font-bold">
            Lockup listed successfully
          </h2>
        </div>
        <div className="space-y-6 p-[24px] ">
          <LockupActionCard
            lockup={lockup as AugmentedLockup | MarketplaceLockup}
            action={action}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-4 px-[24px] pb-[24px]">
          <StyledText
            as="button"
            variant="button.secondary"
            type="button"
            className="border-none"
            onClick={onClose}
          >
            Close
          </StyledText>
          <StyledText
            as="button"
            variant="button.primary"
            type="button"
            onClick={() => {
              onClose()
              if (!pathname?.includes("marketplace"))
                router.push(`/lockups/marketplace`)
            }}
          >
            View on the marketplace
          </StyledText>
        </div>
      </div>
    </ModalWindow>
  )
}
