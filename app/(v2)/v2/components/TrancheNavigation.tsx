'use client'

import { Icon } from '@/components/Icon'
import { useIsMobile } from '@/lib/useIsMobile'
import { ScrollIndicator } from '@v2/components/ScrollIndicator'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AugmentedTranche } from '@v2/types'
import Image from 'next/image'
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
        'h-bar-height-standard',
        'w-full rounded-[calc(var(--spacing)*2)]',
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
  allTranchesSorted: Array<
    AugmentedTranche & {
      sourceId: SourceID
    }
  >
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
        const { sourceId, name, metadata, userVotedInTranche } = tranche
        const { logo, description } = JSON.parse(metadata)

        return (
          <TokenThemeWrapper
            as={TrancheNavigationButton}
            sourceId={sourceId}
            key={index}
            id={`tranche-nav-button--${sourceId}-${tranche.id}`}
            className={twMerge(
              userVotedInTranche && 'voted-within',
              isActiveTranche && 'is-active',
              '@container/tranche-nav-button',
              'relative items-center',
              'justify-center',
              'desktop:justify-between',
              'text-white',
              'border-standard transition-all duration-500',
              'overflow-visible',

              // Base styles
              'border-theme-color',
              'bg-theme-color/60',
              'focus-within:bg-theme-color',
              'outline-none',
              'focus-within:shadow-2xl',
              'focus-within:shadow-theme-color',

              // Active state
              'is-active:bg-theme-color',
              'is-active:cursor-default',
              'is-active:rounded-b-none',

              // Voted state
              'voted-within:text-background',
            )}
            style={
              userVotedInTranche
                ? ({
                    '--color-theme-color': 'var(--color-palette-green)',
                  } as React.CSSProperties)
                : undefined
            }
            onClick={(e) => {
              spreadProps.onClick?.(e)
            }}
            {...spreadProps}
          >
            <div
              className={twMerge(
                '-bottom-tight absolute right-0 left-0',
                'bg-theme-color',
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

            <span className={twMerge('flex items-center gap-2')}>
              <span
                className={twMerge(
                  'relative size-6',
                  'flex items-center justify-center',
                  'shrink-0',
                )}
              >
                <span className="absolute inset-0">
                  <Image
                    src={`/images/logo-${logo}.svg`}
                    alt={name}
                    fill={true}
                    sizes="10vw"
                  />
                </span>
              </span>
              <span className={twJoin('label', 'hidden', '@4xs:block')}>
                {name}
              </span>
            </span>
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
