import {
  LockupWithPerTrancheInfo,
  Proposal,
} from "../../app/ts_types/HydroBase.types"
import { Tribute } from "../../app/ts_types/TributeBase.types"
import { AssetListWithPrices } from "../types"

export function augmentRoundDeploymentMetrics(
  roundId: number,
  roundBids: Proposal[],
  roundLockups: LockupWithPerTrancheInfo[][],
  roundTributes: Tribute[],
  roundPrices: AssetListWithPrices, //{[key: string] : { token_symbol: string, decimals: number, priceUsd: number }},
  bidDescriptions: Record<string, any>,
  currentRoundId: number
) {
  const proposalsTributes: Record<string, Record<string, number>> = {}
  const proposalsVotes: Record<string, any> = {}

  for (const tribute of roundTributes) {
    const proposalId = tribute.proposal_id

    const denom = tribute.funds.denom
    const amount = parseInt(tribute.funds.amount, 0)

    const symbol = roundPrices[denom] ? roundPrices[denom].symbol : denom
    const decimals = roundPrices[denom] ? roundPrices[denom].decimals : 0
    const priceUsd = roundPrices[denom] ? roundPrices[denom].priceUsd : 0

    if (!proposalsTributes[proposalId]) {
      proposalsTributes[proposalId] = { value_in_atom: 0, value_in_usdc: 0 }
    }

    if (!proposalsTributes[proposalId][symbol]) {
      proposalsTributes[proposalId][symbol] = 0
    }

    proposalsTributes[proposalId][symbol] += amount / Math.pow(10, decimals)
    proposalsTributes[proposalId]["value_in_usdc"] +=
      (amount / Math.pow(10, decimals)) * priceUsd
    proposalsTributes[proposalId]["value_in_atom"] +=
      ((amount / Math.pow(10, decimals)) * priceUsd) /
      roundPrices[
        "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
      ].priceUsd
  }
  //console.log(proposalsTributes);

  let total_voting_power_per_tranche: { [key: number]: number } = {}

  for (const lockups of roundLockups) {
    for (const lockup of lockups) {
      const statusLockup = {
        voting_power: parseInt(lockup.lock_with_power.current_voting_power, 10),
        locked_atom:
          parseInt(lockup.lock_with_power.lock_entry.funds.amount, 10) / 1e6,
        lock_end: lockup.lock_with_power.lock_entry.lock_end,
      }

      for (const tranche_info of lockup.per_tranche_info) {
        const statusVoting = {
          available: tranche_info.next_round_lockup_can_vote === roundId,
          voted: String(tranche_info.current_voted_on_proposal),
        }

        if (statusVoting.available) {
          if (statusVoting.voted !== "null") {
            if (!total_voting_power_per_tranche[tranche_info.tranche_id]) {
              total_voting_power_per_tranche[tranche_info.tranche_id] = 0
            }
            total_voting_power_per_tranche[tranche_info.tranche_id] +=
              statusLockup.voting_power
          }
          if (!proposalsVotes[statusVoting.voted]) {
            proposalsVotes[statusVoting.voted] = {
              voting_power: 0,
              locked_atom: 0,
            }
          }
          proposalsVotes[statusVoting.voted].voting_power +=
            statusLockup.voting_power
          proposalsVotes[statusVoting.voted].locked_atom +=
            statusLockup.locked_atom
        }
      }
    }
  }

  //console.log(proposalsVotes);

  const parsedBids = roundBids.map((bid) => {
    const proposalId = bid.proposal_id
    const proposalTitle = bid.title

    // Github fields
    const proposalGithubFields = bidDescriptions[proposalId]
    const proposalPoints = proposalGithubFields
      ? proposalGithubFields.points
      : []
    const proposalPointProgramUrl = proposalGithubFields
      ? proposalGithubFields.pointProgramUrl
      : ""
    const estimatedPolAPR = proposalGithubFields
      ? proposalGithubFields.minMaxTargetPolApr
      : []
    const requestAmount = proposalGithubFields
      ? proposalGithubFields.requestAmount
      : []

    // Tribute fields
    const proposalTributes = proposalsTributes[proposalId]
    const tributeUnderlyingAssets = proposalTributes
      ? Object.entries(proposalTributes).filter(
          ([key, value]) => key !== "value_in_usdc" && key !== "value_in_atom"
        )
      : []
    const tributeValueInUsdc = proposalTributes
      ? proposalTributes.value_in_usdc
      : 0
    const tributeValueInAtom = proposalTributes
      ? proposalTributes.value_in_atom
      : 0

    // FE Aux fields
    //const tributeType             = tributeUnderlyingAssets.length > 0 ? 'Tokens' : (proposalPoints.length > 0 ? 'Points' : '');

    // Voting fields
    const proposalVotes = proposalsVotes[proposalId]
    const vote_power = proposalVotes ? proposalVotes.voting_power : 0
    const vote_atom = proposalVotes ? proposalVotes.locked_atom : 0
    const vote_perc = proposalVotes
      ? proposalVotes.voting_power /
        total_voting_power_per_tranche[bid.tranche_id]
      : 0

    const status =
      bid.round_id === currentRoundId
        ? "Voting Period"
        : vote_perc < 0.05
          ? "Rejected"
          : bid.round_id + bid.deployment_duration < currentRoundId
            ? "Completed"
            : "Ongoing"

    return {
      // ID
      id: bid.proposal_id,
      trancheId: bid.tranche_id,
      roundId: bid.round_id,
      // Description
      title: proposalTitle,
      request_amount: requestAmount,
      // Offchain tributes
      points: proposalPoints,
      pointProgramUrl: proposalPointProgramUrl,
      // Onchain tributes
      tribute: tributeUnderlyingAssets,
      tribute_value: tributeValueInUsdc,
      // Deployment details
      duration: bid.deployment_duration,
      // Votes
      //wasm_power      : bid.power,
      //vote_power      : vote_power,
      //vote_atom       : vote_atom,
      vote_perc: vote_perc,
      // Status
      status: status,
      // Deployment metrics
      apr_tribute:
        status === "Rejected"
          ? null
          : (tributeValueInAtom / vote_atom / bid.deployment_duration) *
            12 *
            100,
      apr_pol:
        status === "Rejected" || status === "Voting Period" ? null : null,
      apr_pol_target: estimatedPolAPR,
    }
  })

  return parsedBids
}
