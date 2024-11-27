import { AppContextProvider } from "@/app/(with-context)/context"
import { endpoints } from "@/config"
import { fetchAllValidators } from "@/contract-apis/fetchAllValidators"
import { fetchBackendDataWithoutAddress } from "@/contract-apis/fetchBackendDataWithoutAddress"
import { fetchDashboardData } from "@/contract-apis/fetchDashboardData"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"
import { ContractContextProvider } from "@/contract-apis/useContractContext"

export default async function VotingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const backendData = await fetchBackendDataWithoutAddress()
  const dashboardData = await fetchDashboardData()
  const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])
  const validatorMap = new Map(
    validators.map((validator) => [validator.operator_address, validator])
  )

  return (
    <AppContextProvider value={{ ...dashboardData, validatorMap }}>
      <BackendDataContextProvider backendData={backendData}>
        <ContractContextProvider>{children}</ContractContextProvider>
      </BackendDataContextProvider>
    </AppContextProvider>
  )
}
