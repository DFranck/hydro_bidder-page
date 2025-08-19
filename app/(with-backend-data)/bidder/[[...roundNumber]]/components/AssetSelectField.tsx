
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
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
  onChange: (val: string) => void
}

export function AssetSelectField({ value, options, disabled, onChange }: Props) {
  const selected = options.find(o => o.value === value)

  return (
    <fieldset className="rounded-lg border border-white/20 bg-black/40">
      <div className="relative py-1">
        <label className="absolute -top-2 left-3 bg-black px-1 text-[11px] leading-none text-white/60">
          Asset
        </label>

        <div className="flex items-center">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger
              className="w-full rounded-md bg-black border-0 ring-0 cursor-pointer"
              disabled={disabled}
            >
              <div className="flex w-full items-center justify-between">
                <span>{disabled ? "No available assets" : selected?.name ?? "Select asset"}</span>
                <span className="text-white/70">
                  {selected?.price != null
                    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selected.price)
                    : "—"} / token
                </span>
              </div>
            </SelectTrigger>

            <SelectContent className="min-w-[16rem] bg-black">
              {options.map(o => (
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
                      : "—"} / token
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
