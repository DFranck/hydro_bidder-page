import { BidDetails } from "./BidDetails"

export default async function BidDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const idParam = (await params).id

  return <BidDetails bidId={idParam} />
}
