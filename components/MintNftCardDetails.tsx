"use client"

import { NFT_INFO } from "@/app/(with-backend-data)/lockups/MintNfts"
import { Equal, Plus, SquaresUnite } from "lucide-react"
import { pluralize } from "@/lib/pluralize"
import { formatAmount } from "@/lib/formatAmount"
import { LockupsResult } from "@/hooks/use-nft"
import { Avatar } from "./Avatar"

interface Props {
  nftInfo: NFT_INFO
  eligibleLockupsSizes: LockupsResult
  isNFTLoading: boolean
}

export function MintNftCardDetails({
  nftInfo,
  eligibleLockupsSizes,
  isNFTLoading,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-col items-center gap-2">
        <Avatar url={nftInfo.image} alt={"nft.denom"} className="size-60 rounded-none" />
      </div>
      {isNFTLoading ? (
        <div className="h-auto flex-1 animate-pulse rounded-md bg-gray-200/10" />
      ) : (
        <div className="from-palette-green/0 to-palette-green/20 h-fit flex-1 bg-gradient-to-r p-3 pl-6">
          <div className="flex items-center justify-between">
            <span className="text-palette-beige flex items-center gap-2 text-sm uppercase">
              <SquaresUnite className="fill-palette-beige size-4" />
              {pluralize({
                count: eligibleLockupsSizes?.selectedLockupsCount,
                singular: "Lockup",
                plural: "Lockups",
              })}{" "}
              to convert
            </span>
            <span>{eligibleLockupsSizes.selectedLockupsCount}</span>
          </div>
          <div className="mt-2 flex flex-col items-end gap-3">
            <div className="flex flex-wrap gap-2">
              {eligibleLockupsSizes.selectedLockups.map((el, index) => (
                <div
                  className="border-palette-beige space-x-1 rounded-md border p-1.5 text-xs text-white"
                  key={index}
                >
                  <span>{formatAmount(el.funds.amount, 0, 3)}</span>
                  <span>{nftInfo.displayDenom}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Equal className="size-4 text-white" />
                <span className="border-palette-beige bg-palette-beige rounded-md border p-1.5 text-xs text-black">
                  {nftInfo.amount} {nftInfo.displayDenom}
                </span>
              </div>
              {eligibleLockupsSizes.remainder ? (
                <div className="flex items-center gap-2">
                  <Plus className="size-4 text-white" />
                  <span className="border-palette-beige  rounded-md border border-dashed p-1.5 text-xs">
                    {formatAmount(eligibleLockupsSizes.remainder, 0, 3)}{" "}
                    {nftInfo.displayDenom}
                  </span>
                </div>
              ) : null}
            </div>
            {eligibleLockupsSizes.remainder ? (
              <span className="mt-3 text-xs text-white/80">
                One remainder lockup of{" "}
                <strong className="text-white">
                  {formatAmount(eligibleLockupsSizes.remainder, 0, 3)}
                </strong>{" "}
                {nftInfo.displayDenom} will be created
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
