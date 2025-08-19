// path: app/(with-backend-data)/bidder/[[...roundNumber]]/components/AddTributeModal.tsx
"use client"

import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { AugmentedBidAfterWallet } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { buildDenomOptions } from "../buildDenomOptions"
import { useAccountBalances } from "../hooks/useAccountBalances"
import { useDenomOptionsWithBalances } from "../hooks/useDenomOptionsWithBalances"
import { gtIntStr, isPositiveDecimalString, toBaseUnitsStr, toDisplayRawFromBaseStr } from "../utils/toBaseUnits"
import { AmountField } from "./AmountField"
import { AssetSelectField } from "./AssetSelectField"

export function AddTributeModal({
  bid,
  isOpened,
  onCloseAction,
  onCloseCompleteAction,
}: {
  bid: AugmentedBidAfterWallet
  isOpened: boolean
  onCloseAction: () => void
  onCloseCompleteAction: (amountBase: string, denom: string, description?: string) => void
}) {
  const { currentRoundPrices } = useBackendData()
  const denomOptionsAll = useMemo(() => buildDenomOptions(currentRoundPrices), [currentRoundPrices])

  const neutron = useChain("neutron")

  const { balances } = useAccountBalances({
    isOpened,
    address: neutron.address,
    getStargateClient: neutron.getStargateClient,
  })

  const [denom, setDenom] = useState<string>("")
  const [amount, setAmount] = useState<string>("")

  // Filter options to those with non-zero balance when connected (your existing hook)
  const { withBal } = useDenomOptionsWithBalances({
    denomOptions: denomOptionsAll,
    balances,
    isConnected: Boolean(neutron.address),
  })

  // If the selected denom disappears from options, reset it
  useEffect(() => {
    if (denom && !withBal.find((o) => o.value === denom)) setDenom("")
  }, [withBal, denom])

  // Selected meta
  const selected = useMemo(() => withBal.find(o => o.value === denom), [withBal, denom])
  const exponent = selected?.exponent ?? 6
  const balanceBaseStr = String(balances[denom] ?? "0")

  // Convert input → base units (string math)
  const amountBase = useMemo(() => toBaseUnitsStr(amount, exponent), [amount, exponent])

  // Validation
  const denomOk = !!selected
  const amountOk = isPositiveDecimalString(amount) && Number(amount) > 0
  const notEnough = useMemo(() => gtIntStr(amountBase, balanceBaseStr), [amountBase, balanceBaseStr])
  const canSubmit = denomOk && amountOk && !notEnough

  // UI labels
  const availableLabel = useMemo(
    () => formatAmount(balanceBaseStr, exponent, 4),
    [balanceBaseStr, exponent]
  )
  const maxRaw = useMemo(
    () => toDisplayRawFromBaseStr(balanceBaseStr, exponent),
    [balanceBaseStr, exponent]
  )

  const submit = () => {
    if (!canSubmit) return
    onCloseCompleteAction(amountBase, denom)
  }

  const assetsForSelect = useMemo(
    () => withBal.map(o => ({ name: o.name, value: o.value, price: o.price })),
    [withBal]
  )

  return (
    <ModalWindow isOpen={isOpened} onClose={onCloseAction} onCloseComplete={submit}>
      <div className="rounded-xl border-2 border-white/20 bg-black p-0 max-w-[95%]">
        <div className="h-[48px] gap-[10px] rounded-t-xl bg-[rgba(255,225,184,0.1)] px-6 py-3 text-lg">
          <h2 className="font-inter text-[18px] font-bold leading-6 flex items-center gap-2 min-w-0">
            {bid.projectLogoUrl ? (
              <Image
                className="object-contain shrink-0"
                src={bid.projectLogoUrl}
                alt={bid.projectTitle || bid.title}
                width={18}
                height={18}
              />
            ) : null}
            <span className="whitespace-nowrap inline-flex items-end gap-2 min-w-0">
              <span >Add Tribute</span>
              <span className="font-extralight text-sm text-white/80">
                to&nbsp;
                <span >
                  {bid.projectTitle || bid.title}
                </span>
              </span>
            </span>
          </h2>
        </div>

        <div className="space-y-6 p-[24px]">
          <StyledText as="div" variant="label">
            Select asset and fill amount
          </StyledText>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        

            {/* Asset */}
            <AssetSelectField
              value={denom}
              onChange={setDenom}
              options={assetsForSelect}
              disabled={assetsForSelect.length === 0}
            />

            {/* Amount */}
            <AmountField
              amount={amount}
              onAmountChange={setAmount}
              disabled={withBal.length === 0 || !denomOk}
              availableText={denomOk ? `${availableLabel} ${selected?.name ?? ""}` : ""}
              onMax={() => denomOk && setAmount(maxRaw)}
              showOverBalanceError={Boolean(amount && notEnough)}
              usdApprox={selected?.price && Number(amount) > 0 ? Number(amount) * selected.price : null}
            />

              

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <StyledText as="button" variant="button.secondary" type="button" onClick={onCloseAction}>
                Cancel
              </StyledText>
              <StyledText
                as="button"
                variant="button.primary"
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                tooltip={
                  assetsForSelect.length === 0
                    ? "You have no balance that can be used as tribute, please add funds"
                    : !denomOk
                      ? "Select an asset"
                      : !amountOk
                        ? "Enter a valid amount"
                        : notEnough
                          ? "Amount exceeds your available balance"
                          : undefined
                }
              >
                Add
              </StyledText>
            </div>
          </form>
        </div>
      </div>
    </ModalWindow>
  )
}
