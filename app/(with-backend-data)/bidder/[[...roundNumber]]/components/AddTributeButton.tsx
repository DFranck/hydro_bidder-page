"use client"

import { ErrorBox } from "@/components/ErrorBox"
import { StyledText, StyledTextVariant } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useChain } from "@cosmos-kit/react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { executeAddTribute } from "../transactions/executeAddTribute"
import { canAddTribute } from "../utils/tributeRules"
import { AddTributeModal } from "./AddTributeModal"

export function AddTributeButton({
  bidId,
  size,
  onAfterSuccess,
}: {
  bidId: number
  size?: "large" | "small"
  onAfterSuccess?: () => void
}) {
  const router = useRouter()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { address, bidsInfo, isWalletConnected, currentRoundId } =
    useBackendData()
  const { setToasts } = useToasts()

  const bid = bidsInfo[bidId]
  const verdict = useMemo(
    () =>
      bid
        ? canAddTribute(bid, currentRoundId)
        : {
            ok: false as const,
            reason: "Bid not found",
            warnings: [] as string[],
          },
    [bid, currentRoundId]
  )

  if (!bid) return <ErrorBox>The requested bid could not be found.</ErrorBox>

  const disabled = !isWalletConnected || !verdict.ok || submitting
  const tooltip = !isWalletConnected
    ? "Please connect your wallet to add a tribute."
    : verdict.ok
      ? undefined
      : verdict.reason

  const onCloseComplete = async (
    amountBase: string,
    denom: string,
    description?: string
  ) => {
    setToasts([toastMessages.addingTributeInProgress])
    setSubmitting(true)
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

      const res = await fetch("/api/refresh-hydro-rounds-data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roundIds: [Number(bid.roundId)] }),
      })
      if (!res.ok) throw new Error(await res.text())

      setToasts([toastMessages.addingTributeSuccess])
      setIsModalOpened(false)
      router.refresh()
      onAfterSuccess?.()
    } catch (error) {
      setToasts([toastMessages.addingTributeError(error as Error)])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <StyledText
        as="button"
        variant={`button.primary${size ? "." + size : ""}` as StyledTextVariant}
        type="button"
        onClick={() => setIsModalOpened(true)}
        disabled={disabled}
        tooltip={tooltip}
      >
        Add Tribute
      </StyledText>

      {isModalOpened && (
        <AddTributeModal
          bid={bid}
          isOpened
          warnings={verdict.ok ? verdict.warnings : []}
          onCloseAction={() => setIsModalOpened(false)}
          onCloseCompleteAction={onCloseComplete}
          submitting={submitting}
        />
      )}
    </>
  )
}
