'use client'

import { BidLogo } from '@v2/components/BidLogo'
import { BidWrapper } from '@v2/components/BidWrapper'
import {
  CarouselContainer,
  CarouselSection,
} from '@v2/components/TabbedCarousel'
import { TrancheTabbedCarousel } from '@v2/components/TrancheTabbedCarousel'
import { VoteStatusIndicator } from '@v2/components/VoteStatusIndicator'
import { useBidsByTranche } from '@v2/hooks/useBidsByTranche'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { twJoin } from 'tailwind-merge'

interface BidNavigationCarouselProps {
  bidId: number
  activeTrancheIndex: number
  onActiveTrancheIndexChange: (index: number) => void
  onBidClick: (bidId: number) => void
  className?: string
  slotOnRight?: React.ReactNode
  disableIntersectionObserver?: boolean
}

export function BidNavigationCarousel({
  bidId,
  activeTrancheIndex,
  onActiveTrancheIndexChange,
  onBidClick,
  className,
  slotOnRight,
  disableIntersectionObserver,
}: BidNavigationCarouselProps) {
  const { state } = useAppState()
  const { bidDescriptionsById } = state
  const { bidsByTranche, navigationBidsOrder, allTranchesSorted } =
    useBidsByTranche()

  return (
    <TrancheTabbedCarousel
      containerId="bids-carousel-container"
      targetSelector="[data-carousel-section='bid-navigation']"
      threshold={0.5}
      className={className}
      slotOnRight={slotOnRight}
      activeIndex={activeTrancheIndex}
      onActiveIndexChange={(_, newIndex) =>
        onActiveTrancheIndexChange(newIndex)
      }
      disableIntersectionObserver={disableIntersectionObserver}
      filterFunction={(tranche) => {
        const trancheKey = `${tranche.sourceId}-${tranche.id}`
        const trancheBids = navigationBidsOrder.filter(
          (bid) =>
            bid.sourceId === tranche.sourceId && bid.trancheId === tranche.id,
        )
        return trancheBids.length > 0
      }}
      renderContent={({ activeIndex }) => (
        <CarouselContainer
          id="bids-carousel-container"
          className="relative flex-1"
        >
          {allTranchesSorted.map((tranche, index) => {
            const trancheKey = `${tranche.sourceId}-${tranche.id}`
            const trancheBids = bidsByTranche[trancheKey]?.bids || []
            const hasBids = trancheBids.length > 0

            if (!hasBids) return null

            return (
              <CarouselSection
                key={`${tranche.sourceId}-${tranche.id}`}
                id={`bid-section--${tranche.sourceId}-${tranche.id}`}
                data-carousel-section="bid-navigation"
                className="border-theme-color border-t-4"
              >
                {trancheBids.map((bid) => {
                  const isActive = bid.id === bidId
                  const bidDescription = bidDescriptionsById[bid.id]
                  const { projectLogoUrl = '/images/logo-drop.png' } =
                    bidDescription ?? {}

                  return (
                    <BidWrapper
                      data-is-active={isActive ? 'true' : undefined}
                      key={bid.id}
                      as="div"
                      sourceId={bid.sourceId}
                      bidId={bid.id}
                      className={twJoin(
                        'flex items-center justify-between',
                        'gap-looser px-looser py-loose',
                        'desktop:gap-standard desktop:px-standard desktop:py-tight',
                        'cursor-pointer',
                        'transition-all',
                        'hover:bg-palette-beige/20',
                        'data-is-active:bg-palette-beige/40',
                      )}
                      onClick={() => onBidClick(bid.id)}
                    >
                      <div className="gap-loose flex items-center">
                        <div className={twJoin('relative shrink-0')}>
                          <BidLogo
                            projectLogoUrl={projectLogoUrl}
                            projectName={bidDescription?.projectName}
                            title={bidDescription?.title}
                            className="rounded-full p-0"
                            classNameForClearLogoContainer="inset-0!"
                          />
                        </div>

                        <span
                          className={twJoin(
                            'break-words',
                            'text-balance',
                            'text-lg',
                            'desktop:text-sm',
                            isActive && 'font-medium',
                          )}
                        >
                          {bid.title}
                        </span>
                      </div>

                      <VoteStatusIndicator variant="on-bid" />
                    </BidWrapper>
                  )
                })}
              </CarouselSection>
            )
          })}
        </CarouselContainer>
      )}
    />
  )
}
