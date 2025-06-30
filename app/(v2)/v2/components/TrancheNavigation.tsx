'use client'

import { Icon } from '@/components/Icon'
import { useIsMobile } from '@/lib/useIsMobile'
import { ScrollIndicator } from '@v2/components/ScrollIndicator'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
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
        '@4xs:flex-row',
        '@4xs:gap-2',
        '@4xs:px-standard',
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

        const environment = getEnvironment()
        const source = getSource(environment, sourceId)
        const baseName = name.replace(
          new RegExp(` ${source.trancheSuffix}`, 'i'),
          '',
        )
        const suffix = source.trancheSuffix

        return (
          <TrancheNavigationButton
            key={index}
            id={`tranche-nav-button--${sourceId}-${tranche.id}`}
            className={twMerge(
              userVotedInTranche && 'has-voted-within',
              isActiveTranche && 'is-active',
              '@container',
              'relative items-center',
              'justify-center',
              'text-white',
              'border-standard transition-all duration-500',
              'overflow-visible',
              '@4xs:justify-between',

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
            )}
            onClick={(e) => {
              spreadProps.onClick?.(e)
            }}
            {...spreadProps}
          >
            <div
              className={twJoin(
                'w-full',
                'flex items-center justify-center',
                'px-standard gap-standard',
                '@4xs:justify-between',
              )}
            >
              <span
                className={twMerge('relative z-10 flex items-center gap-2')}
              >
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
                  {baseName}
                  <span className="@4xs:inline hidden"> {suffix}</span>
                </span>
              </span>

              <div
                className={twJoin(
                  'footnote relative z-10 whitespace-nowrap',
                  'has-voted-within:text-foreground',
                )}
              >
                <div className="has-voted-within:hidden flex gap-1">
                  <span className="sr-only">Haven&rsquo;t voted</span>
                  <Icon name="solid:circle-dashed" />
                </div>

                <div className="has-voted-within:flex relative hidden gap-1">
                  <span className="sr-only">You&rsquo;ve voted!</span>
                  <Icon name="solid:circle-check" />
                </div>
              </div>
            </div>

            {/* Bridging element to join with the content area */}
            <div
              className={twMerge(
                '-bottom-tight absolute right-0 left-0',
                'bg-theme-color',
                'origin-bottom',
                'scale-x-0',
                'transition-all',
                'duration-200 ease-in',
                'is-active:scale-x-100',
                'is-active:duration-500',
                'is-active:ease-out',
              )}
              style={{
                height: 'var(--spacing-tight)',
                transform: 'translateZ(0)',
              }}
            />

            {/* Right-side green highlight when voted within */}
            <div
              className={twJoin(
                'absolute inset-0 z-0',
                'bg-linear-to-b',
                'from-palette-green/50 via-transparent to-transparent',
                'opacity-0 transition-all',
                'delay-200',
                'rounded-t-[calc(var(--spacing)*2)]',
                'is-active:rounded-br-none',
                'is-active:rounded-t-[calc(var(--spacing)*2)]',
                'is-active:from-palette-green/80',
                'is-active:delay-500',
                'has-voted-within:opacity-100',
                '@4xs:is-active:rounded-tr-[calc(var(--spacing)*2)]',
                '@4xs:rounded-r-[calc(var(--spacing)*2)]',
                '@4xs:bg-linear-to-bl',
              )}
            />
          </TrancheNavigationButton>
        )
      }}
      renderDots={({ dots, onPrevious, onNext, canGoPrevious, canGoNext }) => {
        return (
          <>
            <div className="py-tight">
              <TrancheNavigationButton
                id="tranche-nav-previous"
                disabled={!canGoPrevious}
                className={twJoin('px-standard w-min shrink-0', '@4xs:w-12')}
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
                className={twJoin('px-standard w-min shrink-0', '@4xs:w-12')}
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
