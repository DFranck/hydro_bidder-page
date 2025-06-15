import { CollapsibleBox } from '@/components/CollapsibleBox'
import { StatBar } from '@v2/components/StatBar'
import { Tranche } from '@v2/components/Tranche'
import { TrancheNavigation } from '@v2/components/TrancheNavigation'
import { useAppState } from '@v2/state/provider'
import sortBy from 'lodash/sortBy'
import { useEffect, useRef, useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

const GradientOverlay = ({
  direction,
  className,
}: {
  direction: 'left' | 'right'
  className?: string
}) => (
  <div
    className={twJoin(
      'pointer-events-none',
      'absolute inset-y-0 w-1/2',
      direction === 'left'
        ? 'left-0 bg-gradient-to-r'
        : 'right-0 bg-gradient-to-l',
      direction === 'left'
        ? 'from-token-color-to-left/10 to-transparent'
        : 'from-token-color-to-right/10 to-transparent',
      className,
    )}
  />
)

export function TrancheBrowser() {
  const { state } = useAppState()
  const { currentRoundDataPerSource, narrowBuckets, isSidebarOpen } = state
  const [activeTrancheIndex, setActiveTrancheIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const allSources = Object.values(currentRoundDataPerSource ?? {})
  const allTranchesSorted = sortBy(
    allSources.flatMap(({ sourceId, tranches }) =>
      tranches.map((tranche) => ({
        ...tranche,
        sourceId: sourceId,
      })),
    ),
    (tranche) => tranche.sourceId,
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
  }, [allTranchesSorted])

  const shortenName = (name: string) => {
    return name.split(' ')[0]
  }

  return (
    <CollapsibleBox
      id="content-container"
      isCollapsed={isSidebarOpen}
      className={twJoin('grid-in-content')}
      classNamesForInnerWrapper={twJoin(
        'relative grid',
        'grid-rows-[min-content_min-content_auto]',
        'mobile:px-standard',
      )}
    >
      <StatBar
        stats={[
          ['Live Bids', 14],
          ['Average APR', '17%'],
          ['Days Left', 15],
        ]}
      />

      <TrancheNavigation
        allTranchesSorted={allTranchesSorted}
        onActiveTrancheChange={setActiveTrancheIndex}
        onShortenName={shortenName}
      />

      <div
        ref={containerRef}
        id="tranches-container"
        className={twJoin(
          'relative',
          'snap-x snap-mandatory',
          'flex overflow-x-auto',
        )}
      >
        {allTranchesSorted.map(({ id, sourceId }, index) => {
          const hasTrancheToLeft = index > 0
          const hasTrancheToRight = index < allTranchesSorted.length - 1

          return (
            <Tranche
              key={index}
              sourceId={sourceId}
              trancheId={id}
              isActive={index === activeTrancheIndex}
              renderViewbox={({ className, children }) => (
                <div className={twMerge(className, 'relative h-full')}>
                  {children}

                  {hasTrancheToLeft && <GradientOverlay direction="left" />}
                  {hasTrancheToRight && <GradientOverlay direction="right" />}
                </div>
              )}
            />
          )
        })}
      </div>
    </CollapsibleBox>
  )
}
