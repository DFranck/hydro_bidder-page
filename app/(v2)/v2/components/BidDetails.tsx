'use client'

import { MarkdownContainer } from '@/components/MarkdownContainer'
import { TokenThemeWrapper } from '@v2/components/TokenThemeWrapper'
import { getEnvironment, getSource, SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/ClientDataProvider'
import sumBy from 'lodash/sumBy'
import { twJoin, twMerge } from 'tailwind-merge'

export function BidDetails({
  sourceId,
  bidId,
  className,
}: {
  sourceId: SourceID
  bidId: number
  className?: string
}) {
  const { state } = useAppState()
  const { currentRoundDataPerSource, bidDescriptionsById } = state
  const source = getSource(getEnvironment(), sourceId)
  const bid = currentRoundDataPerSource?.[sourceId]?.augmentedBids?.find(
    (bid) => bid.id === bidId,
  )

  if (!bid) return null

  const bidDescription = bidDescriptionsById[bidId]

  return (
    <TokenThemeWrapper
      as="article"
      sourceId={sourceId}
      className={twMerge(
        'grid grid-rows-[min-content_auto]',
        'h-full',
        className,
      )}
    >
      <div>
        <header
          className={twJoin(
            'h-bar-height-large',
            'flex items-center',
            'px-loosest py-standard',
            'bg-token-color',
          )}
        >
          <h1 className="title">{bidDescription?.title}</h1>
        </header>

        <div
          className={twJoin(
            'p-loosest bg-token-color/20',
            'gap-loosest flex flex-wrap',
          )}
        >
          {[
            ['Project Name', bidDescription?.projectName],
            ['Bid in Round', bid.roundId + 1],
            ['Voter APR', bid.apr_tribute?.toFixed(2) || '–'],
            [
              'Max Deployment Amount',
              sumBy(
                bid.liquidityDeployment?.deployedFunds,
                'printableAmount',
              )?.toFixed(2) || '–',
            ],
          ].map(([label, value]) => (
            <div key={label} className="gap-tight flex flex-col">
              <div className="label">{label}</div>
              <div className="important-value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-loosest overflow-hidden overflow-y-auto text-balance">
        <MarkdownContainer content={bidDescription?.description} />
      </div>
    </TokenThemeWrapper>
  )
}
