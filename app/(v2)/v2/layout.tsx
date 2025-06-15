import { BidRevampMetrics } from '@/contract-apis/types'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@v2/components/LoadingSpinner'
import { environments, getEnvironment } from '@v2/environments'
import { AppContextProvider } from '@v2/state/provider'
import { headers } from 'next/headers'
import React from 'react'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = await headers().then((headers) => headers.get('x-url') ?? '')
  const environment = getEnvironment()
  const { sources } = environments[environment]

  const hydroDataPromise = Promise.all(
    sources.map(async (source) => {
      const urlPrefix = `/api/v2/${environment}/${source.id}`

      const [constants, currentRound, totalLockedTokens, tranches] =
        await Promise.all([
          fetch(new URL(`${urlPrefix}/constants`, baseUrl)).then((response) =>
            response.json(),
          ),
          fetch(new URL(`${urlPrefix}/current_round`, baseUrl)).then(
            (response) => response.json(),
          ),
          fetch(new URL(`${urlPrefix}/total_locked_tokens`, baseUrl)).then(
            (response) => response.json(),
          ),
          fetch(new URL(`${urlPrefix}/tranches`, baseUrl)).then((response) =>
            response.json(),
          ),
        ])

      const { data } = await supabase
        .from('augmented_round_bids')
        .select('data')
        .eq('hydro_contract', source.hydroContract)
        .eq('round_id', currentRound.round_id)

      const augmentedBids = data?.map((bid) => bid.data) ?? []

      return {
        sourceId: source.id,
        data: {
          constants,
          totalLockedTokens: Math.floor(totalLockedTokens / 1e6),
          currentRound,
          tranches,
          augmentedBids: augmentedBids as unknown as BidRevampMetrics[],
        },
      }
    }),
  )

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <AppContextProvider hydroDataPromise={hydroDataPromise}>
        {children}
      </AppContextProvider>
    </React.Suspense>
  )
}
