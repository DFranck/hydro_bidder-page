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
      trancheId={1}
      className={twMerge(
        '@container',
        'relative w-full',
        'bg-theme-color rounded-standard',
      )}
    >
      <div
        className={twJoin(
          'flex items-center justify-between gap-1',
          'flex-col text-center',
          '@2xs:flex-row',
          '@2xs:h-bar-height-standard',
          '@2xs:gap-3',
          '@2xs:text-left',
        )}
      >
        <span
          className={twJoin(
            'flex items-center',
            'gap-1',
            'py-loose',
            'px-0',
            'flex-col',
            '@2xs:gap-tight',
            '@2xs:px-standard',
            '@2xs:flex-row',
          )}
        >
          <SourceBadge sourceId={sourceId} />
          <span
            className={twJoin(
              'flex items-center',
              'flex-col',
              '@2xs:items-baseline',
              '@2xs:flex-row',
              '@2xs:gap-1',
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
            'w-full',
            'px-0',
            'py-tight',
            'h-full',
            '@2xs:w-[130px]',
            '@2xs:px-standard',
            '@2xs:justify-between',
          )}
        >
          <span className={twJoin('flex items-center gap-1')}>
            <span className="label">Round</span>
            <span className="important-value">{currentRoundId}</span>
          </span>
          <span className={twJoin('hidden', '@2xs:block')}>
            <Icon name="solid:caret-down" />
          </span>
        </span>
      </div>
    </TokenThemeWrapper>
  )
}
