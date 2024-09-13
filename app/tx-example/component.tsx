"use client"
import { useState } from 'react';
import { SigningStargateClient } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { useChain } from '@cosmos-kit/react';
import { cosmos } from 'interchain';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const { send } = cosmos.bank.v1beta1.MessageComposer.fromPartial;

export interface Coin {
    denom: string;
    amount: string;
}
export interface MsgTokenizeShares {
    delegatorAddress: string;
    validatorAddress: string;
    amount: Coin;
    tokenizedShareOwner: string;
}
export interface MsgTokenizeSharesProtoMsg {
    typeUrl: "/cosmos.staking.v1beta1.MsgTokenizeShares";
    value: Uint8Array;
}

export default function TXExample() {
    const hubChain = useChain("cosmoshub");
    const neutronChain = useChain("neutron");
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
    const [broadcastResult, setBroadcastResult] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("1000");
    const [toAddress, setToAddress] = useState<string>("cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv");

    const signAndBroadcastTransaction = async () => {
        if (!hubChain.address || !hubChain.getSigningStargateClient) {
            console.error("Hub chain wallet not connected or signing client not available");
            setTransactionStatus("error");
            return;
        }
        if (!neutronChain.address || !neutronChain.getSigningStargateClient) {
            console.error("Neutron chain wallet not connected or signing client not available");
            setTransactionStatus("error");
            return;
        }

        setTransactionStatus("waiting for signing");
        const signer = await hubChain.getSigningStargateClient();
        // const signer = await stride.getSigningCosmosClient({
        //     rpcEndpoint: await hubChain.getRpcEndpoint(),
        //     signer: hubChain.getOfflineSigner()
        // });
        try {
            const msg: { typeUrl: string, value: MsgTokenizeShares } = {
                typeUrl: "/cosmos.staking.v1beta1.MsgTokenizeShares",
                value: {
                    delegatorAddress: hubChain.address,
                    validatorAddress: 'cosmosvaloper16k579jk6yt2cwmqx9dz5xvq9fug2tekvlu9qdv',
                    amount: { denom: "uatom", amount: amount },
                    tokenizedShareOwner: hubChain.address
                }
            };

            const fee = await hubChain.estimateFee([msg]);
            const signed = await signer.sign(hubChain.address, [msg], fee, "");
            
            setTransactionStatus("waiting for broadcast");
            const result = await signer.broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()));

            setBroadcastResult(`hash: ${result.transactionHash}`);
            setTransactionStatus(null);
        } catch (error) {
            console.error("Error signing or broadcasting transaction:", error);
            setTransactionStatus("error");
        }
    };

    // const queryLSMShares = async () => {
    //     if (!hubChain.address || !hubChain.getSigningStargateClient) {
    //         console.error("Hub chain wallet not connected or signing client not available");
    //         setTransactionStatus("error");
    //         return;
    //     }

    //     hub
    // }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">TX Example</h1>
            
            <div className="space-y-4">
                <div>
                    <Label htmlFor="amount">Amount (in uatom)</Label>
                    <Input
                        className="text-black"
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>
                <div>
                    <Label htmlFor="toAddress">To Address (optional)</Label>
                    <Input
                        className="text-black"
                        id="toAddress"
                        type="text"
                        value={toAddress}
                        onChange={(e) => setToAddress(e.target.value)}
                        placeholder="Enter recipient address"
                    />
                </div>
                <div>
                    <Button onClick={signAndBroadcastTransaction}>Sign and Broadcast Transaction</Button>
                </div>
            </div>
            {transactionStatus && (
                <div className={`p-4 rounded-md ${
                    transactionStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                    <p className="font-bold">Transaction Status</p>
                    <p>{transactionStatus}</p>
                </div>
            )}
            {broadcastResult && (
                <Card>
                    <CardHeader>
                        <CardTitle>Broadcast Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                            {broadcastResult}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}