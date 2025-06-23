import { fetchRoundPrices } from '@/app/api/v2/[environment]/[source_id]/build_round_data/_helpers/fetchRoundPrices'
import { BidRevampMetrics } from '@/contract-apis/types'
import { supabase } from '@/lib/supabase'
import { environments, getEnvironment } from '@v2/environments'
import { headers } from 'next/headers'

export function fetchData() {
  const bidDescriptionsPromise = headers()
    .then((headers) => headers.get('x-url') ?? '')
    .then((baseUrl) =>
      fetch(new URL(`/api/v2/bid_descriptions`, baseUrl)).then((response) =>
        response.json(),
      ),
    )

  const hydroDataPromise = headers()
    .then((headers) => headers.get('x-url') ?? '')
    .then(async (baseUrl) => {
      const environment = getEnvironment()
      const { sources } = environments[environment]

      return Promise.all(
        sources.map(async (source) => {
          const urlPrefix = `/api/v2/${environment}/${source.id}`

          const [constants, currentRound, totalLockedTokens, tranches] =
            await Promise.all([
              fetch(new URL(`${urlPrefix}/constants`, baseUrl)).then(
                (response) => response.json(),
              ),
              fetch(new URL(`${urlPrefix}/current_round`, baseUrl)).then(
                (response) => response.json(),
              ),
              fetch(new URL(`${urlPrefix}/total_locked_tokens`, baseUrl)).then(
                (response) => response.json(),
              ),
              fetch(new URL(`${urlPrefix}/tranches`, baseUrl)).then(
                (response) => response.json(),
              ),
            ])

          const { data } = await supabase
            .from('augmented_round_bids')
            .select('data')
            .eq('hydro_contract', source.hydroContract)
            .eq('round_id', currentRound.round_id)

          const augmentedBids = data?.map((bid) => bid.data) ?? []

          const roundPrices = await fetchRoundPrices({
            chainId: source.priceChainId,
            roundId: currentRound.round_id,
          })

          const atomPrice = roundPrices[source.atomDenom]?.token_price ?? 0

          return {
            sourceId: source.id,
            data: {
              constants,
              totalLockedTokens: Math.floor(totalLockedTokens / 1e6),
              currentRound,
              tranches,
              augmentedBids: augmentedBids as unknown as BidRevampMetrics[],
              roundPrices,
              atomPrice,
            },
          }
        }),
      )
    })

  return {
    hydroDataPromise,
    bidDescriptionsPromise,
  }
}
