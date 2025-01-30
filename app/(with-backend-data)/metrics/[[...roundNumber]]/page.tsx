import { MetricsPage } from "./MetricsPage"

export default async function Page({
  params,
}: {
  params: Promise<{ roundNumber?: string }>
}) {
  const roundNumberParam = (await params).roundNumber
  const requestedRoundNumber =
    typeof roundNumberParam === "undefined" ? null : Number(roundNumberParam)

  return <MetricsPage requestedRoundNumber={requestedRoundNumber} />
}
