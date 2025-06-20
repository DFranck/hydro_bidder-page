import { amountToUSDString } from "@/lib/amountToUSDString"
import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  name: string
  amount: number
  usdAmount: number
}

const TokenDetails = ({ name, amount, usdAmount }: Props) => {
  return (
    <div className={cn("flex justify-between")}>
      <div className="flex items-center gap-1">
        <strong>
          {amount.toLocaleString("en-US", {
            maximumFractionDigits: 4,
          })}
        </strong>
        <span> {name}</span>
      </div>
      <div>
        (
        {amountToUSDString(usdAmount, {
          appendUsd: false,
          numberOfDecimals: 3,
          removeTrailingZeros: true,
        })}
        )
      </div>
    </div>
  )
}

export default TokenDetails
