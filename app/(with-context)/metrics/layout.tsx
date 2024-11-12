import { MetricsProvider } from "@/app/(with-context)/metrics/context"

async function getMetrics() {
  const metrics = await fetch(
    `https://www.datalenses.zone/numia/cosmos/lensesV2/hydro/deployments_overview`
  )
  return metrics.json()
}

export default async function MetricsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const metrics = await getMetrics()
  return (
    <MetricsProvider preHydroProposals={metrics}>{children}</MetricsProvider>
  )
}
