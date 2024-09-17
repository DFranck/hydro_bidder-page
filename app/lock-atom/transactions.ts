import {
    DeliverTxResponse,
    SigningStargateClient,
    StargateClient,
} from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { cosmos } from "interchain"
const txRaw = cosmos.tx.v1beta1.TxRaw
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import {
    MsgRedeemTokensForShares,
    MsgTokenizeShares,
} from "stridejs/types/codegen/cosmos/staking/v1beta1/tx"
import { MsgTransfer } from "stridejs/types/codegen/ibc/applications/transfer/v1/tx"
import { useQuery } from "@tanstack/react-query"
import {
    HydroBaseQueryClient,
    HydroBaseClient,
} from "../ts_types/HydroBase.client"
import { TributeBaseQueryClient } from "../ts_types/TributeBase.client"
import {
    CosmWasmClient,
    SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate"
import {
    Tranche,
    Constants,
    Proposal,
    LockEntry,
    Timestamp,
    Uint128,
    VoteWithPower,
    Addr,
} from "../ts_types/HydroBase.types"
import { Tribute } from "../ts_types/TributeBase.types"
import { GlobalState, RoundState } from "../types"

import { StdFee } from "@cosmjs/amino"
import { MsgVoteEncodeObject, GasPrice } from "@cosmjs/stargate"

const hydroContractAddress =
    "neutron192s005pfsx7j397l4jarhgu8gs2lcgwyuntehp6wundrh8pgkywqgss0tm"

export async function checkForHubLSMShares(
    hubChain: ChainContext,
    hubSigner: SigningStargateClient
) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set")
    }
    const response: {
        balances: {
            denom: string
            amount: string
        }[]
        pagination: {
            next_key: string | null
            total: string
        }
        // TODO: No pagination so it will break if they have a crap ton of denoms in their account
    } = await fetch(
        `${await hubChain.getRestEndpoint()}cosmos/bank/v1beta1/balances/${
            hubChain.address
        }`
    ).then((res) => res.json())

    console.log("checkForHubLSMShares", response)

    const lsmShares = response.balances
        .filter((balance) => balance.denom.startsWith("cosmosvaloper"))
        .map((balance) => {
            const [validator, _] = balance.denom.split("/")
            return {
                validator,
                amount: balance.amount,
                denom: balance.denom,
            }
        })

    return lsmShares
}

export async function checkForNeutronLSMShares(
    neutronChain: ChainContext,
    neutronSigner: SigningStargateClient
) {
    if (!neutronChain.address) {
        throw new Error("Neutron chain address not set")
    }

    const restEndpoint = await neutronChain.getRestEndpoint()

    const response = await fetch(
        `${restEndpoint}cosmos/bank/v1beta1/balances/${neutronChain.address}`
    ).then((res) => res.json())

    const fetchDenomTrace = async (balance: {
        denom: string
        amount: string
    }) => {
        if (balance.denom.startsWith("ibc/")) {
            try {
                const denomTraceResponse = await fetch(
                    `${restEndpoint}ibc/apps/transfer/v1/denom_traces/${balance.denom}`
                ).then((res) => res.json())
                const baseDenom = denomTraceResponse.denom_trace.base_denom

                if (baseDenom.startsWith("cosmosvaloper")) {
                    const [validator, _] = baseDenom.split("/")
                    return {
                        validator,
                        amount: balance.amount,
                        denom: balance.denom,
                        baseDenom,
                    }
                }
            } catch (error) {
                console.error(
                    `Error fetching denom trace for ${balance.denom}:`,
                    error
                )
            }
        }
        return null
    }

    const lsmSharesPromises: Promise<{
        validator: string
        amount: string
        denom: string
        baseDenom: string
    } | null>[] = response.balances.map(fetchDenomTrace)
    const lsmSharesResults = await Promise.all(lsmSharesPromises)
    const lsmShares = lsmSharesResults.filter((share) => share !== null)

    return lsmShares
}

export async function signTokenizeShares(
    hubChain: ChainContext,
    hubSigner: SigningStargateClient,
    amount: string,
    validator: string
) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set")
    }

    const msg: { typeUrl: string; value: MsgTokenizeShares } = {
        typeUrl: "/cosmos.staking.v1beta1.MsgTokenizeShares",
        value: {
            delegatorAddress: hubChain.address,
            validatorAddress: validator,
            amount: { denom: "uatom", amount: amount },
            tokenizedShareOwner: hubChain.address,
        },
    }

    const fee = await hubChain.estimateFee([msg])
    return await hubSigner.sign(hubChain.address, [msg], fee, "")
}

export function extractLSMDenom(broadcastResult: DeliverTxResponse): {
    amount: string
    denom: string
} {
    const tokenizeSharesEvent = broadcastResult.events.find(
        (event) => event.type === "tokenize_shares"
    )
    if (!tokenizeSharesEvent) {
        throw new Error("Tokenize shares event not found in broadcast result")
    }

    const tokenizedSharesAttribute = tokenizeSharesEvent.attributes.find(
        (attr) => attr.key === "tokenized_shares"
    )

    if (!tokenizedSharesAttribute) {
        throw new Error("Tokenized shares attribute not found in event")
    }

    const match = tokenizedSharesAttribute.value.match(/(.*)(cosmosvaloper.*)/)

    if (!match || match.length !== 3) {
        throw new Error("Unable to parse tokenized shares value")
    }

    const [_, amount, denom] = match

    return { amount, denom }
}

