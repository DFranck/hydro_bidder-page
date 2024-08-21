import { Proposal, Tranche } from '../ts_types/HydroBase.types';
import Dashboard from "./dashboard"
import { fetchGlobalState, fetchRoundState, fetchProposals } from "../../hooks/hooks"

export default async function Page() {
    const globalState = await fetchGlobalState();

    const { constants,/* currentRound,*/ totalLockedTokens, tranches, whitelistAdmins, whitelist } = globalState;
    const { roundEnd, totalVotingPower: currentTotalVotingPower } = await fetchRoundState(globalState.currentRound);

    const lastRound = globalState.currentRound - 1;
    const lastRoundExists = lastRound > -1;


    // TODO: Lots of sequential "awaits" here, but shouldn't matter since this stuff will be fetched on the server
    const currentProposals = await Promise.all(tranches.map((tranche) => {
        console.log({ tranche });

        return fetchProposals(globalState.currentRound, tranche.id)
    }));
    const currentVotingPower = await fetchRoundState(globalState.currentRound).then((response) => response.totalVotingPower);

    // The first round that Hydro runs, there will be no deployed proposals
    let lastProposalTranches = undefined
    let lastVotingPower = undefined;
    if (lastRoundExists) {
        const lastProposals = await Promise.all(tranches.map((tranche) => fetchProposals(lastRound, tranche.id)));
        lastVotingPower = await fetchRoundState(lastRound).then((response) => response.totalVotingPower);

        lastProposalTranches = tranches.reduce((acc, tranche, idx) => {
            return acc.set(tranche.id, lastProposals[idx])
        }, new Map<number, Proposal[]>())
    }

    const currentProposalTranches = tranches.reduce((acc, tranche, idx) => {
        return acc.set(tranche.id, currentProposals[idx])
    }, new Map<number, Proposal[]>())

    console.log('Last round:', lastRound);
    console.log('Current round:', globalState.currentRound);


    console.log('Dashboard parameters:', {
        lastProposalTranches,
        currentProposalTranches,
        lastVotingPower,
        currentVotingPower,
        globalState
    });

    return <Dashboard
        lastProposalTranches={lastProposalTranches}
        currentProposalTranches={currentProposalTranches}
        lastVotingPower={lastVotingPower}
        currentVotingPower={currentVotingPower}
        globalState={globalState}
    />
}