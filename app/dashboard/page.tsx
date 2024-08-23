import { Proposal, Tranche } from '../ts_types/HydroBase.types';
import { Tribute } from '../ts_types/TributeBase.types';
import Dashboard from "./dashboard"
import { fetchGlobalState, fetchRoundState, fetchProposals, fetchProposalTributes, fetchMyAllLockups, fetchMyExpiredLockups } from "../../hooks/hooks"

export default async function Page() {
    const globalState = await fetchGlobalState();

    const { constants,/* currentRound,*/ totalLockedTokens, tranches, whitelistAdmins, whitelist } = globalState;
    const { roundEnd, totalVotingPower: currentTotalVotingPower } = await fetchRoundState(globalState.currentRound);

    const lastRound = globalState.currentRound - 1;
    const lastRoundExists = lastRound > -1;


    // TODO: Lots of sequential "awaits" here, but shouldn't matter since this stuff will be fetched on the server
    const currentProposals = await Promise.all(tranches.map((tranche) => {
        return fetchProposals(globalState.currentRound, tranche.id)
    }));
    const currentVotingPower = await fetchRoundState(globalState.currentRound).then((response) => response.totalVotingPower);

    // The first round that Hydro runs, there will be no deployed proposals
    let lastProposalTranches = undefined
    let lastVotingPower = undefined;
    let lastProposalTributes = undefined;
    if (lastRoundExists) {
        const lastProposals = await Promise.all(tranches.map((tranche) => fetchProposals(lastRound, tranche.id)));
        lastVotingPower = await fetchRoundState(lastRound).then((response) => response.totalVotingPower);

        lastProposalTranches = tranches.reduce((acc, tranche, idx) => {
            return acc.set(tranche.id, lastProposals[idx])
        }, new Map<number, Proposal[]>())

        lastProposalTributes = await fetchProposalTributesForRound(lastProposalTranches, lastRound);
    }

    const currentProposalTranches: Map<number, Proposal[]> = tranches.reduce((acc, tranche, idx) => {
        return acc.set(tranche.id, currentProposals[idx])
    }, new Map<number, Proposal[]>())

    const currentProposalTributes = await fetchProposalTributesForRound(currentProposalTranches, globalState.currentRound);

    return <Dashboard
        lastProposalTranches={lastProposalTranches}
        currentProposalTranches={currentProposalTranches}
        lastVotingPower={lastVotingPower}
        currentVotingPower={currentVotingPower}
        globalState={globalState}
        currentProposalTributes={currentProposalTributes}
        lastProposalTributes={lastProposalTributes}
    />
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