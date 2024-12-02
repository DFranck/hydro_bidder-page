import { BidDetails } from "@/components/BidDetails"

export default async function BidDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const idParam = (await params).id
  return <BidDetails bidId={Number(idParam)} />
}
