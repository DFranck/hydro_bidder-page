import { fetchBackendDataWithoutAddress } from "@/contract-apis/fetchBackendDataWithoutAddress"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"

export default async function VotingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const backendData = await fetchBackendDataWithoutAddress()
  // const dashboardData = await fetchDashboardData()
  // const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])
  // const validatorMap = new Map(
  //   validators.map((validator) => [validator.operator_address, validator])
  // )

  return (
    <BackendDataContextProvider backendData={backendData}>
      {children}
    </BackendDataContextProvider>
  )
}
