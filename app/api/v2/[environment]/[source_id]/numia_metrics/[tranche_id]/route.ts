import { Environment, getSource, SourceID } from "@/app/(v2)/v2/environments"

const NUMIA_METRICS_URL = "https://cosmos.numia.xyz/hydro/v2/metrics"

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      environment: Environment
      source_id: SourceID
      tranche_id: string
    }>
  }
) {
  const { environment, source_id, tranche_id } = await params

  const sourceObject = getSource(environment, source_id)

  const { hydroContract } = sourceObject

  const url = new URL(NUMIA_METRICS_URL)
  url.searchParams.set("hydro_contract", hydroContract)
  url.searchParams.set("tranche_id", tranche_id)

  const numiaMetricsResponse = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 60 * 60 },
  })

  const numiaMetrics = await numiaMetricsResponse.json()

  return Response.json(numiaMetrics)
}
