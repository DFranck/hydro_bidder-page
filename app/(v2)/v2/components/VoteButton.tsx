'use client'

import { Card } from '@/components/Card'
import { ConditionalWrapper } from '@/components/ConditionalWrapper'
import { Confetti } from '@/components/Confetti'
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
import { useChain } from '@cosmos-kit/react'
import { InternalLink } from '@v2/components/InternalLink'
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
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toasts, setToasts } = useToasts()
  const { state } = useAppState()
  const { currentRoundDataPerSource } = state

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

      setIsCelebrating(true)

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
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault()
        await connect()
      },
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
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        setIsTryingToVoteWithExpiredLockups(true)
      },
      tooltip: extendLockupsToVoteTooltip,
      disabled: false,
      isLink: false,
      href: undefined,
    }
  } else if (voteButtonData?.validLockups.length === 0) {
    buttonProps = {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        setIsTryingToVoteWithExpiredLockups(true)
      },
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
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        // On mobile, require focus before click (double-tap behavior)
        const target = e.currentTarget as HTMLElement
        if (document.activeElement !== target) {
          target.focus()
          return
        }

        if (hasVotedElsewhere) {
          setOpenChangeVoteModal(true)
        } else {
          handleClickVote()
        }
      },
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
          'group/vote-button',
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
              'absolute inset-0',
              'flex items-center justify-center',
              'transition-all',
              'voted-on:hidden',
              'voted-on:vote-changing:flex',
              'group-hover/vote-button:flex',
              'group-hover/vote-button:scale-200',
              'group-focus/vote-button:scale-200',
              'group-hover/vote-button:animate-spin',
              'group-focus/vote-button:animate-spin',
            )}
          >
            <Icon name="light:circle-dashed" />
          </span>

          <span
            className={twJoin(
              'absolute inset-0 z-10 items-center justify-center',
              'transition-all',
              'hidden',
              'voted-on:flex',
              'voted-on:scale-200',
              'voted-on:text-foreground!',
              'voted-on:vote-changing:scale-0',
              'group-hover/vote-button:flex',
              'group-focus/vote-button:flex',
              'group-hover/vote-button:scale-150',
              'group-focus/vote-button:scale-150',
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
              'voted-on:scale-100',
              'voted-on:opacity-100',
              'voted-on:text-background',
              'voted-on:vote-changing:scale-0',
              'voted-on:vote-changing:opacity-0',
              'group-hover/vote-button:text-background',
              'group-hover/vote-button:scale-100',
              'group-hover/vote-button:opacity-100',
              'group-focus/vote-button:scale-100',
              'group-focus/vote-button:opacity-100',
            )}
          >
            <Icon name="solid:check" />
          </span>

          <span
            className={twJoin(
              'glow z-0',
              'scale-0 opacity-0',
              'group-hover/vote-button:scale-300',
              'group-hover/vote-button:opacity-100',
              'group-focus/vote-button:scale-300',
              'group-focus/vote-button:opacity-100',
              'voted-on:scale-300',
              'voted-on:opacity-100',
              'voted-on:vote-changing:scale-0',
              'voted-on:vote-changing:opacity-0',
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

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />
    </>
  )
}
