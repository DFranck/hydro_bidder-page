import { Icon } from '@/components/Icon'
import { twJoin } from 'tailwind-merge'

export function VoteStatusIndicator() {
  return (
    <div
      className={twJoin(
        'footnote relative z-10 whitespace-nowrap',
        'has-voted-within:text-foreground',
      )}
    >
      <div className="has-voted-within:hidden flex gap-1">
        <span>Haven&rsquo;t voted</span>
        <Icon name="solid:circle-dashed" />
      </div>

      <div className="has-voted-within:flex relative hidden gap-1">
        <span>You&rsquo;ve voted!</span>
        <Icon name="solid:circle-check" />
      </div>
    </div>
  )
}
