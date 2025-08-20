// File: app/(with-backend-data)/shared/AssetSelectField.tsx

"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useMemo } from "react"
import { twMerge } from "tailwind-merge"

export type AssetOption = {
  name: string
  value: string
  price?: number
}

type Props = {
  value: string
  options: AssetOption[]
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
  onChange: (val: string) => void
}

function InlineSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" aria-live="polite" aria-busy="true">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
        aria-hidden="true"
      />
      <span className="text-white/80">{label}</span>
    </span>
  )
}

export function AssetSelectField({
  value,
  options,
  disabled,
  loading = false,
  loadingLabel = "Loading assets…",
  onChange,
}: Props) {
  const selected = useMemo(() => options.find((o) => o.value === value), [options, value])
  const isDisabled = disabled || loading || options.length === 0

  return (
    <fieldset className="rounded-lg border border-white/20 bg-black/40">
      <div className="relative py-1">
        <label className="absolute -top-2 left-3 bg-black px-1 text-[11px] leading-none text-white/60">
          Asset
        </label>

        <div className="flex items-center">
          <Select value={value} onValueChange={onChange} disabled={isDisabled}>
            <SelectTrigger
              className="w-full rounded-md bg-black border-0 ring-0 cursor-pointer disabled:cursor-not-allowed"
              aria-busy={loading ? "true" : "false"}
              aria-live="polite"
            >
              <div className="flex w-full items-center justify-between">
                <span>
                  {loading ? (
                    <InlineSpinner label={loadingLabel} />
                  ) : isDisabled && options.length === 0 ? (
                    "No available assets"
                  ) : (
                    selected?.name ?? "Select asset"
                  )}
                </span>

                <span className="text-white/70">
                  {selected?.price != null
                    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selected.price)
                    : "—"}{" "}
                  / token
                </span>
              </div>
            </SelectTrigger>

            <SelectContent className="min-w-[16rem] bg-black">
              {options.map((o) => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                  className={twMerge(
                    "[&>span:nth-of-type(2)]:flex",
                    "[&>span:nth-of-type(2)]:w-full",
                    "[&>span:nth-of-type(2)]:justify-between",
                    "[&>span:nth-of-type(2)]:gap-2",
                    "hover:bg-palette-green hover:text-palette-text"
                  )}
                >
                  <span>{o.name}</span>
                  <span>
                    {o.price != null
                      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(o.price)
                      : "—"}{" "}
                    / token
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </fieldset>
  )
}
