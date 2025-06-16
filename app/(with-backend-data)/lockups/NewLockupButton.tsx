import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import {
  lockupLimitReachedByNetworkTooltip,
  lockupLimitReachedByUserTooltip,
  needsWalletConnectionTooltip,
} from "@/components/ToolTips"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import Link from "next/link"

export function NewLockupButton() {
  const { isWalletConnected, lockedTokenPercentageWallet } = useBackendData()
  const { lockedTokenPercentageGlobal } = useGlobalLockupCapacityInfo()

  return (
    <ConditionalWrapper
      condition={
        !isWalletConnected ||
        lockedTokenPercentageWallet === 100 ||
        lockedTokenPercentageGlobal === 100
      }
      wrapper={(children) => (
        <Tooltip
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
      <StyledText as={Link} variant="button.primary" href="/lock-atom">
        New Lockup
      </StyledText>
    </ConditionalWrapper>
  )
}
