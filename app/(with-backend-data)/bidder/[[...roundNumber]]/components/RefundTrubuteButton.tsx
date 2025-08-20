// components/RefundTrubuteButton.tsx
"use client"

import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import type { BidRevampMetrics, TokenBasedTribute } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { executeRefundTribute } from "../transactions/executeRefundTribute"
import { canRefund } from "../utils/tributeRules"

type Props = {
  bid: BidRevampMetrics
  tribute: TokenBasedTribute
  onAfterSuccess?: () => void
}

const RefundTrubuteButton = ({ bid, tribute, onAfterSuccess }: Props) => {
  const router = useRouter()
  const { address, currentRoundId, isWalletConnected } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts } = useToasts()
const [submitting, setSubmitting] = useState(false)
  const verdict = canRefund(bid, tribute, currentRoundId, address ?? undefined)
  const disabled = !isWalletConnected || !verdict.ok || submitting
  const tooltip = !isWalletConnected
    ? "Please connect your wallet to refund."
    : verdict.ok
      ? undefined
      : verdict.reason

  const onRefund = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      setToasts([toastMessages.refundingTributeInProgress])
      await executeRefundTribute({
        address: address!,
        proposalId: Number(bid.id),
        roundId: Number(bid.roundId),
        trancheId: Number(bid.trancheId),
        tributeId: Number(tribute.id),
        getSigningCosmWasmClient,
      })
      const res = await fetch("/api/refresh-hydro-rounds-data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roundIds: [Number(bid.roundId)] }),
      })
      if (!res.ok) throw new Error(await res.text())
        
        setToasts([toastMessages.refundingTributeSuccess])
      router.refresh()
      onAfterSuccess?.()
    } catch (error: any) {
      setToasts([toastMessages.refundingTributeError(error as Error)])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StyledText
      as="button"
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      variant="button.primary.small"
      tooltip={tooltip}
      onClick={disabled ? undefined : onRefund}
    >
      {submitting ? "Refunding..." : tribute.refunded ? "Refunded" : "Refund"}
    </StyledText>
  )
}

export default RefundTrubuteButton
