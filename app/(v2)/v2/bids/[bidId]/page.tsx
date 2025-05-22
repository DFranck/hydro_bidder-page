export default async function BidsRoundPage({
  params,
}: {
  params: Promise<{ bidId: string }>
}) {
  const { bidId } = await params

  return <div>Here is where we will show bid {bidId}</div>
}
