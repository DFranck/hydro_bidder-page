'use client'

import { Icon } from '@/components/Icon'
import { useIsMobile } from '@/lib/useIsMobile'
import { BidNavigationCarousel } from '@v2/components/BidNavigationCarousel'
import { InternalLink, useInternalLink } from '@v2/components/InternalLink'
import { Tooltipped } from '@v2/components/Tooltipped'
import { useBidTrancheIndex } from '@v2/hooks/useBidTrancheIndex'
import { useBidsNavigation } from '@v2/hooks/useBidsNavigationOrder'
import { useDropdownMenu } from '@v2/hooks/useDropdownMenu'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'

interface BidNavigationProps {
  bidId: number
  isModal?: boolean
  className?: string
}

export function BidNavigation({
  bidId,
  isModal = false,
  className,
}: BidNavigationProps) {
  const { navigate } = useInternalLink()
  const [activeTrancheIndex, setActiveTrancheIndex] = useState(0)
  const [disableIntersectionObserver, setDisableIntersectionObserver] =
    useState(false)
  const isMobile = useIsMobile()

  const {
    navigationBidsOrder,
    currentBidIndex,
    previousBid,
    nextBid,
    hasPreviousBid,
    hasNextBid,
  } = useBidsNavigation(bidId)

  const currentBidTrancheIndex = useBidTrancheIndex(bidId)

  const { refs, getReferenceProps, renderMenu, setIsOpen, isOpen } =
    useDropdownMenu({
      modalOnMobile: true,
      placement: 'bottom',
      interaction: 'click',
      onOpenChange: (isOpen) => {
        if (isOpen) {
          // Temporarily disable intersection observer to prevent conflicts
          setDisableIntersectionObserver(true)
          setActiveTrancheIndex(currentBidTrancheIndex)

          // Re-enable after a short delay to allow the state to settle
          setTimeout(() => {
            setDisableIntersectionObserver(false)
          }, 500)
        }
      },
    })

  // Reset active tranche when menu closes or when current bid changes
  useEffect(() => {
    if (!isOpen) {
      setActiveTrancheIndex(currentBidTrancheIndex)
    }
  }, [currentBidTrancheIndex, isOpen])

  // Ensure correct tranche is active when mobile overlay opens
  useEffect(() => {
    if (isOpen && isMobile) {
      setActiveTrancheIndex(currentBidTrancheIndex)
    }
  }, [isOpen, isMobile, currentBidTrancheIndex])

  const navigateToBid = (targetBidId: number) => {
    const targetBid = navigationBidsOrder.find((bid) => bid.id === targetBidId)
    if (targetBid) {
      navigate(`/v2/bids/${targetBid.sourceId}/${targetBidId}`)
      setIsOpen(false) // Close menu after navigation
    }
  }

  const renderBidList = () => {
    return (
      <div
        className={twJoin(
          'popover',
          'flex',
          'flex-col',
          'overflow-y-auto',
          'py-tight',
          'z-50',
          'bg-background',
          // Mobile (default): full size within modal
          'w-full',
          'h-full',
          'max-w-none',
          // Desktop: constrain size to prevent overflow
          'desktop:min-w-[320px]',
          'desktop:max-w-[min(500px,90vw)]',
          'desktop:max-h-[min(400px,80vh)]',
          'desktop:w-auto',
          'desktop:h-auto',
        )}
      >
        <BidNavigationCarousel
          activeTrancheIndex={activeTrancheIndex}
          bidId={bidId}
          className={twJoin('flex-1', isMobile && 'h-full')}
          onActiveTrancheIndexChange={setActiveTrancheIndex}
          onBidClick={navigateToBid}
          disableIntersectionObserver={disableIntersectionObserver}
          slotOnRight={
            <button className="btn-icon" onClick={() => setIsOpen(false)}>
              <Icon name="solid:xmark" />
            </button>
          }
        />
      </div>
    )
  }

  return (
    <>
      <div
        className={twJoin(
          'h-bar-height-standard',
          'flex items-center justify-between',
          'bg-theme-color/10',
          className,
        )}
      >
        {/* Left side: Previous button */}
        <Tooltipped tip="Previous bid">
          <button
            className="btn-icon"
            onClick={() => hasPreviousBid && navigateToBid(previousBid!.id)}
            disabled={!hasPreviousBid}
          >
            <Icon name="solid:chevron-left" />
          </button>
        </Tooltipped>

        {/* Center: Dropdown navigation */}
        <div className="relative flex flex-1 justify-center">
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            className="btn-tool"
          >
            <span className="label">
              Bid {currentBidIndex >= 0 ? currentBidIndex + 1 : '?'} of{' '}
              {navigationBidsOrder.length}
            </span>
            <Icon name="solid:chevron-down" />
          </button>

          {/* Render using the dropdown hook's built-in logic */}
          {renderMenu(renderBidList())}
        </div>

        {/* Right side: Next button and close/back button */}
        <div className="flex items-center">
          <Tooltipped tip="Next bid">
            <button
              className="btn-icon"
              onClick={() => hasNextBid && navigateToBid(nextBid!.id)}
              disabled={!hasNextBid}
            >
              <Icon name="solid:chevron-right" />
            </button>
          </Tooltipped>

          <Tooltipped tip={<div>Back to bids</div>}>
            <InternalLink className="btn-icon" href="/v2">
              <Icon name={isModal ? 'solid:xmark' : 'solid:list-ul'} />
            </InternalLink>
          </Tooltipped>
        </div>
      </div>
    </>
  )
}
