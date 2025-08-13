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
          <>Hydro is bundling your lockups to match your chosen NFT size.</>
        )
      case "split":
        return (
          <>
            Hydro is splitting your lockup to create the NFT size you selected.
          </>
        )
      case "convert":
        return (
          <>
            Hydro is converting your ATOM lockups into dATOM so they can go into
            your NFT.
          </>
        )
      case "merge_after_convert":
        return (
          <>Hydro is merging your new dATOM lockups into a single position.</>
        )
      case "merge_matching_denoms":
        return (
          <>
            Hydro is merging lockups with the same token type before converting
            to dATOM.
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
