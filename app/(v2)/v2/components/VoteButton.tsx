'use client'

import { Card } from '@/components/Card'
import { ConditionalWrapper } from '@/components/ConditionalWrapper'
import { Icon } from '@/components/Icon'
import { ModalWindow } from '@/components/ModalWindow'
import { toastMessages } from '@/components/ToastMessages'
import { useToasts } from '@/components/Toasts'
import { Tooltip } from '@/components/Tooltip'
import {
  extendLockupsToVoteTooltip,
  lockAtomToVoteTooltip,
  lockupLimitReachedByNetworkTooltip,
} from '@/components/ToolTips'
import { executeWalletVote } from '@/contract-apis/executeWalletVote'
import { useGlobalLockupCapacityInfo } from '@/contract-apis/useGlobalLockupCapacityInfo'
import { revalidateTag } from '@/lib/revalidateTag'
import { useIsMobile } from '@/lib/useIsMobile'
import { useChain } from '@cosmos-kit/react'
import { InternalLink } from '@v2/components/InternalLink'
import { useHydroConfettiCannon } from '@v2/hooks'
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
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...otherProps
}: VoteButtonProps) {
  const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
  const [
    isTryingToVoteWithExpiredLockups,
    setIsTryingToVoteWithExpiredLockups,
  ] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toasts, setToasts } = useToasts()
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state
  const { blastConfetti } = useHydroConfettiCannon()
  const isMobile = useIsMobile()

  const { lockedAtomTotalGlobal, lockedAtomMaxGlobal } =
    useGlobalLockupCapacityInfo()

  const { getSigningCosmWasmClient, address, isWalletConnected, connect } =
    useChain('neutron')

  const sourceData = currentRoundDataPerSource?.[sourceId as SourceID]
  const bid = sourceData?.augmentedBids?.find((bid: any) => bid.id === bidId)
  const voteButtonData = bid?.voteButtonData
  const lockups = sourceData?.lockups ?? []

  const isLoadingState =
    toasts.some((toast) => toast.variant === 'working') || isLoading

  // Utility function to wrap click handlers with double-tap behavior on mobile
  function withDoubleTapProtection(
    handler: (e: React.MouseEvent) => void | Promise<void>,
  ): React.MouseEventHandler {
    return (e: React.MouseEvent) => {
      e.preventDefault()

      if (!isMobile) {
        // On desktop, execute immediately
        handler(e)
        return
      }

      // On mobile, implement double-tap behavior
      const target = e.currentTarget as HTMLElement
      const lastTapTime = target.dataset.lastTap
      const currentTime = Date.now().toString()

      if (!lastTapTime || Date.now() - parseInt(lastTapTime) > 500) {
        // First tap or taps are too far apart - just focus
        target.dataset.lastTap = currentTime
        target.focus()
        e.stopPropagation()

        // Clear the tap state after 500ms
        setTimeout(() => {
          delete target.dataset.lastTap
        }, 500)

        return
      }

      // Second tap within 500ms - execute the handler
      delete target.dataset.lastTap
      handler(e)
    }
  }

  async function handleClickVote() {
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
      setOpenChangeVoteModal(false)
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
      onClick: withDoubleTapProtection(async () => {
        await connect()
      }),
      tooltip: 'Connect Wallet to Vote',
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (isLoadingState) {
    buttonProps = {
      onClick: undefined,
      tooltip: undefined,
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
          : undefined,
      disabled: lockedAtomTotalGlobal >= lockedAtomMaxGlobal,
      isLink: true,
      href: '/lock-atom',
    }
  } else if (!voteButtonData?.hasLockupThatExtendsBidsDeploymentDuration) {
    buttonProps = {
      onClick: withDoubleTapProtection(() => {
        setIsTryingToVoteWithExpiredLockups(true)
      }),
      tooltip: extendLockupsToVoteTooltip,
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (voteButtonData?.validLockups.length === 0) {
    buttonProps = {
      onClick: withDoubleTapProtection(() => {
        setIsTryingToVoteWithExpiredLockups(true)
      }),
      tooltip: lockAtomToVoteTooltip,
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (voteButtonData?.hasVotedForThisBid) {
    buttonProps = {
      onClick: undefined,
      tooltip: undefined,
      disabled: true,
      isLink: false,
      href: undefined,
    }
  } else {
    const hasVotedElsewhere = voteButtonData?.hasVotedElsewhere ?? false
    buttonProps = {
      onClick: withDoubleTapProtection(() => {
        if (hasVotedElsewhere) {
          setOpenChangeVoteModal(true)
        } else {
          handleClickVote()
        }
      }),
      tooltip: undefined,
      disabled: false,
      isLink: false,
      href: undefined,
    }
  }

  function renderButtonContent() {
    const buttonElement = (
      <div
        role="button"
        tabIndex={0}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={buttonProps.onClick}
        className={twMerge(
          'btn relative h-full w-8',
          'flex items-center justify-center',
          'transition-all',
          'px-standard',
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
              'label hidden',
              'absolute inset-0',
              'rounded-full',
              'border-foreground border border-dashed',
              'items-center justify-center',
              'transition-all',
              'has-not-voted-within:flex',
              'is-vote-focused:scale-0',
              'is-vote-focused-elsewhere:scale-0',
              'text-[6px]',
              'desktop:hidden!',
            )}
          >
            Vote
          </span>

          <span
            className={twJoin(
              'absolute inset-0',
              'flex items-center justify-center',
              'transition-all',
              'is-voted-on:scale-0',
              'has-not-voted-within:scale-0',
              'has-not-voted-within:is-vote-focused-elsewhere:scale-100',
              'is-vote-focused:scale-200!',
              'is-vote-focused:animate-spin',
              'desktop:has-not-voted-within:scale-100',
            )}
          >
            <Icon name="light:circle-dashed" />
          </span>

          <span
            className={twJoin(
              'absolute inset-0 z-10 items-center justify-center',
              'transition-all',
              'hidden',
              'is-voted-on:flex',
              'is-voted-on:scale-200',
              'is-voted-on:text-foreground!',
              'is-voted-on:is-change-vote-focused-elsewhere:scale-0',
              'is-vote-focused:flex',
              'is-vote-focused:scale-150',
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
              'is-voted-on:text-background',
              'is-voted-on:is-change-vote-focused-elsewhere:scale-0',
              'is-voted-on:is-change-vote-focused-elsewhere:opacity-0',
              'is-vote-focused:text-background',
              'is-vote-focused:scale-100',
              'is-vote-focused:opacity-100',
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
      <ConditionalWrapper
        condition={!!buttonProps.tooltip}
        wrapper={(children) => (
          <Tooltip tipContents={buttonProps.tooltip} className="size-10">
            {children}
          </Tooltip>
        )}
      >
        {renderButtonContent()}
      </ConditionalWrapper>

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
            <button onClick={handleClickVote} className="btn btn-primary">
              Change
            </button>
            <button
              onClick={() => setOpenChangeVoteModal(false)}
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
