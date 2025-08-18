import { BidderPage } from "./BidderPage"

export default async function Page({
  params,
}: {
  params: Promise<{ roundNumber?: string }>
}) {
  const roundNumberParam = (await params).roundNumber
  const requestedRoundNumber =
    typeof roundNumberParam === "undefined"
      ? null
      : String(roundNumberParam) === "experimental"
        ? String(roundNumberParam)
        : Number(roundNumberParam)

  return <BidderPage requestedRoundNumber={requestedRoundNumber} />
}
