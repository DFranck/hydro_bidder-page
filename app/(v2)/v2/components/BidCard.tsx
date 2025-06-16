import { Icon } from '@/components/Icon'
import { plural } from '@/lib/pluralize'
import { SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/provider'
import Image from 'next/image'
import { twJoin, twMerge } from 'tailwind-merge'

export function BidCard({
  sourceId,
  bidId,
  className,
  ...otherProps
}: React.ComponentProps<'div'> & {
  sourceId: SourceID
  bidId: number
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const userVotedOnBidIds: number[] = []
  const userHasVotedOnThisBid = userVotedOnBidIds.includes(bidId)
  const augmentedBids =
    currentRoundDataPerSource?.[sourceId]?.augmentedBids ?? []
  const bid = augmentedBids?.find((bid) => bid.id === bidId)

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]

  return (
    <div
      id={`bid-card--${sourceId}-${bidId}`}
      tabIndex={0}
      className={twMerge(
        'group overflow-hidden',
        'grid grid-cols-[min-content_auto] items-center',
        'outline-none',
        'bg-token-color/20 rounded-standard',
        'hover:bg-token-color/40',
        'focus-within:bg-token-color/60!',
        className,
      )}
      {...otherProps}
    >
      <div
        className={twJoin(
          'flex items-center justify-center',
          'bg-token-color/40',
          'p-standard',
          'desktop:p-loose',
        )}
      >
        <div className={twJoin('size-12', 'bg-palette-beige')}>
          {bidDescription?.projectLogoUrl && (
            <Image
              src={bidDescription.projectLogoUrl}
              alt={bidDescription.projectName ?? bidDescription.title}
              width={48}
              height={48}
            />
          )}
        </div>
      </div>

      <div
        className={twJoin(
          'flex items-center justify-between',
          'px-standard gap-standard',
          'desktop:px-loose desktop:gap-loose',
        )}
      >
        <h3 className="label">{bid.title}</h3>

        <div
          className={twJoin(
            'gap-standard',
            'flex items-center justify-end',
            'text-faded text-xs',
          )}
        >
          <div className="flex items-center gap-2">
            <span>{bid.duration}</span>
            <span>{plural(bid.duration, 'month')}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>??%</span>
          </div>

          <button className={twJoin('btn-primary btn-inline btn-inverted')}>
            <Icon
              name={userHasVotedOnThisBid ? 'circle-check' : 'circle-dashed'}
            />
            <span>{userHasVotedOnThisBid ? 'Change Vote' : 'Vote'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
