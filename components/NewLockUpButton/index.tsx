"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StyledText } from "../StyledText"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import { ConditionalWrapper } from "../ConditionalWrapper"
import { Tooltip } from "../Tooltip"
import {
  lockupLimitReachedByNetworkTooltip,
  lockupLimitReachedByUserTooltip,
  needsWalletConnectionTooltip,
  notEnoughTokenInWalletTooltip,
} from "../ToolTips"
import { useAmountOfTokenInWallet } from "@/contract-apis/useAmountOfTokenInWallet"
import { Icon } from "../Icon"
import { cn } from "@/lib/utils"

export function NewLockUpButton({
  handleStAtom,
  handleDAtom,
}: {
  handleStAtom: () => void
  handleDAtom: () => void
}) {
  const {
    isWalletConnected,
    lockedTokenPercentageWallet,
    lockedTokenMaxWallet,
  } = useBackendData()
  const {
    data: { lockedTokenPercentageGlobal, lockedTokenRemainingCapacityGlobal },
  } = useGlobalLockupCapacityInfo()
  const amountOfdAtomInWallet = useAmountOfTokenInWallet("dATOM")
  const amountOfsTAtomInWallet = useAmountOfTokenInWallet("stATOM")

  const { push } = useRouter()

  const tokenLimit = 0.00001

  const verifyLockupCapacity = lockedTokenRemainingCapacityGlobal === 0

  const notEligible = lockedTokenMaxWallet === 0

  const MENU_ITEMS = [
    {
      label: "stATOM",
      action: () => handleStAtom(),
      isDisabled:
        verifyLockupCapacity || amountOfsTAtomInWallet === 0 || notEligible,
      cta: {
        label: "Get",
        href: "https://go.skip.build?src_asset=uatom&src_chain=cosmoshub-4&dest_asset=ibc%2FB7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C&dest_chain=neutron-1&amount_in=&amount_out=",
      },
    },
    {
      label: "dATOM",
      action: () => handleDAtom(),
      isDisabled:
        verifyLockupCapacity || amountOfdAtomInWallet === 0 || notEligible,
      cta: {
        label: "Get",
        href: "https://go.skip.build?src_asset=uatom&src_chain=cosmoshub-4&dest_asset=factory%2Fneutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa%2Fudatom&dest_chain=neutron-1&amount_in=&amount_out=",
      },
    },
    {
      label: "Staked ATOM",
      action: () => push("/lock-atom"),
      isDisabled:
        !isWalletConnected ||
        lockedTokenPercentageWallet === 100 ||
        lockedTokenPercentageGlobal === 100 ||
        notEligible,
      cta: {
        label: "Get",
        href: "https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake",
      },
    },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StyledText as={"span"} variant="button.primary">
          New Lockup
          <Icon name="solid:chevron-down" />
        </StyledText>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black">
        <DropdownMenuSeparator />
        {MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className="flex cursor-pointer justify-between"
          >
            <div className="flex-1">
              <ConditionalWrapper
                condition={item.isDisabled}
                wrapper={(children) => (
                  <Tooltip
                    className={cn("w-auto", {
                      "w-full": item.isDisabled,
                    })}
                    classNamesForTooltip="sm:-ml-12"
                    tipContents={
                      !isWalletConnected
                        ? needsWalletConnectionTooltip
                        : lockedTokenPercentageWallet === 100
                          ? lockupLimitReachedByUserTooltip
                          : !verifyLockupCapacity &&
                              (amountOfdAtomInWallet <= tokenLimit ||
                                amountOfsTAtomInWallet <= tokenLimit)
                            ? notEnoughTokenInWalletTooltip
                            : lockupLimitReachedByNetworkTooltip
                    }
                  >
                    <div className="pointer-events-none cursor-not-allowed opacity-50">
                      {children}
                    </div>
                  </Tooltip>
                )}
              >
                <StyledText
                  as={"span"}
                  variant="button.primary"
                  onClick={item.isDisabled ? () => {} : item.action}
                  className="w-full sm:w-full"
                >
                  Lock {item.label}
                </StyledText>
              </ConditionalWrapper>
            </div>

            <StyledText
              as={Link}
              variant="button.secondary"
              href={item.cta.href}
              target="_blank"
              className="p-2"
            >
              {item.cta.label}
              <Icon name="solid:arrow-up-right" />
            </StyledText>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
