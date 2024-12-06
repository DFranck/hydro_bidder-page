import { AppWrapper } from "@/components/AppWrapper"
import { fetchBackendDataWithoutAddress } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { ReactNode } from "react"

export default async function LayoutWithContext({
  children,
}: {
  children: ReactNode
}) {
  const backendData = await fetchBackendDataWithoutAddress()

  return <AppWrapper backendData={backendData}>{children}</AppWrapper>
}
