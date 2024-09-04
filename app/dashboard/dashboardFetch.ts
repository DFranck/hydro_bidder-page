import { Proposal, Tranche } from '../ts_types/HydroBase.types';
import { Tribute } from '../ts_types/TributeBase.types';
import { fetchGlobalState, fetchRoundState, fetchProposals, fetchProposalTributes, fetchMyAllLockups, fetchMyExpiredLockups } from "../../hooks/hooks"



export async function fetchDashboardData() {
    console.time('fetchGlobalState');
    const globalState = await fetchGlobalState();
    console.timeEnd('fetchGlobalState');

    const { currentRound, tranches } = globalState;

    const lastRound = currentRound - 1;
    const lastRoundExists = lastRound > -1;

    console.time('fetchCurrentProposals');
    const currentProposals = await Promise.all(tranches.map((tranche) => {
        return fetchProposals(currentRound, tranche.id)
    }));
    console.timeEnd('fetchCurrentProposals');

    console.time('fetchCurrentVotingPower');
    const currentVotingPower = await fetchRoundState(currentRound).then((response) => response.totalVotingPower);
    console.timeEnd('fetchCurrentVotingPower');

    // The first round that Hydro runs, there will be no deployed proposals
    let lastProposalTranches = undefined
    let lastVotingPower = undefined;
    let lastProposalTributes = undefined;
    if (lastRoundExists) {
        console.time('fetchLastProposals');
        const lastProposals = await Promise.all(tranches.map((tranche) => fetchProposals(lastRound, tranche.id)));
        console.timeEnd('fetchLastProposals');

        console.time('fetchLastVotingPower');
        lastVotingPower = await fetchRoundState(lastRound).then((response) => response.totalVotingPower);
        console.timeEnd('fetchLastVotingPower');

        lastProposalTranches = tranches.reduce((acc, tranche, idx) => {
            return acc.set(tranche.id, lastProposals[idx])
        }, new Map<number, Proposal[]>())

        console.time('fetchLastProposalTributes');
        lastProposalTributes = await fetchProposalTributesForRound(lastProposalTranches, lastRound);
        console.timeEnd('fetchLastProposalTributes');
    }

    const currentProposalTranches: Map<number, Proposal[]> = tranches.reduce((acc, tranche, idx) => {
        return acc.set(tranche.id, currentProposals[idx])
    }, new Map<number, Proposal[]>())

    console.time('fetchCurrentProposalTributes');
    const currentProposalTributes = await fetchProposalTributesForRound(currentProposalTranches, currentRound);
    console.timeEnd('fetchCurrentProposalTributes');

    return {
        lastProposalTranches,
        currentProposalTranches,
        lastVotingPower,
        currentVotingPower,
        globalState,
        currentProposalTributes,
        lastProposalTributes
    }
}

async function fetchProposalTributesForRound(proposalTranches: Map<number, Proposal[]>, round: number) {
    const allProposals = Array.from(proposalTranches.values()).flat();
    const tributePromises = allProposals.map(proposal =>
        fetchProposalTributes(round, proposal.tranche_id, proposal.proposal_id)
            .then(tributes => ({ proposal, tributes }))
    );
    const tributesResults = await Promise.all(tributePromises);

    const proposalTributes = new Map<number, Tribute[]>();
    tributesResults.forEach(({ proposal, tributes }) => {
        proposalTributes.set(proposal.proposal_id, tributes);
    });

    return proposalTributes;
}