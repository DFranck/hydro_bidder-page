import {
  LiquidityDeployment,
  LockupWithPerTrancheInfo,
} from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { keysFromSnakeToCamelCase } from "@/lib/keysFromSnakeToCamelCase"
import { omit } from "lodash"
import { getCoinWithValueInUsdByRoundPrices } from "../getCoinWithValueInUsd"
import {
  BidRevampMetrics,
  ProposalSlimmed,
  RoundPrices,
  TokenBasedTribute,
} from "../types"
import { VOTE_SHARE_THRESHOLD } from "@/config"

export function augmentRoundDeploymentMetrics(
  roundId: number,
  roundBids: ProposalSlimmed[],
  roundLockups: LockupWithPerTrancheInfo[][],
  roundTributes: Tribute[],
  roundPrices: RoundPrices, //{[key: string] : { token_symbol: string, decimals: number, priceUsd: number }},
  bidDescriptions: Record<string, any>,
  currentRoundId: number,
  liquidityDeployments: LiquidityDeployment[]
): BidRevampMetrics[] {
  const proposalsTributes: Record<string, Record<string, number>> = {}
  const proposalsVotes: Record<string, any> = {}

  for (const tribute of roundTributes) {
    const proposalId = tribute.proposal_id

    const denom = tribute.funds.denom
    const amount = parseInt(tribute.funds.amount, 0)

    const symbol = roundPrices[denom] ? roundPrices[denom].token_symbol : denom
    const decimals = roundPrices[denom] ? roundPrices[denom].token_exponent : 0
    const priceUsd = roundPrices[denom] ? roundPrices[denom].token_price : 0

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
      (roundPrices?.[
        "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
      ]?.token_price ?? 0)
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
        : vote_perc * 100 < VOTE_SHARE_THRESHOLD
          ? "Rejected"
          : bid.round_id + bid.deployment_duration < currentRoundId
            ? "Completed"
            : "Ongoing"

    const tokenBasedTributes: TokenBasedTribute[] = roundTributes
      .filter(
        (x) => x.round_id === bid.round_id && x.proposal_id === proposalId
      )
      .map((tribute) => {
        const { funds, tribute_id } = tribute

        const fundsWithPrice = getCoinWithValueInUsdByRoundPrices({
          coin: funds,
          roundPrices,
        })

        return {
          ...keysFromSnakeToCamelCase(omit(tribute, "proposal_id")),
          id: tribute_id,
          amount: fundsWithPrice.printableAmount,
          bidId: proposalId,
          denom: fundsWithPrice.humanReadableDenom,
          denomOriginal: funds.denom,
          priceUsd: fundsWithPrice.priceUsd,
          valueUsd: fundsWithPrice.valueUsd,
        }
      })

    const liquidityDeployment =
      liquidityDeployments.find(
        (liquidityDeployment) =>
          liquidityDeployment.round_id === bid.round_id &&
          liquidityDeployment.proposal_id === proposalId
      ) ?? null

    const augmentedDeployedFunds =
      liquidityDeployment?.deployed_funds.map((coin) =>
        getCoinWithValueInUsdByRoundPrices({
          coin,
          roundPrices,
        })
      ) ?? null

    const augmentedFundsBeforeDeployment =
      liquidityDeployment?.funds_before_deployment.map((coin) =>
        getCoinWithValueInUsdByRoundPrices({
          coin,
          roundPrices,
        })
      ) ?? null

    const augmentedLiquidityDeployment = liquidityDeployment
      ? {
          ...keysFromSnakeToCamelCase(omit(liquidityDeployment, "proposal_id")),
          bidId: proposalId,
          deployedFunds: augmentedDeployedFunds,
          fundsBeforeDeployment: augmentedFundsBeforeDeployment,
        }
      : null

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
      tokenBasedTributes,
      totalTokenBasedTributeValue: tributeValueInUsdc,
      liquidityDeployment: augmentedLiquidityDeployment,
      // Deployment details
      duration: bid.deployment_duration,
      // Votes
      //wasm_power      : bid.power,
      //vote_power      : vote_power,
      //vote_atom       : vote_atom,
      power: Number(bid.power),
      vote_perc,
      // Status
      status,
      // Deployment metrics
      apr_tribute:
        status === "Rejected"
          ? null
          : (tributeValueInAtom / vote_atom / bid.deployment_duration) * 12,
      apr_pol:
        status === "Rejected" || status === "Voting Period" ? null : null,
      apr_pol_target: estimatedPolAPR,
    }
  })

  return parsedBids
}
