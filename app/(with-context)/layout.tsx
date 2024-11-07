import { AppContextProvider } from "@/app/(with-context)/context"
import { endpoints } from "@/config"
import { fetchAllValidators, fetchDashboardData } from "@/hooks/hooks"

export default async function VotingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dashboardData = await fetchDashboardData()
  const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])

  const validatorMap = new Map(
    validators.map((validator) => [validator.operator_address, validator])
  )

  return (
    <AppContextProvider value={{ ...dashboardData, validatorMap }}>
      {children}
    </AppContextProvider>
  )
}
