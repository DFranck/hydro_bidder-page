import { AppWrapper } from "@/components/AppWrapper"
import { fetchBackendDataWithoutAddress } from "@/contract-apis/fetchBackendDataWithoutAddress"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"
import { ReactNode } from "react"

export default async function LayoutWithContext({
  children,
}: {
  children: ReactNode
}) {
  const backendData = await fetchBackendDataWithoutAddress()
  return (
    <AppWrapper>
      <BackendDataContextProvider backendData={backendData}>
        {children}
      </BackendDataContextProvider>
    </AppWrapper>
  )
}
