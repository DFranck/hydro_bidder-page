'use client'

import { Card } from '@/components/Card'
import { Icon } from '@/components/Icon'
import { ModalWindow } from '@/components/ModalWindow'
import { toastMessages } from '@/components/ToastMessages'
import { useToasts } from '@/components/Toasts'
import {
  alreadyVotedForBidTooltip,
  castVoteForBidTooltip,
  changeVoteTooltip,
  connectWalletToVoteTooltip,
  extendLockupsToVoteTooltip,
  lockAtomToVoteTooltip,
  lockupLimitReachedByNetworkTooltip,
  noVotingPowerAvailableTooltip,
  votingInProgressTooltip,
} from '@/components/ToolTips'
import { executeWalletVote } from '@/contract-apis/executeWalletVote'
import { useGlobalLockupCapacityInfo } from '@/contract-apis/useGlobalLockupCapacityInfo'
import { revalidateTag } from '@/lib/revalidateTag'
import { useChain } from '@cosmos-kit/react'
import { useVoteButtonFocus } from '@v2/components/BidWrapper'
import { InternalLink } from '@v2/components/InternalLink'
import { Tooltipped } from '@v2/components/Tooltipped'
import { useDoubleTapProtection } from '@v2/hooks/useDoubleTapProtection'
import { useHydroConfettiCannon } from '@v2/hooks/useHydroConfettiCannon'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { SourceID } from '@v2/types'
import { useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

interface VoteButtonProps extends React.ComponentProps<'div'> {
  bidId: number
  sourceId: string
  onVote?: () => void
}

export function VoteButton({
  bidId,
  sourceId,
  onVote,
  className,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  ...otherProps
}: VoteButtonProps) {
  const [isChangeVoteModalOpen, setIsChangeVoteModalOpen] = useState(false)
  const [
    isTryingToVoteWithExpiredLockups,
    setIsTryingToVoteWithExpiredLockups,
  ] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toasts, setToasts } = useToasts()
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state
  const { blastConfetti } = useHydroConfettiCannon()
  const {
    setIsVoteButtonHovered: setVoteButtonHovered,
    setIsVoteButtonFocused: setVoteButtonFocused,
  } = useVoteButtonFocus()

  const {
    data: { lockedAtomTotalGlobal, lockedAtomMaxGlobal },
  } = useGlobalLockupCapacityInfo()

  const { getSigningCosmWasmClient, address, isWalletConnected, connect } =
    useChain('neutron')

  const sourceData = currentRoundDataPerSource?.[sourceId as SourceID]
  const bid = sourceData?.augmentedBids?.find((bid: any) => bid.id === bidId)
  const voteButtonData = bid?.voteButtonData
  const lockups = sourceData?.lockups ?? []

  const isLoadingState =
    toasts.some((toast) => toast.variant === 'working') || isLoading

  const connectWalletProtection = useDoubleTapProtection(async () => {
    await connect()
  })

  const expiredLockupsProtection = useDoubleTapProtection(() => {
    setIsTryingToVoteWithExpiredLockups(true)
  })

  const noValidLockupsProtection = useDoubleTapProtection(() => {
    setIsTryingToVoteWithExpiredLockups(true)
  })

  const voteProtection = useDoubleTapProtection(() => {
    executeVote()
  })

  const changeVoteProtection = useDoubleTapProtection(() => {
    setIsChangeVoteModalOpen(true)
  })

  // Helper function to create tooltips with action footnotes
  function createTooltipWithMobileNote(
    message: string | React.ReactNode,
    action?: string,
  ) {
    if (!action) {
      return message
    }

    return (
      <div className="gap-y-tight flex flex-col">
        <div>{message}</div>
        <div className="footnote text-xs">
          <span className="can-hover:inline can-hover:block cannot-hover:hidden">
            Click to {action}
          </span>
          <span className="can-hover:hidden cannot-hover:inline cannot-hover:block">
            Tap again to {action}
          </span>
        </div>
      </div>
    )
  }

  async function executeVote() {
    if (!bid || !address) {
      return
    }

    try {
      setIsLoading(true)
      setToasts([toastMessages.votingInProgress])

      await executeWalletVote({
        getSigningCosmWasmClient,
        address,
        proposalId: Number(bidId),
        trancheId: Number(bid.trancheId),
        lockups,
      })

      await revalidateTag('backendData')

      blastConfetti()

      setToasts([toastMessages.votingSuccess])

      onVote?.()
    } catch (err: any) {
      setToasts([toastMessages.votingError(err as Error)])
    } finally {
      setIsLoading(false)
      setIsChangeVoteModalOpen(false)
    }
  }

  let buttonProps = {
    onClick: undefined as React.MouseEventHandler | undefined,
    tooltip: undefined as React.ReactNode,
    disabled: false,
    isLink: false,
    href: undefined as string | undefined,
  }

  if (!isWalletConnected) {
    buttonProps = {
      onClick: connectWalletProtection.handleClick,
      tooltip: createTooltipWithMobileNote(
        connectWalletToVoteTooltip,
        'connect',
      ),
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (isLoadingState) {
    buttonProps = {
      onClick: undefined,
      tooltip: votingInProgressTooltip,
      disabled: true,
      isLink: false,
      href: undefined,
    }
  } else if (
    voteButtonData?.votingPowerAvailableByTrancheId[bid?.trancheId ?? 0] === 0
  ) {
    buttonProps = {
      onClick: undefined,
      tooltip:
        lockedAtomTotalGlobal >= lockedAtomMaxGlobal
          ? lockupLimitReachedByNetworkTooltip
          : createTooltipWithMobileNote(
              noVotingPowerAvailableTooltip,
              'lock ATOM',
            ),
      disabled: lockedAtomTotalGlobal >= lockedAtomMaxGlobal,
      isLink: true,
      href: '/lock-atom',
    }
  } else if (!voteButtonData?.hasLockupThatExtendsBidsDeploymentDuration) {
    buttonProps = {
      onClick: expiredLockupsProtection.handleClick,
      tooltip: createTooltipWithMobileNote(
        extendLockupsToVoteTooltip,
        'extend lockups',
      ),
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (voteButtonData?.validLockups.length === 0) {
    buttonProps = {
      onClick: noValidLockupsProtection.handleClick,
      tooltip: createTooltipWithMobileNote(lockAtomToVoteTooltip, 'lock ATOM'),
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (voteButtonData?.hasVotedForThisBid) {
    buttonProps = {
      onClick: undefined,
      tooltip: alreadyVotedForBidTooltip,
      disabled: true,
      isLink: false,
      href: undefined,
    }
  } else if (voteButtonData?.hasVotedElsewhere) {
    buttonProps = {
      onClick: changeVoteProtection.handleClick,
      tooltip: createTooltipWithMobileNote(changeVoteTooltip, 'change vote'),
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else {
    buttonProps = {
      onClick: voteProtection.handleClick,
      tooltip: createTooltipWithMobileNote(castVoteForBidTooltip, 'vote'),
      disabled: false,
      isLink: false,
      href: undefined,
    }
  }

  function renderButtonContent() {
    const buttonElement = (
      <div
        ref={voteProtection.ref as React.RefObject<HTMLDivElement>}
        role="button"
        tabIndex={0}
        onMouseEnter={(e) => {
          setVoteButtonHovered(true)
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          setVoteButtonHovered(false)
          onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          setVoteButtonFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          // Reset all counters when element loses focus
          connectWalletProtection.resetCounter()
          expiredLockupsProtection.resetCounter()
          noValidLockupsProtection.resetCounter()
          voteProtection.resetCounter()
          changeVoteProtection.resetCounter()
          setVoteButtonFocused(false)
          onBlur?.(e)
        }}
        onClick={buttonProps.onClick}
        className={twMerge(
          'btn centered',
          'flex items-center justify-center',
          'transition-all',
          'px-standard',
          'text-inherit',
          'text-shadow-none',
          buttonProps.disabled && 'pointer-events-none',
          className,
        )}
        {...otherProps}
      >
        <span
          className={twJoin(
            'size-8',
            '-translate-x-1/2 -translate-y-1/2',
            'absolute top-1/2 left-1/2',
          )}
        >
          <span
            className={twJoin(
              'label flex scale-0',
              'absolute inset-0',
              'rounded-full',
              'border-foreground border border-dashed',
              'items-center justify-center',
              'transition-all',
              'has-not-voted-within:scale-100',
              'is-vote-focused:scale-0',
              'is-vote-focused-elsewhere:scale-0!',
              'text-[6px]',
            )}
          >
            Vote
          </span>

          <span
            className={twJoin(
              'absolute inset-0 z-10',
              'flex items-center justify-center',
              'transition-all',
              'is-voted-on:scale-0',
              'has-not-voted-within:scale-0',
              'has-not-voted-within:is-vote-focused-elsewhere:scale-100',
              'is-change-vote-focused-elsewhere:scale-100',
              'is-change-vote-focused:scale-200!',
              'is-change-vote-focused:animate-spin',
              'is-vote-focused:scale-200!',
              'is-vote-focused:animate-spin',
            )}
          >
            <Icon name="light:circle-dashed" />
          </span>

          <span
            className={twJoin(
              'centered z-10',
              'transition-all',
              'hidden',
              'is-voted-on:flex',
              'is-voted-on:scale-200',
              'is-voted-on:is-change-vote-focused-elsewhere:scale-0',
              'is-vote-focused:flex',
              'is-vote-focused:scale-150',
              'is-change-vote-focused:flex',
              'is-change-vote-focused:scale-150',
            )}
          >
            <Icon name="solid:circle" />
          </span>

          <span
            className={twJoin(
              'z-10 transition-all',
              'absolute top-1/2 left-1/2',
              '-translate-x-1/2 -translate-y-1/2',
              'scale-0 opacity-0',
              'is-voted-on:scale-100',
              'is-voted-on:opacity-100',
              'is-voted-on:is-change-vote-focused-elsewhere:scale-0',
              'is-voted-on:is-change-vote-focused-elsewhere:opacity-0',
              'is-vote-focused:scale-100',
              'is-vote-focused:opacity-100',
              'is-change-vote-focused:scale-100',
              'is-change-vote-focused:opacity-100',
              'text-background',
            )}
          >
            <Icon name="solid:check" />
          </span>

          <span
            className={twJoin(
              'glow z-0',
              'scale-0 opacity-0',
              'is-vote-focused:scale-300',
              'is-vote-focused:opacity-100',
              'is-change-vote-focused:scale-300',
              'is-change-vote-focused:opacity-100',
              'is-voted-on:scale-300',
              'is-voted-on:opacity-100',
              'is-voted-on:is-change-vote-focused-elsewhere:scale-0',
              'is-voted-on:is-change-vote-focused-elsewhere:opacity-0',
            )}
          />
        </span>
      </div>
    )

    if (buttonProps.isLink && buttonProps.href) {
      return (
        <InternalLink href={buttonProps.href} className="h-full w-full">
          {buttonElement}
        </InternalLink>
      )
    }

    return buttonElement
  }

  return (
    <>
      <div className="relative size-10">
        <Tooltipped tip={buttonProps.tooltip} className="size-10">
          {renderButtonContent()}
        </Tooltipped>
      </div>

      <ModalWindow
        isOpen={isChangeVoteModalOpen}
        onClose={() => setIsChangeVoteModalOpen(false)}
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
            <button onClick={executeVote} className="btn btn-primary">
              Change
            </button>
            <button
              onClick={() => setIsChangeVoteModalOpen(false)}
              className="btn btn-secondary"
            >
              Don&rsquo;t Change
            </button>
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
            <InternalLink href="/lockups" className="btn btn-primary">
              Extend Lockups
            </InternalLink>
            <button
              onClick={() => setIsTryingToVoteWithExpiredLockups(false)}
              className="btn btn-secondary"
            >
              Close
            </button>
          </Card.Footer>
        </Card>
      </ModalWindow>
    </>
  )
}
