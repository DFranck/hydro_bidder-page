import { ClientComponent } from "./ClientComponent"

export default async function Page({
  params,
}: {
  params: Promise<{ roundNumber?: string }>
}) {
  const roundNumberParam = (await params).roundNumber
  const requestedRoundNumber =
    typeof roundNumberParam === "undefined" ? null : Number(roundNumberParam)
  const requestedRoundNumberUnderHood = requestedRoundNumber
    ? requestedRoundNumber - 1
    : null
  const isPreHydro = requestedRoundNumber === null

  return (
    <ClientComponent
      requestedRoundNumberUnderHood={requestedRoundNumberUnderHood}
      isPreHydro={isPreHydro}
    />
  )
}
