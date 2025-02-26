import { AppWrapper } from "@/components/AppWrapper"
import { fetchBackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import omit from "lodash/omit"
import { ReactNode } from "react"
import "server-only"

export default async function LayoutWithContext({
  children,
}: {
  children: ReactNode
}) {
  const rawBackendDataBeforeWallet = await fetchBackendDataBeforeWallet()
  const backendDataBeforeWalletSlimmed = {
    ...rawBackendDataBeforeWallet,
    externalData: {
      ...rawBackendDataBeforeWallet.externalData,
      bidMetaDataById: Object.fromEntries(
        Object.entries(
          rawBackendDataBeforeWallet.externalData.bidMetaDataById
        ).map(([bidId, bidMetaData]) => [
          bidId,
          omit(bidMetaData, [
            "aboutProject",
            "appendix",
            "committeeComments",
            "description",
          ]),
        ])
      ),
    },
    hydroData: {
      ...rawBackendDataBeforeWallet.hydroData,
      proposals: rawBackendDataBeforeWallet.hydroData.proposals.map(
        (proposal) => omit(proposal, ["description"])
      ),
    },
  }

  return (
    <AppWrapper backendDataBeforeWalletSlimmed={backendDataBeforeWalletSlimmed}>
      {children}
    </AppWrapper>
  )
}
