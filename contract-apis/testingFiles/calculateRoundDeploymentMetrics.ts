import { round } from "lodash";
import { LockupWithPerTrancheInfo, Proposal } from "../../app/ts_types/HydroBase.types"
import { Tribute } from "../../app/ts_types/TributeBase.types"
import { title } from "process";

export function calculateRoundDeploymentMetrics(
  roundId       : number,
  roundBids     : Proposal[],
  roundLockups  : LockupWithPerTrancheInfo[][],
  roundTributes : Tribute[],
  roundPrices   : {[key: string] : { token_symbol: string, token_exponent: number, price_in_usdc: number }},
  bidDescriptions: Record<string, any>,
  currentRoundId: number,
) {

  const proposalTributes: Record<string, Record<string, number>> = {};
  const proposalVotes: Record<string, any> = {};

  for (const tribute of roundTributes) {
    const proposalId = tribute.proposal_id;

    const denom      = tribute.funds.denom;
    const amount     = parseInt(tribute.funds.amount, 0);

    const symbol         = roundPrices[denom] ? roundPrices[denom].token_symbol   : denom;
    const token_exponent = roundPrices[denom] ? roundPrices[denom].token_exponent : 0;
    const price_in_usdc  = roundPrices[denom] ? roundPrices[denom].price_in_usdc  : 0;

    if (!proposalTributes[proposalId]) {
      proposalTributes[proposalId] = { value_in_atom: 0, value_in_usdc: 0 };
    }

    if (!proposalTributes[proposalId][symbol]) {
      proposalTributes[proposalId][symbol] = 0;
    }

    proposalTributes[proposalId][symbol]          += amount / Math.pow(10, token_exponent);
    proposalTributes[proposalId]['value_in_usdc'] += amount / Math.pow(10, token_exponent) * price_in_usdc;
    proposalTributes[proposalId]['value_in_atom'] += amount / Math.pow(10, token_exponent) * price_in_usdc / roundPrices['ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9'].price_in_usdc;
  }

  //console.log(proposalTributes);

  let total_voting_power_per_tranche: { [key: number]: number } = {};

  for (const lockups of roundLockups) {
    for (const lockup of lockups) {

      const statusLockup = {
        voting_power: parseInt(lockup.lock_with_power.current_voting_power, 10),
        locked_atom: parseInt(lockup.lock_with_power.lock_entry.funds.amount, 10) / 1e6,
        lock_end: lockup.lock_with_power.lock_entry.lock_end,
      };

      for (const tranche_info of lockup.per_tranche_info) {
        const statusVoting = {
          available: tranche_info.next_round_lockup_can_vote === roundId,
          voted: String(tranche_info.current_voted_on_proposal),
        };

        if (statusVoting.available) {
          if (statusVoting.voted !== 'null') {
            if (!total_voting_power_per_tranche[tranche_info.tranche_id]) {
              total_voting_power_per_tranche[tranche_info.tranche_id] = 0;
            }
            total_voting_power_per_tranche[tranche_info.tranche_id] += statusLockup.voting_power;
          }
          if (!proposalVotes[statusVoting.voted]) {
            proposalVotes[statusVoting.voted] = {
              voting_power: 0,
              locked_atom:  0,
            };
          }
          proposalVotes[statusVoting.voted].voting_power += statusLockup.voting_power;
          proposalVotes[statusVoting.voted].locked_atom  += statusLockup.locked_atom;
        }
      }
    }
  }
  
  //console.log(proposalVotes);
  
  const parsedBids = roundBids.map((bid) => {

    const proposalId              = bid.proposal_id;
    const proposalTitle           = bid.title;

    const tributeUnderlyingAssets = proposalTributes[proposalId] ? Object.entries(proposalTributes[proposalId]).filter(([key, value]) => key !== 'value_in_usdc' && key !== 'value_in_atom') : [];
    const tributeValueInUsdc      = proposalTributes[proposalId] ? proposalTributes[proposalId].value_in_usdc : 0;
    const tributeValueInAtom      = proposalTributes[proposalId] ? proposalTributes[proposalId].value_in_atom : 0;

    const vote_power              = proposalVotes[proposalId] ? proposalVotes[proposalId].voting_power : 0;
    const vote_atom               = proposalVotes[proposalId] ? proposalVotes[proposalId].locked_atom  : 0;
    const vote_perc               = proposalVotes[proposalId] ? (proposalVotes[proposalId].voting_power / total_voting_power_per_tranche[bid.tranche_id]) : 0;

    const status                  = bid.round_id === currentRoundId ? 'Voting Period' : (vote_perc < 0.05 ? 'Rejected' : (bid.round_id + bid.deployment_duration < currentRoundId ? 'Completed' : 'Ongoing'));
    
    const description             = bidDescriptions[proposalId];

    return {
      // ID
      proposalId      : bid.proposal_id,
      trancheId       : bid.tranche_id,
      roundId         : bid.round_id,
      // Description
      title           : proposalTitle,
      request_amount  : description ? description.requestAmount : '',
      // Offchain tributes
      points          : description ? description.points : '',
      pointProgramUrl : description ? description.pointProgramUrl : '',
      // Onchain tributes
      tribute         : tributeUnderlyingAssets,
      tribute_value   : tributeValueInUsdc,
      // Deployment details
      duration        : bid.deployment_duration,
      // Votes
      wasm_power      : bid.power,
      vote_power      : vote_power,
      vote_atom       : vote_atom,
      vote_perc       : vote_perc,
      // Status
      status          : status,
      // Deployment metrics
      apr_tribute     : status === 'Rejected' ? null : tributeValueInAtom / vote_atom / bid.deployment_duration * 12,
      apr_pol         : status === 'Rejected' || status === 'Voting Period' ? null : null,
    };
  })

  return parsedBids;
}
