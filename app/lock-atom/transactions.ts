import { DeliverTxResponse, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { ChainContext } from "@cosmos-kit/core";
import { cosmos } from 'interchain';
const txRaw = cosmos.tx.v1beta1.TxRaw;
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";


export async function signTokenizeShares(hubChain: ChainContext, hubSigner: SigningStargateClient, amount: number, validator: string) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set");
    }
    // Mocking out with a send message for now
    const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: hubChain.address,
            toAddress: "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
            amount: [{ denom: "uatom", amount: amount }]
        }
    };

    const fee = await hubChain.estimateFee([msg]);
    const signed = await hubSigner.sign(hubChain.address, [msg], fee, "");
    return signed
}

export async function signRedeemTokensForShares(hubChain: ChainContext, hubSigner: SigningStargateClient, amount: number, validator: string) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set");
    }
    // Mocking out with a send message for now
    const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: hubChain.address,
            toAddress: "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
            amount: [{ denom: "uatom", amount: amount }]
        }
    };

    const fee = await hubChain.estimateFee([msg]);
    const signed = await hubSigner.sign(hubChain.address, [msg], fee, "");
    return signed
}

export async function signIBCTransfer(
    hubChain: ChainContext,
    hubSigner: SigningStargateClient,
    neutronChain: ChainContext,
    neutronSigner: SigningStargateClient,
    direction: "hubToNeutron" | "neutronToHub",
    amount: number,
    denom: string
) {
    if (!hubChain.address) {
        throw new Error("Hub chain address not set");
    }
    // Mocking out with a send message for now
    const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: hubChain.address,
            toAddress: "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
            amount: [{ denom: "uatom", amount: amount }]
        }
    };

    const fee = await hubChain.estimateFee([msg]);
    const signed = await hubSigner.sign(hubChain.address, [msg], fee, "");
    return signed
}

export async function signLockTokens(neutronChain: ChainContext, neutronSigner: SigningStargateClient, amount: number) {
    if (!neutronChain.address) {
        throw new Error("Hub chain address not set");
    }
    // Mocking out with a send message for now
    const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: neutronChain.address,
            toAddress: "cosmos13r7j89tfe5n6z5secywjt2dru7t4apy6gwuhew",
            amount: [{ denom: "uatom", amount: amount }]
        }
    };

    const fee = await neutronChain.estimateFee([msg]);
    const signed = await neutronSigner.sign(neutronChain.address, [msg], fee, "");
    return signed
}

export async function broadcastTx(
    hubSigner: SigningStargateClient,
    neutronSigner: SigningStargateClient,
    signedTx: TxRaw,
) {
    return await hubSigner.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()));
}

export async function broadcastAndRelayIBC(
    hubSigner: SigningStargateClient,
    neutronSigner: SigningStargateClient,
    direction: "hubToNeutron" | "neutronToHub",
    signedTx: TxRaw,
    resolveResponsesTimeoutMs: number = 180000,
    resolveResponsesCheckIntervalMs: number = 12000,
) {
    await hubSigner.broadcastTx(new Uint8Array(txRaw.encode(signedTx).finish()));
    // Mock implementation with a ten second sleep
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]);
        }, 10000);
    });
}
