"use client"

import { HydroBaseClient } from "@/app/ts_types/HydroBase.client"
import {
  DeliverTxResponse,
  SigningStargateClient,
  StdFee,
} from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { cosmos } from "interchain"
import { MsgExecuteContract } from "interchain/dist/codegen/cosmwasm/wasm/v1/tx"
import {
  MsgRedeemTokensForShares,
  MsgTokenizeShares,
} from "stridejs/types/codegen/cosmos/staking/v1beta1/tx"
import { MsgTransfer } from "stridejs/types/codegen/ibc/applications/transfer/v1/tx"

export const minimumUNTRNGas = 10000
export const minimumUATOMGas = 10000
export const UATOMDenom =
  "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"

const txRaw = cosmos.tx.v1beta1.TxRaw

// TODO: unlock and move tokens from this contract after the lock is complete
// const hydroContractAddress =
//     "neutron192s005pfsx7j397l4jarhgu8gs2lcgwyuntehp6wundrh8pgkywqgss0tm"

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

  const lsmSharesPromises: Promise<{
    validator: string
    amount: string
    denom: string
    baseDenom: string
  } | null>[] = response.balances.map(
    (balance: { denom: string; amount: string }) =>
      fetchDenomTrace(balance, restEndpoint as string)
  )
  const lsmSharesResults = await Promise.all(lsmSharesPromises)
  const lsmShares = lsmSharesResults.filter((share) => share !== null)

  return lsmShares
}

export async function checkForGasOnNeutron(neutronChain: ChainContext) {
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }

  const restEndpoint = await neutronChain.getRestEndpoint()

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
    `${restEndpoint}cosmos/bank/v1beta1/balances/${neutronChain.address}`
  ).then((res) => res.json())

  const balances = response.balances
  const untrnBalance = balances.find((b) => b.denom === "untrn")
  const uatomBalance = balances.find((b) => b.denom === UATOMDenom)

  const hasEnoughUntrn =
    untrnBalance && Number(untrnBalance.amount) >= minimumUNTRNGas
  const hasEnoughUatom =
    uatomBalance && Number(uatomBalance.amount) >= minimumUATOMGas

  return {
    hasEnoughUntrn: !!hasEnoughUntrn,
    hasEnoughUatom: !!hasEnoughUatom,
    untrnBalance: untrnBalance ? untrnBalance.amount : "0",
    uatomBalance: uatomBalance ? uatomBalance.amount : "0",
  }
}

export async function checkForGasOnHub(hubChain: ChainContext) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }

  const restEndpoint = await hubChain.getRestEndpoint()

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
    `${restEndpoint}cosmos/bank/v1beta1/balances/${hubChain.address}`
  ).then((res) => res.json())

  const balances = response.balances
  const uatomBalance = balances.find((b) => b.denom === "uatom")

  const hasEnoughUatom =
    uatomBalance && Number(uatomBalance.amount) > minimumUATOMGas * 2

  return {
    hasEnoughUatom: !!hasEnoughUatom,
    uatomBalance: uatomBalance ? uatomBalance.amount : "0",
  }
}

export const fetchDenomTrace = async (
  balance: { denom: string; amount: string },
  restEndpoint: string
) => {
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
      console.error(`Error fetching denom trace for ${balance.denom}:`, error)
    }
  }
  return null
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

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
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

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
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
      timeoutTimestamp: BigInt(Date.now() + 5 * 60 * 1000) * BigInt(1000000),
      memo: "",
    },
  }

  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
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
      timeoutTimestamp: BigInt(Date.now() + 5 * 60 * 1000) * BigInt(1000000),
      memo: "",
    },
  }
  const fee = await neutronChain.estimateFee([msg], undefined, undefined, 1.5)
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

  if (!process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS) {
    throw new Error("Hydro contract address not set")
  }

  const hydroClient = new HydroBaseClient(
    client,
    neutronChain.address,
    process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
  )

  // pepare message for simulating gas
  const simulateMsg = MsgExecuteContract.fromPartial({
    contract: process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS,
    sender: neutronChain.address,
    msg: new TextEncoder().encode(
      JSON.stringify({
        lock_tokens: {
          lock_duration: lockDuration,
        },
      })
    ),
    funds: [{ amount, denom }],
  })

  // gas estimate from simulated message
  const gasEstimate = await hydroClient.client.simulate(
    neutronChain.address,
    [
      {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: simulateMsg,
      },
    ],
    ""
  )

  // use gas from simulated message with a gas multiplier
  const fee: StdFee = {
    amount: [],
    gas: Math.round(gasEstimate * 1.55).toString(),
  }
  const response = await hydroClient.lockTokens({ lockDuration }, fee, "", [
    { denom, amount },
  ])
  return response
}