export async function signRedeemTokensForShares(
    hubChain: ChainContext,
    hubSigner: SigningStargateClient,
    amount: string,
    denom: string
) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set")
    }

    const msg: { typeUrl: string; value: MsgRedeemTokensForShares } = {
        typeUrl: "/cosmos.staking.v1beta1.MsgRedeemTokensForShares",
        value: {
            delegatorAddress: hubChain.address,
            amount: { denom, amount },
        },
    }

    const fee = await hubChain.estimateFee([msg])
    return await hubSigner.sign(hubChain.address, [msg], fee, "")
}

export async function signIBCTransferHubToNeutron(
    hubChain: ChainContext,
    hubSigner: SigningStargateClient,
    neutronChain: ChainContext,
    amount: string,
    denom: string
) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set")
    }
    if (!neutronChain.address) {
        throw new Error("Neutron chain address not set")
    }

    const msg: { typeUrl: string; value: MsgTransfer } = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: {
            sourcePort: "transfer",
            sourceChannel: "channel-569",
            token: { denom, amount },
            sender: hubChain.address,
            receiver: neutronChain.address,
            timeoutHeight: {
                revisionHeight: BigInt(0),
                revisionNumber: BigInt(0),
            },
            timeoutTimestamp:
                BigInt(Date.now() + 5 * 60 * 1000) * BigInt(1000000),
            memo: "",
        },
    }

    const fee = await hubChain.estimateFee([msg])
    return await hubSigner.sign(hubChain.address, [msg], fee, "")
}

export async function signIBCTransferNeutronToHub(
    hubChain: ChainContext,
    neutronChain: ChainContext,
    neutronSigner: SigningStargateClient,
    amount: string,
    denom: string
) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set")
    }
    if (!neutronChain.address) {
        throw new Error("Neutron chain address not set")
    }

    const msg: { typeUrl: string; value: MsgTransfer } = {
        typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
        value: {
            sourcePort: "transfer",
            sourceChannel: "channel-1",
            token: { denom, amount },
            sender: neutronChain.address,
            receiver: hubChain.address,
            timeoutHeight: {
                revisionHeight: BigInt(0),
                revisionNumber: BigInt(0),
            },
            timeoutTimestamp:
                BigInt(Date.now() + 5 * 60 * 1000) * BigInt(1000000),
            memo: "",
        },
    }
    const fee = await neutronChain.estimateFee([msg])
    return await neutronSigner.sign(neutronChain.address, [msg], fee, "")
}

export async function signLockTokens(
    neutronChain: ChainContext,
    neutronSigner: SigningStargateClient,
    lockDuration: number,
    denom: string,
    amount: string
) {
    const client = await neutronChain.getSigningCosmWasmClient()
    if (!neutronChain.address) {
        throw new Error("Neutron chain address not set")
    }

    const hydroClient = new HydroBaseClient(
        client,
        neutronChain.address,
        hydroContractAddress
    )
    const response = await hydroClient.lockTokens(
        { lockDuration },
        "auto",
        "",
        [{ denom, amount }]
    )
    return response
}

export async function broadcastTx(
    hubSigner: SigningStargateClient,
    neutronSigner: SigningStargateClient,
    signedTx: TxRaw
) {
    return await hubSigner.broadcastTx(
        new Uint8Array(txRaw.encode(signedTx).finish())
    )
}

export async function broadcastAndRelayIBCHubToNeutron(
    hubSigner: SigningStargateClient,
    hubChain: ChainContext,
    neutronSigner: SigningStargateClient,
    neutronChain: ChainContext,
    denom: string,
    signedTx: TxRaw,
    resolveResponsesTimeoutMs: number = 180000,
    resolveResponsesCheckIntervalMs: number = 12000
) {
    await hubSigner.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()))

    const startTime = Date.now()

    while (Date.now() - startTime < resolveResponsesTimeoutMs) {
        await new Promise((resolve) =>
            setTimeout(resolve, resolveResponsesCheckIntervalMs)
        )

        const neutronShares = await checkForNeutronLSMShares(
            neutronChain,
            neutronSigner
        )
        const foundShare = neutronShares.find(
            (share) => share.baseDenom === denom
        )

        if (foundShare) {
            console.log(
                `LSM shares (${denom}) successfully transferred to Neutron`
            )
            return foundShare
        }
    }

    throw new Error(
        `Timeout: LSM shares (${denom}) transfer not detected within ${resolveResponsesTimeoutMs}ms`
    )
}

export async function broadcastAndRelayIBCNeutronToHub(
    hubSigner: SigningStargateClient,
    hubChain: ChainContext,
    neutronSigner: SigningStargateClient,
    neutronChain: ChainContext,
    denom: string,
    signedTx: TxRaw,
    resolveResponsesTimeoutMs: number = 180000,
    resolveResponsesCheckIntervalMs: number = 12000
) {
    await neutronSigner.broadcastTx(
        new Uint8Array(txRaw.encode(signedTx).finish())
    )

    const startTime = Date.now()

    while (Date.now() - startTime < resolveResponsesTimeoutMs) {
        await new Promise((resolve) =>
            setTimeout(resolve, resolveResponsesCheckIntervalMs)
        )

        const hubShares = await checkForHubLSMShares(hubChain, hubSigner)
        const foundShare = hubShares.find((share) => share.denom === denom)

        if (foundShare) {
            console.log(`LSM shares (${denom}) successfully transferred to Hub`)
            return foundShare
        }
    }

    throw new Error(
        `Timeout: LSM shares (${denom}) transfer not detected within ${resolveResponsesTimeoutMs}ms`
    )
}
