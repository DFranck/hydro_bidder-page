import { AppWrapper } from "@/components/AppWrapper"
import { fetchBackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { ReactNode } from "react"

export default async function LayoutWithContext({
  children,
}: {
  children: ReactNode
}) {
  const backendData = await fetchBackendDataBeforeWallet()

  return <AppWrapper backendData={backendData}>{children}</AppWrapper>
}
