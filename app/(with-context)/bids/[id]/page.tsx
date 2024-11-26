import { ClientComponent } from "./ClientComponent"

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const idParam = (await params).id

  return <ClientComponent bidId={idParam} />
}
