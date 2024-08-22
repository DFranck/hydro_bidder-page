import { useQuery } from "@tanstack/react-query";
import { HydroBaseQueryClient } from '../app/ts_types/HydroBase.client';
import { TributeBaseQueryClient } from '../app/ts_types/TributeBase.client';
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { Tranche, Constants, Proposal, LockEntry, Timestamp, Uint128, Vote, Addr } from '../app/ts_types/HydroBase.types';
import { Tribute } from '../app/ts_types/TributeBase.types';
import { GlobalState, RoundState } from '../app/types';
import { activeProposals } from "../app/dashboard/proposals/data"
import { topNProposals, mockGlobalState, mockTributes } from "../app/mockData"
import { setTimeout } from 'timers/promises';

const hydroContractAddress = 'neutron170q77yl3qfxyu43edpgc4u546mtp3jwwhxal3ujy79qw7qp6kgmszyuarv';
const tributeContractAdress = 'neutron1qydlxxz4ze6m5k6v7xqg0wnuzuuxaxhghvhtwvs34qaku24nhltse3hm7p';
const rpcEndpoint = "https://rpc-palvus.pion-1.ntrn.tech:443";
const myAddress = 'neutron1cfznm042ncguprsfxzmze6xfkjft33eqw2djna';
const numberOfProposals = 5;
const staleTime = 10000;
const mockTimeout = 100;

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

    // Add a 0.5-second delay
    await setTimeout(mockTimeout);
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

    // Add a 0.5-second delay
    await setTimeout(mockTimeout);
    return {
        roundEnd: "",
        // TODO: This is a large number so we should use a large number library
        totalVotingPower: 100,
    }
}

export const fetchProposals = async (roundId: number, trancheId: number): Promise<Proposal[]> => {
    const client = await CosmWasmClient.connect(rpcEndpoint);
    const hydroQueryClient = new HydroBaseQueryClient(client, hydroContractAddress);

    // TODO: commented this out and mocked it
    // const proposals = await hydroQueryClient.topNProposals({ numberOfProposals, roundId, trancheId })
    //     .then((response) => response.proposals);



    // Add a 0.5-second delay
    await setTimeout(mockTimeout);
    return topNProposals[roundId][trancheId].slice(0, numberOfProposals);
};

export const fetchProposalTributes = async (roundId: number, trancheId: number, proposalId: number): Promise<Tribute[]> => {
    const client = await CosmWasmClient.connect(rpcEndpoint);
    const tributeQueryClient = new TributeBaseQueryClient(client, tributeContractAdress);

    // TODO: commented this out and mocked it
    // const tributes = await tributeQueryClient.proposalTributes({
    //     roundId,
    //     trancheId,
    //     proposalId,
    //     limit: 10,
    //     startFrom: 0
    // })

    // return tributes.tributes;

    // Mock implementation for fetchProposalTributes
    // Add a 0.5-second delay
    await setTimeout(mockTimeout);
    let tributes = mockTributes[roundId]?.[trancheId]?.[proposalId] || [];

    // Replace IBC denoms with token names
    return tributes.map(tribute => ({
        ...tribute,
        funds: {
            ...tribute.funds,
            denom: ibcDenomToToken[tribute.funds.denom] || tribute.funds.denom
        }
    }));
}

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

// TODO: what's the right way to get this stuff?
export const ibcDenomToToken: Record<string, string> = {
    "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2": "ATOM",
    "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4": "OSMO",
    "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9": "JUNO",
    "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4": "SCRT",
    "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858": "USDC",
    "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1": "USDT"
};