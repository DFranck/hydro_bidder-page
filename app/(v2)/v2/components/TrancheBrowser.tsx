'use client'

import { AppPageContainer } from '@v2/components/AppPageContainer'
import { GradientOverlay } from '@v2/components/GradientOverlay'
import { StatBar } from '@v2/components/StatBar'
import { Tranche } from '@v2/components/Tranche'
import { TrancheNavigation } from '@v2/components/TrancheNavigation'
import { useAppState } from '@v2/state/ClientDataProvider'
import sortBy from 'lodash/sortBy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export function TrancheBrowser() {
  const { state, dispatch } = useAppState()
  const { currentRoundDataPerSource, activeTrancheIndex } = state
  const containerRef = useRef<HTMLDivElement>(null)
  const [trancheAndBidIdsMap, setTrancheAndBidIdsMap] = useState<
    [trancheId: string, bidIds: string[]][]
  >([])

  const allTranchesSorted = useMemo(() => {
    const allSources = Object.values(currentRoundDataPerSource ?? {})
    return sortBy(
      allSources.flatMap(({ sourceId, tranches }) =>
        tranches.map((tranche) => ({
          ...tranche,
          sourceId: sourceId,
        })),
      ),
      (tranche) => tranche.sourceId,
    )
  }, [currentRoundDataPerSource])

  useEffect(() => {
    const tranches = containerRef.current?.querySelectorAll(
      '[id^="tranche-container--"]',
    )
    if (tranches) {
      setTrancheAndBidIdsMap(
        Array.from(tranches).map((tranche) => {
          const trancheId = tranche.id
          const bidIds = Array.from(
            tranche.querySelectorAll('[id^="bid-card--"]'),
          ).map((bid) => bid.id)
          return [trancheId, bidIds]
        }),
      )
    }
  }, [currentRoundDataPerSource])

  const handleActiveTrancheChange = useCallback(
    (previousIndex: number, newIndex: number) => {
      dispatch({ type: 'SET_ACTIVE_TRANCHE_INDEX', payload: newIndex })
      const bidIds = trancheAndBidIdsMap[newIndex]?.[1]
      const bidId = bidIds?.[0]
      if (bidId) {
        document.getElementById(bidId)?.focus()
      }
    },
    [dispatch, trancheAndBidIdsMap],
  )

  useEffect(() => {
    if (!containerRef.current) return

    const tranches = containerRef.current.querySelectorAll(
      '[id^="tranche-container--"]',
    )

    tranches.forEach((tranche, index) => {
      const leftTranche = tranches[index - 1] as HTMLElement
      const rightTranche = tranches[index + 1] as HTMLElement
      const currentTranche = tranche as HTMLElement

      if (leftTranche) {
        const leftColor = getComputedStyle(leftTranche)
          .getPropertyValue('--color-token-color')
          .trim()
        currentTranche.style.setProperty(
          '--color-token-color-to-left',
          leftColor,
        )
      }

      if (rightTranche) {
        const rightColor = getComputedStyle(rightTranche)
          .getPropertyValue('--color-token-color')
          .trim()
        currentTranche.style.setProperty(
          '--color-token-color-to-right',
          rightColor,
        )
      }
    })
  }, [allTranchesSorted.length])

  useEffect(() => {
    const bidIds = trancheAndBidIdsMap[activeTrancheIndex]?.[1]
    const bidId = bidIds?.[0]
    if (bidId) {
      document.getElementById(bidId)?.focus()
    }
  }, [activeTrancheIndex, trancheAndBidIdsMap])

  return (
    <AppPageContainer className="grid grid-rows-[min-content_min-content_auto]">
      <StatBar
        stats={[
          ['Live Bids', 14],
          ['Average APR', '17%'],
          ['Days Left', 15],
        ]}
      />

      <TrancheNavigation
        allTranchesSorted={allTranchesSorted}
        onActiveTrancheChange={handleActiveTrancheChange}
      />

      <div
        ref={containerRef}
        id="tranches-container"
        className={twJoin(
          'relative h-full',
          'snap-x snap-mandatory',
          'flex overflow-x-auto',
          'rounded-standard',
        )}
      >
        {allTranchesSorted.map(({ id, sourceId }, index) => {
          const hasTrancheToLeft = index > 0
          const hasTrancheToRight = index < allTranchesSorted.length - 1

          return (
            <Tranche
              key={`${sourceId}-${id}`}
              sourceId={sourceId}
              trancheId={id}
              isActive={index === activeTrancheIndex}
              renderViewbox={({ className, children }) => (
                <div className={twMerge(className, 'relative h-full')}>
                  {children}

                  <GradientOverlay direction="down" />
                  {hasTrancheToLeft && <GradientOverlay direction="left" />}
                  {hasTrancheToRight && <GradientOverlay direction="right" />}
                </div>
              )}
            />
          )
        })}
      </div>
    </AppPageContainer>
  )
}
