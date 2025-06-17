import { Icon } from '@/components/Icon'
import { SourceBadge } from '@v2/components/SourceBadge'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { type SourceID } from '@v2/environments'
import { twJoin, twMerge } from 'tailwind-merge'

interface SidebarSourcePanelProps {
  sourceId: SourceID
  totalLockedTokens: number
  currentRoundId: number
}

export function SidebarSourcePanel({
  sourceId,
  totalLockedTokens,
  currentRoundId,
}: SidebarSourcePanelProps) {
  return (
    <TokenThemeWrapper
      as="button"
      sourceId={sourceId}
      className={twMerge(
        'relative w-full',
        'flex items-center justify-between gap-3',
        'bg-token-color rounded-standard',
        'h-18 flex-row',
        'sidebar-open:h-12',
        'desktop:h-auto',
        'desktop:flex-col',
        'desktop:gap-1',
        'desktop:text-center',
        'desktop:sidebar-open:flex-row',
        'desktop:sidebar-open:h-12',
      )}
    >
      <span
        className={twJoin(
          'flex items-center',
          'gap-tight',
          'px-standard',
          'desktop:flex-row',
          'desktop:py-loose',
          'desktop:sidebar-closed:gap-1',
          'desktop:sidebar-closed:py-loose',
          'desktop:sidebar-closed:px-0console.log()',
          'desktop:sidebar-closed:flex-col',
        )}
      >
        <SourceBadge sourceId={sourceId} />

        <span
          className={twJoin(
            'flex items-baseline',
            'flex-col',
            'sidebar-open:flex-row',
            'sidebar-open:gap-1',
            'desktop:flex-col',
            'desktop:items-center',
          )}
        >
          <span className="font-extrabold">
            {totalLockedTokens.toLocaleString()}
          </span>
          <span className="denom">{sourceId}</span>
        </span>
      </span>

      <span
        className={twJoin(
          'gap-tight flex items-center justify-center',
          'bg-darkened',
          'px-standard',
          'h-full',
          'sidebar-open:w-[130px]',
          'sidebar-open:justify-between',
          'desktop:sidebar-closed:w-full',
          'desktop:sidebar-closed:px-0',
          'desktop:sidebar-closed:py-tight',
        )}
      >
        <span
          className={twJoin(
            'flex items-center gap-1',
            'flex-col',
            'sidebar-open:flex-row',
          )}
        >
          <span className="label sidebar-closed:hidden">Round</span>
          <span className="important-value">{currentRoundId}</span>
        </span>

        <span className={twJoin('hidden', 'sidebar-open:block')}>
          <Icon name="solid:caret-down" />
        </span>
      </span>
    </TokenThemeWrapper>
  )
}
