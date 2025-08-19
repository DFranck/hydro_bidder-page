// FILE: AddTributeModal.tsx
"use client"

import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { AugmentedBidAfterWallet } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"
import { useEffect, useId, useMemo, useState } from "react"

// ---- UI sous-composant (1 seule ligne) ----
function TributeRow({
  denom, setDenom,
  amount, setAmount,
  options,
}: {
  denom: string
  setDenom: (v: string) => void
  amount: string
  setAmount: (v: string) => void
  options: Array<{ name: string; value: string }>
}) {
  const assetId = useId()
  const amountId = useId()
  return (
    <>
    <fieldset className="rounded-lg border border-white/20 bg-black/40">
      <div className="grid grid-cols-[minmax(10rem,1fr)_minmax(8rem,1fr)] items-stretch">
        {/* Asset */}
        <div className="relative p-3">
          <label htmlFor={assetId} className="absolute -top-2 left-3 bg-black px-1 text-[11px] leading-none text-white/60">
            Asset
          </label>
          <select
            id={assetId}
            value={denom}
            onChange={(e) => setDenom(e.target.value)}
            className="w-full bg-black outline-none border-0 focus:ring-0 cursor-pointer"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.name}</option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
    <fieldset className="rounded-lg border border-white/20 bg-black/40">
      <div className="grid grid-cols-[minmax(10rem,1fr)_minmax(8rem,1fr)] items-stretch">
        {/* Amount */}
        <div className="relative p-3 border-l border-white/10">
          <label htmlFor={amountId} className="absolute -top-2 left-3 bg-black px-1 text-[11px] leading-none text-white/60">
            Amount
          </label>
          <input
            id={amountId}
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent outline-none border-0 focus:ring-0"
          />
        </div>
      </div>
    </fieldset>

    </>
  )
}

// ---- Modal principal (1 tribute) ----
export function AddTributeModal({
  bid,
  isOpened,
  onCloseAction,
  onCloseCompleteAction,
}: {
  bid: AugmentedBidAfterWallet
  isOpened: boolean
  onCloseAction: () => void
  onCloseCompleteAction: (
    amount: string,   // base units
    denom: string,
    description: string
  ) => void
}) {
  const { currentRoundPrices } = useBackendData()

  // options sûres même si currentRoundPrices est vide/incomplet
  const denomList = useMemo(() => {
    const entries = Object.entries(currentRoundPrices ?? {})
    if (entries.length === 0) {
      // fallback dev (optionnel)
      return [
        { name: "NTRN", value: "untrn" },
        { name: "ATOM", value: "uatom" },
      ]
    }
    return entries.map(([value, asset]) => {
      const raw = asset?.token_symbol ?? value
      return {
        name: typeof raw === "string" ? raw.replace(".", " ") : String(raw),
        value,
      }
    })
  }, [currentRoundPrices])

  const [denom, setDenom] = useState<string>(denomList[0]?.value ?? "untrn")
  const [amount, setAmount] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  // si la liste change (API/tweak), on ajuste le denom si nécessaire
  useEffect(() => {
    if (!denomList.find(o => o.value === denom)) {
      setDenom(denomList[0]?.value ?? "untrn")
    }
  }, [denomList, denom])

  // helpers de conversion robustes
  const pow10 = (exp: number) => (BigInt(10) ** BigInt(exp))
  const toBaseUnits = (displayAmount: string, exp: number) => {
    const norm = (displayAmount ?? "").trim().replace(",", ".")
    if (!/^\d*\.?\d*$/.test(norm) || norm === "" || norm === ".") return "0"
    const [i, f = ""] = norm.split(".")
    const iSafe = i === "" ? "0" : i
    const fPadded = (f + "0".repeat(exp)).slice(0, exp)
    const total =
      BigInt(iSafe || "0") * pow10(exp) +
      BigInt(fPadded === "" ? "0" : fPadded)
    return total.toString()
  }

  // validation minimaliste : denom valide + amount > 0
  const exp = currentRoundPrices?.[denom]?.token_exponent ?? 6
  const amountBase = toBaseUnits(amount, exp)
  const amountOk = (() => {
    const n = Number(amount)
    return Number.isFinite(n) && n > 0
  })()
  const denomOk = Boolean(denomList.find(o => o.value === denom))
  const canSubmit = denomOk && amountOk

  const submit = () => {
    if (!canSubmit) return
    onCloseCompleteAction(amountBase, denom, description)
  }

  useEffect(() => {
    if (isOpened) console.log("[AddTributeModal] bid opened:", bid)
  }, [isOpened, bid])

  return (
    <ModalWindow
      isOpen={isOpened}
      onClose={onCloseAction}
      onCloseComplete={submit}
    >
      <div className="rounded-xl border-2 border-white/20 bg-black p-0">
        <div className="h-[48px] gap-[10px] rounded-t-xl bg-[#FFE1B81A] px-6 py-3 text-lg">
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
            <span className="inline-flex items-end gap-2 min-w-0">
              <span className="truncate">Add Tribute</span>
              <span className="font-extralight text-sm text-white/80">
                to&nbsp;
                <span className="truncate max-w-[14rem] align-bottom">
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
            <TributeRow
              denom={denom}
              setDenom={setDenom}
              amount={amount}
              setAmount={setAmount}
              options={denomList}
            />

            {/* <div className="flex flex-col gap-1">
              <StyledText as="label" variant="label">
                Description (optional)
              </StyledText>
              <StyledText
                as="textarea"
                className="w-full"
                rows={2}
                variant="input.text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note about this tribute..."
              />
            </div> */}

            <div className="flex justify-end gap-2 pt-2">
              <StyledText
                as="button"
                variant="button.secondary"
                type="button"
                onClick={onCloseAction}
              >
                Cancel
              </StyledText>
              <StyledText
                as="button"
                variant="button.primary"
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                tooltip={
                  !denomOk
                    ? "Select an asset"
                    : !amountOk
                      ? "Enter a valid amount"
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
