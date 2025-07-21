import { Icon } from '@/components/Icon'
import { voteThresholdTooltip } from '@/components/ToolTips'
import { Tooltipped } from '@v2/components/Tooltipped'
import { twJoin } from 'tailwind-merge'

interface VoteThresholdIndicatorProps {
  trancheId: number
  voteThreshold: number
}

export function VoteThresholdIndicator({
  trancheId,
  voteThreshold,
}: VoteThresholdIndicatorProps) {
  return (
    <div className="@card-is-row:table-row">
      <div
        className={twJoin(
          '@card-is-row:relative @card-is-row:table-cell',
          'h-bar-height-standard',
        )}
      >
        <div
          className={twJoin(
            'h-full w-[100cqw]',
            'flex items-center justify-between',
            'gap-standard',
            'text-palette-beige text-xs whitespace-nowrap',
            '@card-is-row:absolute',
            '@card-is-row:top-1/2',
            '@card-is-row:-translate-y-1/2',
          )}
        >
          <div className="border-palette-beige w-full border-t-2" />
          <Tooltipped
            tip={voteThresholdTooltip({
              trancheId,
            })}
          >
            <div className="gap-tightest flex items-center">
              <Icon name="solid:circle-exclamation" />
              <span>
                These are below the{' '}
                <strong className="has-tooltip">
                  {voteThreshold * 100}% vote share threshold
                </strong>
              </span>
              <Icon name="circle-info" />
            </div>
          </Tooltipped>
          <div className="border-palette-beige w-full border-t-2" />
        </div>
      </div>
    </div>
  )
}
