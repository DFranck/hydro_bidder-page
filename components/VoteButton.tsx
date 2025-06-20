"use client"

import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText, StyledTextVariant } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  extendLockupsToVoteTooltip,
  lockAtomToVoteTooltip,
  lockupLimitReachedByNetworkTooltip,
} from "@/components/ToolTips"
import { Wallet } from "@/components/wallet/Wallet"
import { executeWalletVote } from "@/contract-apis/executeWalletVote"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useState } from "react"

export function VoteButton({
  bidId,
  size,
}: {
  bidId: number
  size?: "large" | "small"
}) {
  const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
  const [
    isTryingToVoteWithExpiredLockups,
    setIsTryingToVoteWithExpiredLockups,
  ] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { toasts, setToasts } = useToasts()
  const {
    address,
    bidsInfo,
    currentRoundEndDate,
    currentRoundId,
    isWalletConnected,
    lockups,
    votesByRoundId,
    votingPowerAvailableByTrancheId,
    lockedAtomEpochInNanos,
  } = useBackendData()

  const { lockedAtomTotalGlobal, lockedAtomMaxGlobal } =
    useGlobalLockupCapacityInfo()

  const { getSigningCosmWasmClient } = useChain("neutron")
  const bid = bidsInfo[bidId]

  const hasLockupThatExtendsBidsDeploymentDuration = lockups.some((lockup) => {
    if (!bid || lockup.isExpired) return false

    const nextRoundEligibleToVote = Number(
      lockup.metaDataByTrancheId[bid.trancheId].nextRoundEligibleToVote
    )

    if (nextRoundEligibleToVote > currentRoundId) return false

    // Calculate required power round id
    const powerRequiredRoundId = currentRoundId + bid.duration - 1

    // Calculate round end time in nanoseconds
    const currentRoundEndTime = currentRoundEndDate.getTime() * 1e6 // convert to nanoseconds
    const roundLength = lockedAtomEpochInNanos // Using epoch length as round length
    const powerRequiredRoundEnd =
      currentRoundEndTime +
      (powerRequiredRoundId - currentRoundId) * roundLength

    // Check if lockup end time is >= power required round end
    const lockEndTime = lockup.dateEnd.getTime() * 1e6 // Convert milliseconds to nanoseconds

    return lockEndTime >= powerRequiredRoundEnd
  })

  const votesThisRound = votesByRoundId[currentRoundId] ?? []
  const votesThisTranche = votesThisRound.filter(
    (vote) => bidsInfo[vote.bidId]?.trancheId === bid?.trancheId
  )
  const hasVotedInThisTranche = votesThisTranche.length > 0
  const hasVotedForThisBid = votesThisTranche.some(
    (vote) => vote.bidId === bidId
  )
  const isLoading = toasts.some((toast) => toast.variant === "working")
  const validLockups = lockups.filter(
    (lockup) =>
      (lockup.metaDataByTrancheId[bid?.trancheId]?.nextRoundEligibleToVote ??
        Infinity) <= currentRoundId
  )

  async function handleClickVote() {
    if (!bid) {
      return
    }

    try {
      setToasts([toastMessages.votingInProgress])

      await executeWalletVote({
        getSigningCosmWasmClient,
        address: address!,
        proposalId: Number(bidId),
        trancheId: Number(bid.trancheId),
        lockups,
      })

      await revalidateTag("backendData")

      setIsCelebrating(true)

      setToasts([toastMessages.votingSuccess])
    } catch (err: any) {
      setToasts([toastMessages.votingError(err as Error)])
    } finally {
      setOpenChangeVoteModal(false)
    }
  }

  let Button = null

  if (!isWalletConnected) {
    Button = (
      <Wallet
        variant={`button.primary${size ? `.${size}` : ""}` as StyledTextVariant}
        ignoreStatus={true}
      />
    )
  } else if (isLoading) {
    Button = (
      <StyledText
        variant={
          `button.secondary${size ? `.${size}` : ""}` as StyledTextVariant
        }
        as="button"
        disabled
      >
        Loading...
      </StyledText>
    )
  } else if (votingPowerAvailableByTrancheId[bid.trancheId] === 0) {
    Button = (
      <ConditionalWrapper
        condition={lockedAtomTotalGlobal >= lockedAtomMaxGlobal}
        wrapper={(children) => (
          <Tooltip tipContents={lockupLimitReachedByNetworkTooltip}>
            <div className="pointer-events-none opacity-60">{children}</div>
          </Tooltip>
        )}
      >
        <StyledText
          as={Link}
          href="/lock-atom"
          variant={
            `button.primary${size ? `.${size}` : ""}` as StyledTextVariant
          }
        >
          Lock ATOM to Vote
        </StyledText>
      </ConditionalWrapper>
    )
  } else if (!hasLockupThatExtendsBidsDeploymentDuration) {
    Button = (
      <Tooltip tipContents={extendLockupsToVoteTooltip}>
        <StyledText
          variant={
            `button.neutral${size ? `.${size}` : ""}` as StyledTextVariant
          }
          as="button"
          onClick={() => setIsTryingToVoteWithExpiredLockups(true)}
        >
          <Icon name="solid:rotate-right" />
          <span>Extend Lockups to Vote</span>
          <Icon name="circle-info" />
        </StyledText>
      </Tooltip>
    )
  } else if (validLockups.length === 0) {
    Button = (
      <Tooltip tipContents={lockAtomToVoteTooltip}>
        <StyledText
          variant={
            `button.neutral${size ? `.${size}` : ""}` as StyledTextVariant
          }
          as="button"
          onClick={() => setIsTryingToVoteWithExpiredLockups(true)}
        >
          <Icon name="solid:rotate-right" />
          <span>Lock ATOM to Vote</span>
          <Icon name="circle-info" />
        </StyledText>
      </Tooltip>
    )
  } else if (hasVotedForThisBid) {
    Button = (
      <StyledText
        variant={`button.neutral${size ? `.${size}` : ""}` as StyledTextVariant}
        as="button"
        className="pointer-events-none"
      >
        <Icon name="solid:check" />
        <span>Your Pick!</span>
      </StyledText>
    )
  } else {
    const hasVotedElsewhere = hasVotedInThisTranche && !hasVotedForThisBid
    Button = (
      <StyledText
        as="button"
        onClick={() => {
          if (hasVotedElsewhere) {
            setOpenChangeVoteModal(true)
          } else {
            handleClickVote()
          }
        }}
        variant={
          `button.${hasVotedElsewhere ? "secondary" : "primary"}${size ? `.${size}` : ""}` as StyledTextVariant
        }
      >
        <Icon name={`solid:${hasVotedElsewhere ? "pencil" : "circle-check"}`} />
        <span>{hasVotedElsewhere ? "Change Vote" : "Vote for Project"}</span>
      </StyledText>
    )
  }

  return (
    <>
      <ModalWindow
        isOpen={openChangeVoteModal}
        onClose={() => setOpenChangeVoteModal(false)}
      >
        <Card>
          <Card.Body>
            <div className="text-balance">
              Changing your vote will reallocate your total available voting
              power to the selected bid. Keep in mind that your available voting
              power will be allocated to this bid for the duration of the
              liquidity deployment.
            </div>
          </Card.Body>
          <Card.Footer>
            <StyledText
              as="button"
              onClick={handleClickVote}
              variant="button.primary"
            >
              Change
            </StyledText>
            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() => setOpenChangeVoteModal(false)}
            >
              Don&rsquo;t Change
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>

      <ModalWindow
        isOpen={isTryingToVoteWithExpiredLockups}
        onClose={() => setIsTryingToVoteWithExpiredLockups(false)}
      >
        <Card>
          <Card.Header title="Edit Your Lockups to Vote" />
          <Card.Body>
            <div className="prose prose-invert">
              <p>
                This project requires a longer lockup because its PoL duration
                spans multiple months. To vote for this project, the duration of
                your lockup must match or exceed its PoL duration. Keep in mind,
                if you vote for a longer deployment:
              </p>

              <ul>
                <li>
                  your voting power will be tied up for the duration of that
                  deployment.
                </li>
                <li>
                  you will need to create a new lockup to vote in the next
                  round.
                </li>
              </ul>
            </div>
          </Card.Body>
          <Card.Footer>
            <StyledText as={Link} href="/lockups" variant="button.primary">
              Extend Lockups
            </StyledText>
            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() => setIsTryingToVoteWithExpiredLockups(false)}
            >
              Close
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />

      {Button}
    </>
  )
}
