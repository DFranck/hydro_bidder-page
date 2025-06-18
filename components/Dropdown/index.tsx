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
} from "../ToolTips"
import { useAmountOfTokenInWallet } from "@/contract-apis/useAmountOfTokenInWallet"

export function DropdownMenuButton({
  handleStAtom,
  handleDAtom,
}: {
  handleStAtom: () => void
  handleDAtom: () => void
}) {
  const { isWalletConnected, lockedTokenPercentageWallet } = useBackendData()
  const { lockedTokenPercentageGlobal } = useGlobalLockupCapacityInfo()
  const amountOfdAtomInWallet = useAmountOfTokenInWallet("dATOM")
  const amountOfsTAtomInWallet = useAmountOfTokenInWallet("stATOM")

  const { push } = useRouter()

  const MENU_ITEMS = [
    {
      label: "stATOM",
      action: () => handleStAtom(),
      isDisabled: amountOfsTAtomInWallet === 0,
      cta: {
        label: "Get stATOM",
        href: "https://go.skip.build/?src_asset=ibc%2FB7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C&src_chain=neutron-1&dest_asset=ibc%2F27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2&dest_chain=stride-1&amount_in=&amount_out=",
      },
    },
    {
      label: "dATOM",
      action: () => handleDAtom(),
      isDisabled: amountOfdAtomInWallet === 0,
      cta: {
        label: "Get dtATOM",
        href: "https://go.skip.build/?src_asset=ibc%2FB7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C&src_chain=neutron-1&dest_asset=ibc%2F27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2&dest_chain=stride-1&amount_in=&amount_out=",
      },
    },
    {
      label: "Staked ATOM",
      action: () => push("/lock-atom"),
      isDisabled:
        !isWalletConnected ||
        lockedTokenPercentageWallet === 100 ||
        lockedTokenPercentageGlobal === 100,
      cta: {
        label: "Stake ATOM",
        href: "https://www.mintscan.io/cosmos",
      },
    },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StyledText as={"span"} variant="button.primary">
          New Lockup
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
                    className="w-auto"
                    classNamesForTooltip="sm:-ml-12"
                    tipContents={
                      !isWalletConnected
                        ? needsWalletConnectionTooltip
                        : lockedTokenPercentageWallet === 100
                          ? lockupLimitReachedByUserTooltip
                          : lockupLimitReachedByNetworkTooltip
                    }
                  >
                    <div className="pointer-events-none cursor-not-allowed opacity-50">
                      {children}
                    </div>
                  </Tooltip>
                )}
              >
                <StyledText onClick={item.isDisabled ? () => {} : item.action}>
                  Lock {item.label}
                </StyledText>
              </ConditionalWrapper>
            </div>

            <StyledText
              as={Link}
              variant="button.secondary"
              href={item.cta.href}
              target="_blank"
            >
              {item.cta.label}
            </StyledText>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
