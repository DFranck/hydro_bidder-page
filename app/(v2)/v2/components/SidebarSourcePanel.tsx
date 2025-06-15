import { Icon } from '@/components/Icon'
import { SourceBadge } from '@v2/components/SourceBadge'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { type SourceID } from '@v2/environments'
import { twJoin, twMerge } from 'tailwind-merge'

type SidebarState =
  | 'mobile-open'
  | 'mobile-closed'
  | 'desktop-open'
  | 'desktop-closed'

interface SidebarSourcePanelProps {
  sourceId: SourceID
  totalLockedTokens: number
  currentRoundId: number
  sidebarState: SidebarState
}

export function SidebarSourcePanel({
  sourceId,
  totalLockedTokens,
  currentRoundId,
  sidebarState,
}: SidebarSourcePanelProps) {
  const isDesktop = sidebarState.startsWith('desktop')
  const isMobile = sidebarState.startsWith('mobile')
  const isOpen = sidebarState.endsWith('open')
  const isClosed = sidebarState.endsWith('closed')

  return (
    <TokenThemeWrapper
      sourceId={sourceId}
      className={twMerge(
        'relative w-full',
        'flex items-center justify-between gap-3',
        'bg-token-color rounded-standard',
        isDesktop
          ? isClosed
            ? 'flex-col gap-1 text-center'
            : 'h-12 flex-row px-3'
          : isClosed
            ? 'h-18 flex-row'
            : 'h-12 flex-row px-3',
      )}
    >
      <div
        className={twJoin(
          'flex items-center',
          isDesktop
            ? isClosed
              ? 'flex-col gap-1 py-3'
              : 'flex-row gap-3'
            : isClosed
              ? 'flex-row gap-3 px-3 py-1'
              : 'flex-row gap-3 py-3',
        )}
      >
        <SourceBadge sourceId={sourceId} />

        <div
          className={twJoin(
            'flex items-baseline',
            isDesktop
              ? ['gap-1', isClosed ? 'flex-col items-center' : 'flex-row']
              : isClosed
                ? 'flex-col'
                : 'flex-row gap-1',
          )}
        >
          <span className="font-extrabold">
            {totalLockedTokens.toLocaleString()}
          </span>
          <span className="denom">{sourceId}</span>
        </div>
      </div>

      <div
        className={twJoin(
          'flex items-center justify-center gap-2',
          isClosed && 'bg-darkened w-full py-2',
          isMobile && 'h-full',
        )}
      >
        <div
          className={twJoin(
            'flex items-center gap-1',
            isMobile && isClosed && 'flex-col',
          )}
        >
          <span className="label">Round</span>
          <span className="important-value">{currentRoundId}</span>
        </div>

        <button className={twJoin('btn-icon btn-inline', isClosed && 'hidden')}>
          <Icon name="solid:caret-down" />
        </button>
      </div>
    </TokenThemeWrapper>
  )
}
