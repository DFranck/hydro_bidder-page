import { Icon } from '@/components/Icon'
import { ScrollIndicator } from '@v2/components/ScrollIndicator'
import { SourceLabel } from '@v2/components/SourceLabel'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID } from '@v2/environments'
import { useKeyboardNavigation } from '@v2/hooks/useKeyboardNavigation'
import { useEffect, useRef, useState } from 'react'
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
        'rounded-standard h-12 w-full',
        'flex items-center justify-center',
        'transition-all',
        'flex-col gap-1',
        'truncate',
        'desktop:flex-row',
        'desktop:gap-2',
        'desktop:px-3',
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
  onActiveTrancheChange?: (index: number) => void
}

export function TrancheNavigation({
  allTranchesSorted,
  onActiveTrancheChange,
}: TrancheNavigationProps) {
  const [bridgeWidth, setBridgeWidth] = useState<number>(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (buttonRef.current) {
      const width = Math.ceil(buttonRef.current.getBoundingClientRect().width)
      setBridgeWidth(width)
    }
  }, [])

  useKeyboardNavigation({
    selector: '[id^="tranche-nav-button--"]',
    direction: 'horizontal',
    clickAfterFocus: true,
    onNavigateToChild: (currentElement) => {
      const currentId = currentElement.id
      const match = currentId.match(/tranche-nav-button--(.+)-(\d+)/)
      if (match) {
        const [, sourceId, trancheId] = match
        const childElements = Array.from(
          document.querySelectorAll(`[id^="bid-card-container--${sourceId}-"]`),
        ) as HTMLElement[]
        return childElements[0] ?? null
      }
      return null
    },
  })

  return (
    <ScrollIndicator
      containerSelector="#tranches-container"
      targetSelector="[id^='tranche-container--']"
      className={twMerge(
        'rounded-standard w-full',
        'grid grid-cols-[auto_1fr_auto]',
      )}
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
              'bg-token-color/40',
              'focus-within:bg-token-color',
              'outline-none',
              'focus-within:shadow-2xl',
              'focus-within:shadow-token-color',

              // Active state
              isActiveTranche && 'bg-token-color cursor-default',

              // Voted state
              userVotedInBucket && [
                isActiveTranche && 'bg-palatte-green',
                'focus-within:bg-palette-green',
              ],
            )}
            onClick={(e) => {
              onActiveTrancheChange?.(index)
              spreadProps.onClick?.(e)
            }}
            {...spreadProps}
          >
            {/* The briding element between tab and content */}
            <div
              className={twMerge(
                '-bottom-standard absolute right-0 left-0',
                'bg-token-color',
                'origin-center',
                'transition-all',
                isActiveTranche
                  ? 'scale-x-100 duration-500 ease-out'
                  : 'scale-x-0 duration-200 ease-in',
              )}
              style={{
                height: isActiveTranche
                  ? 'calc(var(--spacing-standard) + var(--radius-standard))'
                  : 'var(--spacing-standard)',
                transform: 'translateZ(0)',
              }}
            />

            <SourceLabel sourceId={sourceId} isShortened={true} />

            <span className="desktop:inline-block hidden">
              <Icon name="solid:circle-dashed" />
            </span>
          </TokenThemeWrapper>
        )
      }}
      renderDots={({ dots, onPrevious, onNext, canGoPrevious, canGoNext }) => {
        return (
          <>
            <div className="py-standard">
              <TrancheNavigationButton
                id="tranche-nav-previous"
                disabled={!canGoPrevious}
                className={twJoin('w-min shrink-0', 'desktop:w-12')}
                onClick={onPrevious}
              >
                <Icon name="solid:chevron-left" />
              </TrancheNavigationButton>
            </div>

            <div className="py-standard overflow-x-auto">
              <div className="gap-standard grid auto-cols-fr grid-flow-col">
                {dots}
              </div>
            </div>

            <div className="py-standard">
              <TrancheNavigationButton
                id="tranche-nav-next"
                disabled={!canGoNext}
                className={twJoin('w-min shrink-0', 'desktop:w-12')}
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
