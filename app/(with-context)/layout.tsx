import { AppContextProvider } from "@/app/(with-context)/context"
import { endpoints } from "@/config"
import { fetchAllValidators } from "@/contract-apis/fetchAllValidators"
import { fetchDashboardData } from "@/contract-apis/fetchDashboardData"
import { ContractContextProvider } from "@/contract-apis/useContractContext"

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
      <ContractContextProvider>{children}</ContractContextProvider>
    </AppContextProvider>
  )
}
