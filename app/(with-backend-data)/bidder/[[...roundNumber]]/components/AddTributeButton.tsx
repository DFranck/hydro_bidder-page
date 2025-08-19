"use client"

import { ErrorBox } from "@/components/ErrorBox"
import { StyledText, StyledTextVariant } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { useBackendData } from "@/contract-apis/useBackendData"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { executeAddTribute } from "../transactions/executeAddTribute"
import { AddTributeModal } from "./AddTributeModal"

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
  const { address, bidsInfo, isWalletConnected } = useBackendData()
  const { setToasts } = useToasts()

  const bid = bidsInfo[bidId]

  if (!bid) {
    return <ErrorBox>The requested bid could not be found.</ErrorBox>
  }

 const onCloseComplete = async (amountBase: string, denom: string, description: string) => {
    setToasts([toastMessages.addingTributeInProgress])
    try {
      await executeAddTribute({
        address: address!,
        proposalId: Number(bidId),
        roundId: Number(bid.roundId),
        trancheId: Number(bid.trancheId),
        amount: amountBase,
        denom,
        description,
        getSigningCosmWasmClient,
      })

      setToasts([toastMessages.addingTributeSuccess])
      await revalidateTag("backendData")
      setTimeout(() => router.refresh(), 3000)
    } catch (error: any) {
      setToasts([toastMessages.addingTributeError(error as Error)])
    }
  }

  return (
    <>
        <StyledText
          as="button"
          variant={
            `button.primary${size ? "." + size : ""}` as StyledTextVariant
          }
          type="button"
          onClick={() => setIsModalOpened(true)}
          disabled={!isWalletConnected}
          tooltip={!isWalletConnected ? "Please connect your wallet to add a tribute" : undefined}
        >
          Add Tribute
        </StyledText>
     
      {isModalOpened && ( 
      <AddTributeModal
        bid={bid}
        isOpened
        onCloseAction={() => setIsModalOpened(false)}
        onCloseCompleteAction={onCloseComplete}
      />
    )}
    </>
  )
}
