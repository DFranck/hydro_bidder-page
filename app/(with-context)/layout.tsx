import { fetchBackendDataWithoutAddress } from "@/contract-apis/fetchBackendDataWithoutAddress"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"

export default async function VotingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const backendData = await fetchBackendDataWithoutAddress()
  return (
    <BackendDataContextProvider backendData={backendData}>
      {children}
    </BackendDataContextProvider>
  )
}