export async function signATOMGasTransferToNeutron(
  hubChain: ChainContext,
  hubSigner: SigningStargateClient,
  neutronChain: ChainContext
) {
  if (!hubChain.address) {
    throw new Error("Hub chain address not set")
  }
  if (!neutronChain.address) {
    throw new Error("Neutron chain address not set")
  }
  // Transfer UATOM from hub to neutron
  const msg: { typeUrl: string; value: MsgTransfer } = {
    typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    value: {
      sourcePort: "transfer",
      sourceChannel: "channel-569",
      token: { denom: "uatom", amount: minimumUATOMGas.toString() },
      sender: hubChain.address,
      receiver: neutronChain.address,
      timeoutHeight: {
        revisionHeight: BigInt(0),
        revisionNumber: BigInt(0),
      },
      timeoutTimestamp: BigInt(Date.now() + 5 * 60 * 1000) * BigInt(1000000),
      memo: "",
    },
  }
  const fee = await hubChain.estimateFee([msg], undefined, undefined, 1.5)
  return await hubSigner.sign(hubChain.address, [msg], fee, "")
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
    const foundShare = neutronShares.find((share) => share.baseDenom === denom)

    if (foundShare) {
      console.log(`LSM shares (${denom}) successfully transferred to Neutron`)
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
  baseDenom: string,
  signedTx: TxRaw,
  resolveResponsesTimeoutMs: number = 180000,
  resolveResponsesCheckIntervalMs: number = 12000
) {
  neutronSigner.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()))

  const startTime = Date.now()

  while (Date.now() - startTime < resolveResponsesTimeoutMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, resolveResponsesCheckIntervalMs)
    )

    const hubShares = await checkForHubLSMShares(hubChain, hubSigner)
    const foundShare = hubShares.find((share) => share.denom === baseDenom)

    if (foundShare) {
      console.log(`LSM shares (${foundShare}) successfully transferred to Hub`)
      return foundShare
    }
  }

  throw new Error(
    `Timeout: LSM shares (${denom}) transfer not detected within ${resolveResponsesTimeoutMs}ms`
  )
}

export async function broadcastAndRelayIBCGasToNeutron(
  hubSigner: SigningStargateClient,
  neutronChain: ChainContext,
  signedTx: TxRaw,
  resolveResponsesTimeoutMs: number = 180000,
  resolveResponsesCheckIntervalMs: number = 12000
) {
  await hubSigner.broadcastTx(new Uint8Array(TxRaw.encode(signedTx).finish()))

  const startTime = Date.now()

  while (Date.now() - startTime < resolveResponsesTimeoutMs) {
    await new Promise((resolve) =>
      setTimeout(resolve, resolveResponsesCheckIntervalMs)
    )

    const gasCheck = await checkForGasOnNeutron(neutronChain)

    if (gasCheck.hasEnoughUatom) {
      console.log(
        `Gas (${gasCheck.uatomBalance} uatom) successfully transferred to Neutron`
      )
      return gasCheck
    }
  }

  throw new Error(
    `Timeout: Gas transfer not detected within ${resolveResponsesTimeoutMs}ms`
  )
}
