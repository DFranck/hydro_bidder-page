"use client"

import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { useState } from "react"

export function StakingRewardsButton() {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { toasts, setToasts } = useToasts()

  const stakingRewardsAmount = 0 // TODO: hook + fetch

  const handleClaim = async () => {
    try {
      setIsClaiming(true)
      setToasts([toastMessages.claimingRewards])

      // TODO: MsgWithdrawAllTokenizeShareRecordReward

      setIsCelebrating(true)
      setToasts([toastMessages.claimingRewardsSuccess])
    } catch (err: any) {
      setToasts([toastMessages.claimingRewardsError(err)])
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="bg-surfaceSecondary flex w-fit items-center justify-between gap-4 rounded-2xl p-2">
      <StyledText variant="label" className="text-sm font-bold">
        Staking Rewards: {stakingRewardsAmount} ATOM
      </StyledText>

      <StyledText
        as="button"
        onClick={handleClaim}
        disabled={isClaiming}
        variant="button.primary"
      >
        <Icon name={isClaiming ? "spinner" : "solid:circle-check"} />
        <span>{isClaiming ? "Claiming..." : "Claim"}</span>
      </StyledText>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />
    </div>
  )
}
