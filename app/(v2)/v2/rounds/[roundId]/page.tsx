export default async function BidsRoundPage({
  params,
}: {
  params: Promise<{ roundId: string }>
}) {
  const { roundId } = await params

  return <div>Here is where we will show the bids for round {roundId}</div>
}
