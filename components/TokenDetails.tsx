import { amountToUSDString } from "@/lib/amountToUSDString"
import React from "react"

type Props = {
  name: string
  amount: number
  usdAmount: number
}

const TokenDetails = ({ name, amount, usdAmount }: Props) => {
  return (
    <div className="flex justify-between">
      <strong>
        {amount.toLocaleString("en-US", {
          maximumFractionDigits: 4,
        })}{" "}
        {name}
      </strong>
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
