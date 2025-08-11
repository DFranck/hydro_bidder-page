"use client"

import { MintStep } from "@/app/(with-backend-data)/lockups/MintNfts"

interface Props {
  step: MintStep
}

export function MintNftCardStepperInfo({ step }: Props) {
  function getCurrentSteps(step: MintStep) {
    switch (step) {
      case "merge":
        return (
          <>
            Hydro is combining your selected lockups to match the NFT size you
            chose.
          </>
        )
      case "split":
        return (
          <>
            Hydro is splitting your lockup so you can mint the exact NFT
            size you picked.
          </>
        )
      case "convert":
        return (
          <>
            Hydro is converting your ATOM into dATOM so it can be included in
            your NFT.
          </>
        )
      case "merge_after_convert":
        return (
          <>
            Hydro is merging your newly converted dATOM into one lockup for your
            NFT.
          </>
        )
      case "merge_matching_denoms":
        return (
          <>
            Hydro is merging all lockups with the same token type so they can be
            used in your NFT.
          </>
        )

      default:
        break
    }
  }

  return (
    <div className="mb-6 flex items-center justify-center text-center text-sm text-gray-400">
      {getCurrentSteps(step)}
    </div>
  )
}
