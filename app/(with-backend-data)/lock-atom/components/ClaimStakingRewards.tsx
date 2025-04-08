"use client"

import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"

import { Tooltip } from "@/components/Tooltip"
import { claimStakingRewardsTooltip } from "@/components/ToolTips"
import { getClaimableStakingRewardsSummary } from "../functions/getTokenizeShareRewards"
import { signClaimTokenizedRewards } from "../transactions/signClaimTokenizedRewards"
import { useIncompleteNotices } from "../useIncompleteNotices"

export function ClaimStakingRewards() {
  const { hubChain, hubSigner } = useIncompleteNotices()
  const { toasts, setToasts } = useToasts()
  const { address, getRpcEndpoint } = useChain("cosmoshub")

  const [isLoadingRewards, setIsLoadingRewards] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [isClaimable, setIsClaimable] = useState(false)
  const [showUsd, setShowUsd] = useState(false)
  const [stakingRewardsAmount, setStakingRewardsAmount] = useState("0.000000")
  const [usdcAmount, setUsdcAmount] = useState("0.00")

  useEffect(() => {
    const fetchRewards = async () => {
      if (!address) return

      try {
        const endpoint = await getRpcEndpoint()
        const rpc = typeof endpoint === "string" ? endpoint : endpoint.url

        const rewards = await getClaimableStakingRewardsSummary(rpc, address)
        if (rewards) {
          setStakingRewardsAmount(rewards.totalAtom.toFixed(2))
          setUsdcAmount(rewards.totalUsd.toFixed(2))
          setIsClaimable(rewards?.totalAtom > 0)
        }
      } finally {
        setIsLoadingRewards(false)
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

  if (!address) return null

  return (
    <div className="bg-surfaceSecondary flex w-fit items-center justify-between gap-4 rounded-2xl p-2">
      <Tooltip tipContents={claimStakingRewardsTooltip}>
        <div className="flex items-center gap-1">
          <StyledText variant="label" className="text-sm font-bold">
            {isLoadingRewards ? (
              <span className="flex items-center gap-2">
                <Icon name="spinner" spin className="text-sm" />
                <span>Fetching rewards...</span>
              </span>
            ) : isClaimable ? (
              <StyledText
                className="flex flex-col text-start"
                onClick={() => setShowUsd((prev) => !prev)}
              >
                <span className="text-muted text-xs">Staking Rewards</span>
                <span className="text-base font-bold text-white">
                  {showUsd ? `$${usdcAmount}` : `${stakingRewardsAmount} ATOM`}
                </span>
              </StyledText>
            ) : (
              "No staking rewards to claim"
            )}
          </StyledText>
          <Icon name="circle-info" className="text-xs " />
        </div>
      </Tooltip>

      <StyledText
        as="button"
        onClick={handleClaim}
        disabled={isClaiming || !isClaimable}
        variant="button.primary"
      >
        {isClaimable && (
          <Icon
            spin={isClaiming}
            name={isClaiming ? "spinner" : "solid:circle-check"}
          />
        )}
        <span>{isClaiming ? "Claiming..." : "Claim"}</span>
      </StyledText>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />
    </div>
  )
}
