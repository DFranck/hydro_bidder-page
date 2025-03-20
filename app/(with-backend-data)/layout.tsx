"use server"

import { AppWrapper } from "@/components/AppWrapper"
import { fetchBackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import omit from "lodash/omit"
import { ReactNode } from "react"

export default async function LayoutWithContext({
  children,
}: {
  children: ReactNode
}) {
  const rawBackendDataBeforeWallet = await fetchBackendDataBeforeWallet()

  const backendDataBeforeWalletSlimmed = {
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
    hydroMetaData: rawBackendDataBeforeWallet.hydroMetaData,
    hydroRoundData: rawBackendDataBeforeWallet.hydroRoundData.map(
      ({ round_bids, ...roundData }) => ({
        ...roundData,
        round_bids: round_bids.map((bid) => omit(bid, "description")),
      })
    ),
  }

  return (
    <AppWrapper backendDataBeforeWalletSlimmed={backendDataBeforeWalletSlimmed}>
      {children}
    </AppWrapper>
  )
}
