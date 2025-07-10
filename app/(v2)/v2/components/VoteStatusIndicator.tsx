import { Icon } from '@/components/Icon'
import { twJoin, twMerge } from 'tailwind-merge'

interface VoteStatusIndicatorProps {
  variant?: 'within-tranche' | 'on-bid'
  className?: string
}

export function VoteStatusIndicator({
  variant = 'within-tranche',
  className,
}: VoteStatusIndicatorProps) {
  const baseClasses = twJoin(
    'footnote',
    'relative z-10 whitespace-nowrap',
    'hidden',
    'is-connected:block',
  )

  const variantClasses =
    variant === 'within-tranche'
      ? 'has-voted-within:text-foreground'
      : 'is-voted-on:text-palette-green'

  const notVotedClasses = twJoin(
    'flex gap-1',
    variant === 'within-tranche'
      ? 'has-voted-within:hidden'
      : 'is-voted-on:hidden',
  )

  const votedClasses = twJoin(
    'relative hidden gap-1',
    variant === 'within-tranche' ? 'has-voted-within:flex' : 'is-voted-on:flex',
  )

  return (
    <div className={twMerge(baseClasses, variantClasses, className)}>
      <div className={notVotedClasses}>
        <span className={variant === 'on-bid' ? 'sr-only' : ''}>
          {variant === 'within-tranche' ? "Haven't voted" : 'Voted elsewhere'}
        </span>
        <Icon name="solid:circle-dashed" />
      </div>

      <div className={votedClasses}>
        <span>
          {variant === 'within-tranche' ? "You've voted!" : 'Your pick!'}
        </span>
        <Icon name="solid:circle-check" />
      </div>
    </div>
  )
}
