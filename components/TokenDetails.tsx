import { amountToUSDString } from "@/lib/amountToUSDString"
import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  name: string
  amount: number
  usdAmount: number
  isGlobal?: boolean
}

const TokenDetails = ({ name, amount, usdAmount, isGlobal = false }: Props) => {
  return (
    <div
      className={cn("flex justify-between", {
        "text-palette-green": amount > 0 && isGlobal,
        "text-palette-red": amount === 0 && isGlobal,
      })}
    >
      <div className="flex items-center gap-1">
        <strong>
          {amount.toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })}
        </strong>
        {isGlobal && amount === 0 ? (
          <strong>Currently at capacity</strong>
        ) : null}
        <span> {name}</span>
      </div>
      <div>
        (
        {amountToUSDString(usdAmount, {
          appendUsd: false,
          numberOfDecimals: 2,
          removeTrailingZeros: true,
        })}
        )
      </div>
    </div>
  )
}

export default TokenDetails
