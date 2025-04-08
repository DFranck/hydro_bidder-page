"use client"

import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"

import { getClaimableStakingRewardsSummary } from "../functions/getTokenizeShareRewards"
import { signClaimTokenizedRewards } from "../transactions/signClaimTokenizedRewards"
import { useIncompleteNotices } from "../useIncompleteNotices"

export function ClaimStakingRewards() {
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { hubChain, hubSigner } = useIncompleteNotices()
  const [stakingRewardsAmount, setStakingRewardsAmount] = useState("0.000000")
  const [usdcAmount, setUsdcAmount] = useState("0.00")
  const { toasts, setToasts } = useToasts()
  const { address, getRpcEndpoint } = useChain("cosmoshub")
  console.log("Mounting ClaimStakingRewards")

  useEffect(() => {
    const fetchRewards = async () => {
      if (!address) return

      const endpoint = await getRpcEndpoint()
      const rpc = typeof endpoint === "string" ? endpoint : endpoint.url

      const rewards = await getClaimableStakingRewardsSummary(rpc, address)
      console.log("rewards", rewards)
      if (rewards) {
        setStakingRewardsAmount(rewards.totalAtom.toFixed(2))
        setUsdcAmount(rewards.totalUsd.toFixed(2))
      }
    }

    fetchRewards()
  }, [address, getRpcEndpoint])

  const handleClaim = async () => {
    try {
      setIsClaiming(true)
      setToasts([toastMessages.claimingRewards])

      if (!hubSigner) {
        throw new Error("hubSigner is not defined")
      }

      await signClaimTokenizedRewards(hubChain, hubSigner)

      setIsCelebrating(true)
      setToasts([toastMessages.claimingRewardsSuccess])
    } catch (err: any) {
      setToasts([toastMessages.claimingRewardsError(err)])
    } finally {
      setIsClaiming(false)
    }
  }
  if (!address) {
    console.log("No address")
    return null
  }
  return (
    <div className="bg-surfaceSecondary flex w-fit items-center justify-between gap-4 rounded-2xl p-2">
      <StyledText variant="label" className="text-sm font-bold">
        Staking Rewards: {stakingRewardsAmount} ATOM ({usdcAmount} USD)
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
