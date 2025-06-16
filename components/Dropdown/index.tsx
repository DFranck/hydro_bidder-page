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

export function DropdownMenuButton() {
  const { isWalletConnected, lockedAtomPercentageWallet } = useBackendData()
  const { lockedAtomPercentageGlobal } = useGlobalLockupCapacityInfo()

  const { push } = useRouter()

  const MENU_ITEMS = [
    {
      label: "stATOM",
      action: () => console.log("stATOM clicked"),
      isDisabled: false,
      cta: {
        label: "Get stATOM",
        href: "https://go.skip.build?src_asset=ibc%2FB7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C&src_chain=neutron-1&dest_asset=ibc%2F27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2&dest_chain=stride-1&amount_in=&amount_out=",
      },
    },
    {
      label: "dATOM",
      action: () => console.log("dATOM clicked"),
      isDisabled: false,
      cta: {
        label: "Get stATOM",
        href: "https://go.skip.build/?src_asset=ibc%2FB7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C&src_chain=neutron-1&dest_asset=ibc%2F27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2&dest_chain=stride-1&amount_in=&amount_out=",
      },
    },
    {
      label: "Staked ATOM",
      action: () => push("/lock-atom"),
      isDisabled:
        !isWalletConnected ||
        lockedAtomPercentageWallet === 100 ||
        lockedAtomPercentageGlobal === 100,
      cta: {
        label: "Stake ATOM",
        href: "https://www.mintscan.io/cosmos",
      },
    },
  ]
  return (
    <DropdownMenu>
      <ConditionalWrapper
        condition={
          !isWalletConnected ||
          lockedAtomPercentageWallet === 100 ||
          lockedAtomPercentageGlobal === 100
        }
        wrapper={(children) => (
          <Tooltip
            classNamesForTooltip="sm:-ml-12"
            tipContents={
              !isWalletConnected
                ? needsWalletConnectionTooltip
                : lockedAtomPercentageWallet === 100
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
        <DropdownMenuTrigger asChild>
          <StyledText as={"span"} variant="button.primary">
            New Lockup
          </StyledText>
        </DropdownMenuTrigger>
      </ConditionalWrapper>
      <DropdownMenuContent className="w-80 bg-black">
        <DropdownMenuSeparator />
        {MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className="flex cursor-pointer justify-between"
          >
            <StyledText onClick={!item.isDisabled ? () => {} : item.action}>
              Lock {item.label}
            </StyledText>
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
