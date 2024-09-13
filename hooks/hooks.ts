import { useQuery } from '@tanstack/react-query'
import {
    HydroBaseQueryClient,
    HydroBaseClient,
} from '../app/ts_types/HydroBase.client'
import { TributeBaseQueryClient } from '../app/ts_types/TributeBase.client'
import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import {
    Tranche,
    Constants,
    Proposal,
    LockEntry,
    Timestamp,
    Uint128,
    VoteWithPower,
    Addr,
} from '../app/ts_types/HydroBase.types'
import { Tribute } from '../app/ts_types/TributeBase.types'
import { GlobalState, RoundState } from '../app/types'
import {
    topNProposals,
    mockGlobalState,
    mockTributes,
    mockVotes,
    mockAllLockEntries,
    mockExpiredLockEntries,
} from '../app/mockData'
import { StdFee } from '@cosmjs/amino'
import { MsgVoteEncodeObject, GasPrice } from '@cosmjs/stargate'

let clientInstance: CosmWasmClient | null = null

const getCosmWasmClient = async (): Promise<CosmWasmClient> => {
    if (!clientInstance) {
        clientInstance = await CosmWasmClient.connect(rpcEndpoint)
    }
    return clientInstance
}

const hydroContractAddress =
    // 'neutron13wqp5t3xxlwer9mq9mmrfa3j0vfn06cfs3r5kdaz2sp97vpqdmeqwm2p7y'
    'neutron10thpcagmt7zxl2p0dnevxl78kfgxr06pkumzkvhkhtze2z49h0msj8mwjf'
const tributeContractAdress =
    'neutron1duww23zf05mtxwcvaq9pkalq0h4pg0yn7chmqt227gzvaz0r7jyq72fd0e'
const rpcEndpoint = 'https://rpc-palvus.pion-1.ntrn.tech:443'
const numberOfProposals = 5
const staleTime = 10000
const mockTimeout = 0
const limit = 10000
const startFrom = 0

export const fetchGlobalState = async (): Promise<GlobalState> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        hydroContractAddress
    )

    const [
        constants,
        currentRound,
        totalLockedTokens,
        tranches,
        whitelistAdmins,
        whitelist,
    ] = await Promise.all([
        hydroQueryClient.constants().then((response) => response.constants),
        hydroQueryClient.currentRound().then((response) => response.round_id),
        hydroQueryClient
            .totalLockedTokens()
            .then((response) => response.total_locked_tokens),
        hydroQueryClient.tranches().then((response) => response.tranches),
        hydroQueryClient.whitelistAdmins().then((response) => response.admins),
        hydroQueryClient.whitelist().then((response) => response.whitelist),
    ])

    return {
        constants,
        currentRound,
        totalLockedTokens,
        tranches,
        whitelistAdmins,
        whitelist,
    }
}

export const fetchRoundState = async (roundId: number): Promise<RoundState> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        hydroContractAddress
    )

    const [roundEnd, totalVotingPower] = await Promise.all([
        hydroQueryClient
            .roundEnd({ roundId })
            .then((response) => response.round_end),
        hydroQueryClient
            .roundTotalVotingPower({ roundId })
            .then((response) => response.total_voting_power),
    ])

    return {
        roundEnd,
        totalVotingPower: BigInt(totalVotingPower),
    }
}

export const fetchProposals = async (
    roundId: number,
    trancheId: number
): Promise<Proposal[]> => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        hydroContractAddress
    )
    const response = await hydroQueryClient.topNProposals({
        numberOfProposals,
        roundId,
        trancheId,
    })
    return response.proposals
}

export const fetchProposalTributes = async (
    roundId: number,
    trancheId: number,
    proposalId: number
): Promise<Tribute[]> => {
    const client = await getCosmWasmClient()
    const tributeQueryClient = new TributeBaseQueryClient(
        client,
        tributeContractAdress
    )

    const query = {
        roundId,
        trancheId,
        proposalId,
        limit: 10,
        startFrom: 0,
    }

    const tributes = await tributeQueryClient.proposalTributes(query)

    // Replace IBC denoms with token names
    const tribute = tributes.tributes.map((tribute) => ({
        ...tribute,
        funds: {
            ...tribute.funds,
            denom: ibcDenomToToken[tribute.funds.denom] || tribute.funds.denom,
        },
    }))

    // console.log('Tributes result:', JSON.stringify(tribute, null, 2));
    return tribute
}

