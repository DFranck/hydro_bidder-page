import { useQuery } from "@tanstack/react-query";
import { HydroBaseQueryClient } from '../app/ts_types/HydroBase.client';
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Tranche, Constants, Proposal, LockEntry, Timestamp, Uint128, Vote, Addr } from '../app/ts_types/HydroBase.types';
import { GlobalState, RoundState } from '../app/types';
import { activeProposals } from "../app/dashboard/proposals/data"
import { topNProposals, mockGlobalState } from "../app/mockData"

const hydroContractAddress = 'neutron170q77yl3qfxyu43edpgc4u546mtp3jwwhxal3ujy79qw7qp6kgmszyuarv';
const tributeContractAdress = 'neutron1qydlxxz4ze6m5k6v7xqg0wnuzuuxaxhghvhtwvs34qaku24nhltse3hm7p';
const rpcEndpoint = "https://rpc-palvus.pion-1.ntrn.tech:443";
const myAddress = 'neutron1cfznm042ncguprsfxzmze6xfkjft33eqw2djna';
const numberOfProposals = 5;
const staleTime = 10000;

export const fetchGlobalState = async (): Promise<GlobalState> => {
    const client = await CosmWasmClient.connect(rpcEndpoint);
    const hydroQueryClient = new HydroBaseQueryClient(client, hydroContractAddress);

    // TODO: commented this out and mocked it
    // const [constants, currentRound, totalLockedTokens, tranches, whitelistAdmins, whitelist] = await Promise.all([
    //     hydroQueryClient.constants().then((response) => response.constants),
    //     hydroQueryClient.currentRound().then((response) => response.round_id),
    //     hydroQueryClient.totalLockedTokens().then((response) => response.total_locked_tokens),
    //     hydroQueryClient.tranches().then((response) => response.tranches),
    //     hydroQueryClient.whitelistAdmins().then((response) => response.admins),
    //     hydroQueryClient.whitelist().then((response) => response.whitelist),
    // ]);

    // return {
    //     constants,
    //     currentRound,
    //     totalLockedTokens,
    //     tranches,
    //     whitelistAdmins,
    //     whitelist,
    // };

    return mockGlobalState;
}

export const fetchRoundState = async (roundId: number): Promise<RoundState> => {
    const client = await CosmWasmClient.connect(rpcEndpoint);
    const hydroQueryClient = new HydroBaseQueryClient(client, hydroContractAddress);

    // TODO: commented this out and mocked it
    // const [roundEnd, totalVotingPower] = await Promise.all([
    //     hydroQueryClient.roundEnd({ roundId }).then((response) => response.round_end),
    //     hydroQueryClient.roundTotalVotingPower({ roundId }).then((response) => response.total_voting_power),
    // ])

    return {
        roundEnd: "",
        // TODO: This is a large number so we should use a large number library
        totalVotingPower: 100,
    }
}

export const fetchProposals = async (roundId: number, trancheId: number): Promise<Proposal[]> => {
    console.log(`Fetching proposals for Round ID: ${roundId}, Tranche ID: ${trancheId}`);
    const client = await CosmWasmClient.connect(rpcEndpoint);
    const hydroQueryClient = new HydroBaseQueryClient(client, hydroContractAddress);

    // TODO: commented this out and mocked it
    // const proposals = await hydroQueryClient.topNProposals({ numberOfProposals, roundId, trancheId })
    //     .then((response) => response.proposals);



    return topNProposals[roundId][trancheId].slice(0, numberOfProposals);
};

export const useProposals = (roundId: number, trancheId: number) => {
    return useQuery({
        queryKey: ["proposals", roundId, trancheId],
        queryFn: () => fetchProposals(roundId, trancheId),
        staleTime,
    });
}

export const useRoundState = (roundId: number) => {
    return useQuery({
        queryKey: ["roundState", roundId],
        queryFn: () => fetchRoundState(roundId),
        staleTime,
    });
}

// const tributeQueryClient = new TributeBaseQueryClient(client, tributeContractAdress);
// const config = await tributeQueryClient.config(); // breaks
// const contractAddressFromTQC = tributeQueryClient.contractAddress;
// const proposalTributes = await tributeQueryClient.proposalTributes({ limit: 10, proposalId: 1, roundId: 0, startFrom: 0, trancheId: 1 }) // breaks
// console.log({ config, contractAddressFromTQC, proposalTributes });