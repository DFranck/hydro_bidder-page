import { Icon } from '@/components/Icon'
import { VoteStatusIndicator } from '@v2/components/VoteStatusIndicator'
import { ReactNode } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

interface TabButtonProps {
  isActive?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  id?: string
  'data-is-active'?: string | undefined
  'data-has-voted-within'?: string | undefined
  icon?: ReactNode
  shortLabel?: string
  fullLabel?: string
  voteStatus?: boolean | undefined
}

export function TabButton({
  isActive = false,
  onClick,
  disabled = false,
  className,
  id,
  icon,
  shortLabel,
  fullLabel,
  voteStatus,
  ...dataProps
}: TabButtonProps) {
  return (
    <div className="@container/tab flex min-w-0 flex-1 flex-col">
      <button
        id={id}
        data-is-active={isActive ? 'true' : undefined}
        className={twMerge(
          // Base styles
          'relative w-full overflow-hidden',
          'btn-essentials',
          'rounded-small',
          'flex items-center',
          'transition-all',
          'px-loose',

          // Color and state styles
          'border-theme-color',
          'bg-theme-color/60',
          'focus-within:bg-theme-color',
          'text-foreground',
          'outline-none',
          'focus-within:shadow-2xl',
          'focus-within:shadow-theme-color',

          // Active state
          'is-active:cursor-default',
          'is-active:rounded-b-none',
          'is-active:bg-theme-color',

          '@4xs/tab:justify-between',

          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        disabled={disabled}
        onClick={onClick}
        {...dataProps}
      >
        <span className="gap-tight flex items-center">
          {icon && (
            <span
              className={twJoin(
                'relative size-6',
                'flex items-center justify-center',
                'shrink-0',
              )}
            >
              {typeof icon === 'string' ? <Icon name={icon as any} /> : icon}
            </span>
          )}
          {shortLabel && (
            <span className={twJoin('label', 'block', '@4xs:hidden')}>
              {shortLabel}
            </span>
          )}
          {fullLabel && (
            <span className={twJoin('label', 'hidden', '@4xs:block')}>
              {fullLabel}
            </span>
          )}
        </span>

        <span className={twJoin('hidden', '@4xs/tab:block')}>
          <VoteStatusIndicator variant="within-tranche" />
        </span>

        <span
          className={twJoin(
            'has-voted-within:block hidden',
            'absolute inset-y-0 right-0 left-1/2 z-0',
            'from-palette-green/80 bg-linear-to-l to-transparent',
            'rounded-small',
            'is-active:rounded-b-none',
          )}
        />
      </button>

      <div
        className={twJoin(
          'relative w-full',
          'bg-theme-color text-foreground',
          'origin-bottom',
          'scale-x-0',
          'transition-all',
          'duration-200 ease-in',
          isActive && 'scale-x-100',
          isActive && 'duration-500',
          isActive && 'ease-out',
        )}
        style={{
          height: 'var(--spacing-tight)',
          transform: 'translateZ(0)',
        }}
      >
        <div
          className={twJoin(
            'has-voted-within:block hidden',
            'absolute inset-y-0 right-0 left-1/2 z-0',
            'from-palette-green/80 bg-linear-to-l to-transparent',
          )}
        />
      </div>
    </div>
  )
}
