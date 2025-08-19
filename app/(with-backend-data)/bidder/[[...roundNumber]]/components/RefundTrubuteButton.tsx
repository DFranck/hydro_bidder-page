"use client"

import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { useBackendData } from "@/contract-apis/useBackendData"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { executeRefundTribute } from "../transactions/executeRefundTribute"

type Props = {
  disabled: boolean
  tributeId: number
  proposalId: number
  roundId: number
  trancheId: number
  reason?: string           
}

const RefundTrubuteButton = ({
  disabled,
  tributeId,
  proposalId,
  roundId,
  trancheId,
  reason,
}: Props) => {
  const router = useRouter()
  const { isWalletConnected, address } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts } = useToasts()

  const effectiveDisabled = disabled || !isWalletConnected

  const tooltip =
    !isWalletConnected
      ? "Please connect your wallet to refund."
      : disabled
        ? (reason ?? "You cannot refund this tribute.")
        : undefined

  const onRefund = async () => {
    try {
      setToasts([toastMessages.refundingTributeInProgress])
      await executeRefundTribute({
        address: address!,
        proposalId: Number(proposalId),
        roundId: Number(roundId),
        trancheId: Number(trancheId),
        tributeId: Number(tributeId),
        getSigningCosmWasmClient,
      })
      setToasts([toastMessages.refundingTributeSuccess])
      await revalidateTag("backendData")
      router.refresh()
    } catch (error: any) {
      setToasts([toastMessages.refundingTributeError(error as Error)])
    }
  }

  return (
    <StyledText
      as="button"
      type="button"
      disabled={effectiveDisabled}
      aria-disabled={effectiveDisabled}
      variant={"button.primary.small"}
      tooltip={tooltip}
      onClick={effectiveDisabled ? undefined : onRefund}
    >
      Refund
    </StyledText>
  )
}

export default RefundTrubuteButton
