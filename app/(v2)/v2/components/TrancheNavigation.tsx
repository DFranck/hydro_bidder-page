'use client'

import { Icon } from '@/components/Icon'
import { useIsMobile } from '@/lib/useIsMobile'
import { ScrollIndicator } from '@v2/components/ScrollIndicator'
import { SourceLabel } from '@v2/components/SourceLabel'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useEffect, useState } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

function TrancheNavigationButton({
  className,
  children,
  disabled,
  ...otherProps
}: React.ComponentProps<'button'>) {
  return (
    <button
      className={twMerge(
        'cursor-pointer',
        'h-4 w-full rounded-[calc(var(--spacing)*2)]',
        'flex items-center justify-center',
        'transition-all',
        'flex-col gap-1',
        'truncate',
        'desktop:flex-row',
        'desktop:gap-2',
        'desktop:px-standard',
        disabled && 'cursor-not-allowed',
        disabled && 'opacity-50',
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  )
}

interface TrancheNavigationProps {
  allTranchesSorted: Array<{
    id: number
    name: string
    sourceId: SourceID
  }>
  onActiveTrancheChange?: (previousIndex: number, newIndex: number) => void
}

export function TrancheNavigation({
  allTranchesSorted,
  onActiveTrancheChange,
}: TrancheNavigationProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { state, dispatch } = useAppState()
  const { isSidebarOpen } = state
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ScrollIndicator
      containerSelector="#tranches-container"
      targetSelector="[id^='tranche-container--']"
      disabled={isMobile && isSidebarOpen}
      className={twMerge(
        'rounded-standard w-full',
        'grid grid-cols-[auto_1fr_auto]',
      )}
      onChange={onActiveTrancheChange}
      renderDot={({ index, isActive: isActiveTranche, spreadProps }) => {
        const tranche = allTranchesSorted[index]
        const { sourceId, name } = tranche
        const userVotedInBucket = false // TODO: add this

        return (
          <TokenThemeWrapper
            as={TrancheNavigationButton}
            sourceId={sourceId}
            key={index}
            id={`tranche-nav-button--${sourceId}-${tranche.id}`}
            className={twMerge(
              'relative items-center',
              'justify-center',
              'desktop:justify-between',
              'text-white',
              'border-standard transition-all duration-500',
              'overflow-visible',

              // Base styles
              'border-token-color',
              'bg-token-color/60',
              'focus-within:bg-token-color',
              'outline-none',
              'focus-within:shadow-2xl',
              'focus-within:shadow-token-color',

              // Active state
              isActiveTranche && 'bg-token-color cursor-default rounded-b-none',

              // Voted state
              userVotedInBucket && [
                isActiveTranche && 'bg-palatte-green',
                'focus-within:bg-palette-green',
              ],
            )}
            onClick={(e) => {
              spreadProps.onClick?.(e)
            }}
            {...spreadProps}
          >
            {/* The bridging element between tab and content */}
            <div
              className={twMerge(
                '-bottom-tight absolute right-0 left-0',
                'bg-token-color',
                'origin-bottom',
                isMounted
                  ? [
                      'transition-all',
                      isActiveTranche
                        ? 'scale-x-100 duration-500 ease-out'
                        : 'scale-x-0 duration-200 ease-in',
                    ]
                  : isActiveTranche
                    ? 'scale-x-100'
                    : 'scale-x-0',
              )}
              style={{
                height: 'var(--spacing-tight)',
                transform: 'translateZ(0)',
              }}
            />

            <SourceLabel
              sourceId={sourceId}
              isShortened={true}
              className="sr-only"
            />
          </TokenThemeWrapper>
        )
      }}
      renderDots={({ dots, onPrevious, onNext, canGoPrevious, canGoNext }) => {
        return (
          <>
            <div className="py-tight">
              <TrancheNavigationButton
                id="tranche-nav-previous"
                disabled={!canGoPrevious}
                className={twJoin('px-standard w-min shrink-0', 'desktop:w-12')}
                onClick={onPrevious}
              >
                <Icon name="solid:chevron-left" />
              </TrancheNavigationButton>
            </div>

            <div className="py-tight overflow-x-auto">
              <div className="gap-tight grid auto-cols-fr grid-flow-col">
                {dots}
              </div>
            </div>

            <div className="py-tight">
              <TrancheNavigationButton
                id="tranche-nav-next"
                disabled={!canGoNext}
                className={twJoin('px-standard w-min shrink-0', 'desktop:w-12')}
                onClick={onNext}
              >
                <Icon name="solid:chevron-right" />
              </TrancheNavigationButton>
            </div>
          </>
        )
      }}
    />
  )
}
