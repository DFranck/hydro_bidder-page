"use client"

import { Coin } from "@cosmjs/stargate"
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"

import { getTokenizeShareRewardsWithClient } from "../functions/getTokenizeShareRewards"

export function ClaimStakingRewards() {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [stakingRewardsAmount, setStakingRewardsAmount] = useState("0.000000")

  const { toasts, setToasts } = useToasts()
  const { address, getRpcEndpoint } = useChain("cosmoshub")

  useEffect(() => {
    const fetchRewards = async () => {
      if (!address) return

      const endpoint = await getRpcEndpoint()
      const rpc = typeof endpoint === "string" ? endpoint : endpoint.url

      const rewards = await getTokenizeShareRewardsWithClient(rpc, address)
      console.log("rewards", rewards)
      const coin = rewards?.total?.find((c: Coin) => c.denom === "uatom")
      if (coin) {
        const parsed = parseInt(coin.amount) / 1_000_000
        setStakingRewardsAmount(parsed.toFixed(2))
      }
    }

    fetchRewards()
  }, [address, getRpcEndpoint])

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
