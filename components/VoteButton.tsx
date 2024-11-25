"use client"

import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Confetti } from "@/components/Confetti"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText, StyledTextVariant } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import { networkLimitReachedTooltip } from "@/components/ToolTips"
import { Wallet } from "@/components/wallet/Wallet"
import { executeVote } from "@/contract-apis/executeVote"
import { useContractContext } from "@/contract-apis/useContractContext"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function VoteButton({
  bidId,
  size,
}: {
  bidId: string | number
  size?: "large" | "small"
}) {
  const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { toasts, setToasts } = useToasts()
  const router = useRouter()
  const { isWalletConnected, address, getSigningCosmWasmClient } =
    useChain("neutron")
  const { bidsByRoundId, currentRoundMetadata, globalMetadata } =
    useContractContext()
  const bid = Object.values(bidsByRoundId)
    .flat()
    .find((bid) => bid.id === bidId)
  const hasVotedForAny = currentRoundMetadata.usersVotedBidIds.length > 0
  const hasVotedForBid = currentRoundMetadata.usersVotedBidIds.includes(
    Number(bidId)
  )
  const isLoading = toasts.some((toast) => toast.variant === "working")

  async function handleClickVote() {
    if (!bid) {
      return
    }

    try {
      setToasts([
        {
          isDismissible: false,
          variant: "working",
          message: "Processing your vote...",
        },
      ])

      await executeVote(
        getSigningCosmWasmClient,
        address!,
        Number(bidId),
        Number(bid.tranche)
      )

      setToasts([
        {
          variant: "success",
          message: "Vote submitted. Reloading page...",
        },
      ])

      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err: any) {
      if (err && err?.message && err.message.includes("Request rejected")) {
        setToasts([
          {
            variant: "error",
            message: "Vote rejected",
          },
        ])
        return
      }
      setToasts([
        {
          variant: "error",
          message: "Vote rejected",
        },
      ])
    } finally {
      setOpenChangeVoteModal(false)
      setIsCelebrating(true)
    }
  }

  let Button = null

  if (!isWalletConnected) {
    Button = (
      <Wallet
        variant={`button.primary${size ? `.${size}` : ""}` as StyledTextVariant}
        notifyConnectedCB={() => null}
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
  } else if (currentRoundMetadata.usersVotingPower === 0) {
    Button = (
      <ConditionalWrapper
        condition={
          globalMetadata.totalLockedTokens >= globalMetadata.maxLockedTokens
        }
        wrapper={(children) => (
          <Tooltip tipContents={networkLimitReachedTooltip}>
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
  } else if (hasVotedForBid) {
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
    const hasVotedElsewhere = hasVotedForAny && !hasVotedForBid
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
          <Card.Header title="Change your vote?" />
          <Card.Body>
            Changing your vote will reallocate your total voting power to the
            new project.
          </Card.Body>
          <Card.Footer>
            <StyledText
              as="button"
              onClick={handleClickVote}
              variant="button.primary"
            >
              Change Vote to This Proposal
            </StyledText>
            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() => setOpenChangeVoteModal(false)}
            >
              Don&rsquo;t change my vote
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