export const useProposals = (roundId: number, trancheId: number) => {
    return useQuery({
        queryKey: ['proposals', roundId, trancheId],
        queryFn: () => fetchProposals(roundId, trancheId),
        staleTime,
    })
}

export const useRoundState = (roundId: number) => {
    return useQuery({
        queryKey: ['roundState', roundId],
        queryFn: () => fetchRoundState(roundId),
        staleTime,
    })
}

// TODO: what's the right way to get this stuff?
export const ibcDenomToToken: Record<string, string> = {
    'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2':
        'ATOM',
    'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4':
        'OSMO',
    'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9':
        'JUNO',
    'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4':
        'SCRT',
    'ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858':
        'USDC',
    'ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1':
        'USDT',
    untrn: 'NTRN',
}

export const fetchMyVotes = async (
    myAddress: string,
    roundId: number,
    trancheIds: number[]
) => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        hydroContractAddress
    )
    const votePromises = trancheIds.map((trancheId) =>
        hydroQueryClient.userVote({
            address: myAddress,
            roundId: roundId,
            trancheId: trancheId,
        })
    )

    // // mock vote promises
    // const votePromises = trancheIds.map(trancheId => {
    //     return {
    //         vote: mockVotes[trancheId]
    //     }
    // });

    const votes = await Promise.all(votePromises)
    console.log(
        'fetchMyVotes',
        myAddress,
        roundId,
        trancheIds,
        'HAVE VOTES',
        votes
    )

    const votesByTranche = trancheIds.reduce(
        (acc, trancheId, index) => acc.set(trancheId, votes[index].vote),
        new Map<number, VoteWithPower>()
    )

    return votesByTranche
}

export const fetchMyAllLockups = async (myAddress: string) => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        hydroContractAddress
    )
    const lockups = await hydroQueryClient.allUserLockups({
        address: myAddress,
        limit,
        startFrom,
    })
    return lockups.lockups
}

export const fetchMyExpiredLockups = async (myAddress: string) => {
    const client = await getCosmWasmClient()
    const hydroQueryClient = new HydroBaseQueryClient(
        client,
        hydroContractAddress
    )

    const response = await hydroQueryClient.expiredUserLockups({
        address: myAddress,
        limit,
        startFrom,
    })
    return response.lockups
}

export const useMyVotes = (
    myAddress: string,
    roundId: number,
    trancheIds: number[]
) => {
    return useQuery({
        queryKey: ['myVotes', myAddress, roundId, trancheIds],
        queryFn: () => fetchMyVotes(myAddress, roundId, trancheIds),
        staleTime,
    })
}

export const useMyLockups = (myAddress: string) => {
    return useQuery({
        queryKey: ['myLockups', myAddress],
        queryFn: () => fetchMyAllLockups(myAddress),
        staleTime,
    })
}

export const executeVote = async (
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>,
    address: string,
    proposalId: number,
    trancheId: number
) => {
    const client = await getSigningCosmWasmClient()
    // console.log('exec wasm client', client)
    // console.log('executeVote', address, proposalId, trancheId)
    // const msg = {
    //     typeUrl: '/cosmos.gov.v1beta1.MsgVote',
    //     value: {
    //         proposalId: BigInt(proposalId),
    //         voter: address,
    //         option: 1,
    //     },
    // } as MsgVoteEncodeObject
    // const fee = await estimateFee([msg])
    // console.log({ fee })
    // console.log({
    //     address,
    //     proposalId,
    //     trancheId,
    // })

    const hydroClient = new HydroBaseClient(
        client,
        address,
        hydroContractAddress
    )
    const response = await hydroClient.vote({ proposalId, trancheId }, 'auto')
    return response
}
