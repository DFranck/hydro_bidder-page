'use client'

import { Icon } from '@/components/Icon'
import { twJoin, twMerge } from 'tailwind-merge'

interface VoteButtonProps extends React.ComponentProps<'div'> {
  bidId: number
  sourceId: string
  onVote?: () => void
}

export function VoteButton({
  bidId,
  sourceId,
  onVote,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...otherProps
}: VoteButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onVote}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={twMerge(
        'vote-button',
        'group/action-button',
        'btn h-full',
        'flex items-center justify-center',
        'transition-all',
        'px-standard',
        className,
      )}
      {...otherProps}
    >
      <span className={twJoin('relative block')}>
        {/* The initial circle icon */}
        <span
          className={twJoin(
            'transition-all',
            'group-hover/action-button:opacity-0',
            'group-hover/action-button:scale-0',
            'group-focus/action-button:opacity-0',
            'group-focus/action-button:scale-0',
          )}
        >
          <Icon name="solid:circle-dashed" />
        </span>

        {/* A lighter circle icon to enlarge and rotate */}
        <span
          className={twJoin(
            'z-10 transition-all',
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'opacity-0',
            'group-hover/action-button:opacity-100',
            'group-hover/action-button:rotate-180',
            'group-hover/action-button:scale-200',
            'group-hover/action-button:animate-spin',
            'group-focus/action-button:opacity-100',
            'group-focus/action-button:rotate-180',
            'group-focus/action-button:scale-200',
            'group-focus/action-button:animate-spin',
          )}
        >
          <Icon name="light:circle-dashed" />
        </span>

        <span
          className={twJoin(
            'z-10 transition-all',
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'scale-0 opacity-0',
            'group-hover/action-button:scale-100',
            'group-hover/action-button:opacity-100',
            'group-focus/action-button:scale-100',
            'group-focus/action-button:opacity-100',
          )}
        >
          <Icon name="solid:check" />
        </span>

        <span
          className={twJoin(
            'pointer-events-none z-0 size-12',
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'transition-all',
            'scale-0 opacity-0',
            'group-hover/action-button:scale-300',
            'group-hover/action-button:opacity-100',
            'group-focus/action-button:scale-300',
            'group-focus/action-button:opacity-100',
            'bg-radial to-50%',
            'from-palette-green to-transparent',
          )}
        />
      </span>
    </div>
  )
}
