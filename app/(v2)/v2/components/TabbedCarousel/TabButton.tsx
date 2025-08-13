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
    <div
      data-is-active={isActive ? 'true' : undefined}
      className="@container/tab flex min-w-0 flex-1 flex-col"
    >
      <button
        id={id}
        className={twMerge(
          // Base styles
          'relative z-10 w-full overflow-hidden',
          'btn-essentials',
          'rounded-small',
          'flex items-center',
          'transition-all',
          'px-loose',
          'hover:bg-theme-color/80',

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
          'is-active:bg-theme-color',
          'is-active:hover:bg-theme-color',
          'is-active:rounded-b-none',

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
            'from-palette-green/80 bg-linear-to-bl via-transparent to-transparent',
          )}
        />
      </button>

      {/* The animated "bridging" element that connects the tab to the content */}
      <div
        className={twJoin(
          'relative z-0 w-full',
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
          height: 'calc(var(--spacing-tight) + var(--radius-small))',
          transform: 'translateZ(0)',
          marginTop: 'calc(var(--radius-small) * -1)',
        }}
      />
    </div>
  )
}
