import { BidRevampMetrics } from '@/contract-apis/types'
import { supabase } from '@/lib/supabase'
import { environments, getEnvironment } from '@v2/environments'
import { DataPromises } from '@v2/types'
import { headers } from 'next/headers'

export function fetchData(): DataPromises {
  const environment = getEnvironment()
  const bidDescriptionsCacheDuration = environments[environment].externalDataCacheDuration

  const bidDescriptionsPromise = headers()
    .then((headers) => headers.get('x-url') ?? '')
    .then((baseUrl) =>
      fetch(new URL(`/api/v2/bid_descriptions`, baseUrl), {
        next: { revalidate: bidDescriptionsCacheDuration },
      }).then((response) =>
        response.json(),
      ),
    )

  const hydroDataPromise = headers()
    .then((headers) => headers.get('x-url') ?? '')
    .then(async (baseUrl) => {
      const { sources } = environments[environment]

      return Promise.all(
        sources.map(async (source) => {
          const urlPrefix = `/api/v2/${environment}/${source.id}`
          const cacheDuration = source.cacheDuration

          const [constants, currentRound, totalLockedTokens, tranches] =
            await Promise.all([
              fetch(new URL(`${urlPrefix}?operation=constants`, baseUrl), {
                next: { revalidate: cacheDuration },
              }).then(
                (response) => response.json(),
              ),
              fetch(new URL(`${urlPrefix}?operation=current_round`, baseUrl), {
                next: { revalidate: cacheDuration },
              }).then(
                (response) => response.json(),
              ),
              fetch(new URL(`${urlPrefix}?operation=total_locked_tokens`, baseUrl), {
                next: { revalidate: cacheDuration },
              }).then(
                (response) => response.json(),
              ),
              fetch(new URL(`${urlPrefix}?operation=tranches`, baseUrl), {
                next: { revalidate: cacheDuration },
              }).then(
                (response) => response.json(),
              ),
            ])

          const { data } = await supabase
            .from('augmented_round_bids')
            .select('data')
            .eq('hydro_contract', source.hydroContract)
            .eq('round_id', currentRound.round_id)

          const augmentedBids = data?.map((bid) => bid.data) ?? []

          const roundPrices = await fetch(
            new URL(`${urlPrefix}/round_prices?chainId=${source.priceChainId}&roundId=${currentRound.round_id}&cacheDuration=${cacheDuration}`, baseUrl),
            {
              next: { revalidate: cacheDuration },
            }
          ).then((response) => response.json())

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
