"use client"

import { ErrorBox } from "@/components/ErrorBox"
import { StyledText, StyledTextVariant } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { AddTributeModal } from "@/components/Tributes/AddTributeModal"
import { Wallet } from "@/components/wallet/Wallet"
import { executeWalletAddTribute } from "@/contract-apis/executeWalletAddTribute"
import { useBackendData } from "@/contract-apis/useBackendData"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function AddTributeButton({
  bidId,
  size,
}: {
  bidId: number
  size?: "large" | "small"
}) {
  const router = useRouter()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const { address, bidsById, isWalletConnected } = useBackendData()
  const { setToasts } = useToasts()

  const bid = bidsById[bidId]

  if (!bid) {
    return <ErrorBox>The requested bid could not be found.</ErrorBox>
  }

  const onCloseComplete = async (
    amount: string,
    denom: string,
    description: string
  ) => {
    setToasts([toastMessages.addingTributeInProgress])

    try {
      await executeWalletAddTribute({
        address: address!,
        proposalId: Number(bidId),
        trancheId: Number(bid.trancheId),
        roundId: Number(bid.roundId),
        amount: amount,
        denom,
        description,
        getSigningCosmWasmClient,
      })

      setToasts([toastMessages.addingTributeSuccess])

      await revalidateTag("backendData")

      setTimeout(() => {
        router.refresh()
      }, 3000)
    } catch (error: any) {
      setToasts([toastMessages.addingTributeError(error as Error)])
    }
  }

  return (
    <>
      {isWalletConnected ? (
        <StyledText
          as="button"
          variant={
            `button.primary${size ? "." + size : ""}` as StyledTextVariant
          }
          type="button"
          onClick={() => setIsModalOpened(true)}
        >
          Add Tribute
        </StyledText>
      ) : (
        <Wallet
          variant={
            `button.primary${size ? `.${size}` : ""}` as StyledTextVariant
          }
          notifyConnectedCB={() => null}
        />
      )}
      <AddTributeModal
        bid={bid}
        isOpened={isModalOpened}
        onCloseAction={() => setIsModalOpened(false)}
        onCloseCompleteAction={onCloseComplete}
      />
    </>
  )
}
