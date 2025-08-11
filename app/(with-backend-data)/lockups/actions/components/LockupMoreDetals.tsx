"use client"

import { CollapsibleBox } from "@/components/CollapsibleBox"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { useState } from "react"
import { MarketplaceLockup } from "../../marketplace/types"
import LockupActionCardValue from "./LockupActionCardValue"

export function LockupMoreDetails({ lockup }: { lockup: AugmentedLockup | MarketplaceLockup }) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div className="hidden md:block">
      <StyledText
      as={"button"}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full cursor-pointer"
      >
      <LockupActionCardValue
        icon={isCollapsed ? "chevron-down" : "chevron-up"}
        leftContent={isCollapsed ? 'Show more details' : 'Hide details'}
        leftClassName="items-center cursor-pointer"
      />
      </StyledText>

      <CollapsibleBox
        isCollapsed={isCollapsed}
        
      >
        <li className="hidden md:block">
          <LockupActionCardValue
            icon="bolt"
            leftContent="voting power"
            leftClassName="items-center"
            rightContent={formatAmount(lockup.currentVotingPower, 6, 2)}
          />
        </li>

        <li className="hidden md:block">
          <LockupActionCardValue
            icon="fingerprint"
            leftContent="lock id"
            leftClassName="items-center"
            rightContent={lockup.id}
          />
        </li>
      </CollapsibleBox>
    </div>
  )
}
