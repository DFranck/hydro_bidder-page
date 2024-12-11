import { AllowedLockupPeriodInEpochs } from "@/config"
import { nonUserSpecificAPR } from "./nonUserSpecificAPR"

export function topLineAPR({
  atomPrice,
  lockedAtomEpochInNanos,
  lockupPeriod,
  proposalAPRinputs,
  stakingAPR,
}: {
  proposalAPRinputs: Map<
    number,
    {
      proposalTotalTribute: number
      proposalPower: number
    }[]
  >
  lockedAtomEpochInNanos: number
  lockupPeriod: AllowedLockupPeriodInEpochs
  atomPrice: number
  stakingAPR: number
}) {
  // Calculate the maximum APR
  const maxAPR = Array.from(proposalAPRinputs, ([_, value]) => value).reduce(
    (acc, trancheAPRinputs) => {
      // Calculate APR for each proposal in the current tranche
      const proposalAPRs = trancheAPRinputs.map((input) =>
        nonUserSpecificAPR({
          atomPrice,
          lockedAtomEpochInNanos,
          lockupPeriod,
          proposalPower: input.proposalPower,
          proposalTotalTribute: input.proposalTotalTribute,
        })
      )

      // Add the maximum APR from this tranche to the accumulator
      return acc + Math.max(...proposalAPRs)
    },
    0
  )

  return maxAPR + stakingAPR
}
