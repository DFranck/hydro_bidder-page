"use client"

import { StyledText } from "@/components/StyledText"

type Props = {
  amount: string
  onAmountChange: (v: string) => void
  disabled?: boolean
  availableText?: string
  onMax?: () => void
  showOverBalanceError?: boolean
  usdApprox?: number | null
}

export function AmountField({
  amount,
  onAmountChange,
  disabled,
  availableText,
  onMax,
  showOverBalanceError,
  usdApprox,
}: Props) {
  const formatUSD = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(n)

  return (
    <div>
      <fieldset className="rounded-lg border border-white/20 bg-black/40">
        <div className="relative p-3">
          <label className="absolute -top-2 left-3 bg-black px-1 text-[11px] leading-none text-white/60">
            Amount
          </label>

          {/* End-adornment: ≈ $… (se décale à droite) */}
          {usdApprox != null && Number.isFinite(usdApprox) && (
            <span
              className="pointer-events-none absolute top-1/2 right-9 -translate-y-1/2 text-sm text-white/70"
              aria-hidden="true"
            >
              ≈ {formatUSD(usdApprox)}
            </span>
          )}

          <StyledText
            as="input"
            disabled={disabled}
            type="number"
            inputMode="decimal"
            step="any"
            min={0}
            placeholder="0.00"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full border-0 bg-transparent outline-none focus:ring-0 "
          />
        </div>
      </fieldset>

      {availableText && (
        <div className="mt-2 flex items-center justify-between text-xs text-white/60">
          <span>
            Available:&nbsp;
            <span className="text-white/80">{availableText}</span>
          </span>
          <button
            type="button"
            className="underline decoration-dotted hover:text-white/90 disabled:opacity-50"
            onClick={onMax}
            disabled={!onMax}
          >
            Max
          </button>
        </div>
      )}

      {showOverBalanceError && (
        <div className="mt-2 text-xs text-red-300">
          Amount exceeds your available balance.
        </div>
      )}
    </div>
  )
}
