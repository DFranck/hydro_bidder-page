import { AppWrapper } from "@/components/AppWrapper"
import { ReactNode } from "react"

export default async function LayoutWithContext({
  children,
}: {
  children: ReactNode
}) {
  return <AppWrapper withBackendData={true}>{children}</AppWrapper>
}
