"use client"
import "@interchain-ui/react/styles"

import { ChainProvider } from "@cosmos-kit/react"
import { wallets as keplr } from "@cosmos-kit/keplr-extension"
import { ChainName } from "@cosmos-kit/core"
import { Chain } from "@chain-registry/types"
import { Registry } from "@cosmjs/proto-signing"
import * as stride from "stridejs"

import { GasPrice } from "@cosmjs/stargate"

import { wallets as leap } from "@cosmos-kit/leap-extension"
import { wallets as cosmostation } from "@cosmos-kit/cosmostation-extension"
import { assets, chain } from "chain-registry/testnet/neutrontestnet"

import {
    DEFAULT_CHAIN,
    localAssets,
    localnetChain,
    testnetAssets,
    testnetChain,
    pionChain,
    hubChain,
    neutronChain,
} from "../config"

function gasPrices(chain: Chain | ChainName) {
    const chainName = typeof chain === "string" ? chain : chain.chain_name
    switch (chainName) {
        case "neutrontestnet":
            return {
                gasPrice: GasPrice.fromString("0.008untrn"),
            }
        case "cosmoshubtestnet":
            return {
                gasPrice: GasPrice.fromString("0.005uatom"),
            }
        case "cosmoshub":
            return {
                registry: new Registry([
                    ...stride.cosmosProtoRegistry,
                    ...stride.ibcProtoRegistry,
                ]),
                gasPrice: GasPrice.fromString("0.005uatom"),
            }
        case "neutron":
            return {
                gasPrice: GasPrice.fromString("0.008untrn"),
            }
        default:
            return void 0
    }
}

export function WalletHandler({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ChainProvider
            chains={[
                chain,
                testnetChain,
                localnetChain,
                pionChain,
                hubChain,
                neutronChain,
            ]}
            assetLists={[assets, testnetAssets, localAssets]}
            wallets={[...keplr, ...leap, ...cosmostation]} // supported wallets
            signerOptions={{
                signingStargate: (chain: Chain | ChainName) => {
                    const chainName =
                        typeof chain === "string" ? chain : chain.chain_name
                    switch (chainName) {
                        case "neutrontestnet":
                            return {
                                gasPrice: GasPrice.fromString("0.008untrn"),
                            }
                        case "cosmoshubtestnet":
                            return {
                                registry: new Registry([
                                    ...stride.cosmosProtoRegistry,
                                    ...stride.ibcProtoRegistry,
                                ]),
                                gasPrice: GasPrice.fromString("0.005uatom"),
                            }
                        case "cosmoshub":
                            return {
                                registry: new Registry([
                                    ...stride.cosmosProtoRegistry,
                                    ...stride.ibcProtoRegistry,
                                ]),
                                gasPrice: GasPrice.fromString("0.005uatom"),
                            }
                        case "neutron":
                            return {
                                gasPrice: GasPrice.fromString("0.008untrn"),
                            }
                        default:
                            return void 0
                    }
                },
                preferredSignType: (chain: Chain | ChainName) => {
                    return "direct"
                },
                signingCosmwasm: (chain: Chain | ChainName) => {
                    return gasPrices(chain)
                },
            }}
            endpointOptions={{
                endpoints: {
                    cosmoshubtestnet: {
                        rpc: [
                            "https://rpc.sentry-01.theta-testnet.polypore.xyz",
                        ],
                        rest: [
                            "https://rest.sentry-01.theta-testnet.polypore.xyz",
                        ],
                    },
                    neutrontestnet: {
                        rpc: ["https://rpc-palvus.pion-1.ntrn.tech"],
                        rest: ["https://rest-palvus.pion-1.ntrn.tech"],
                    },
                    neutron: {
                        rpc: ["https://neutron-rpc.polkachu.com"],
                        rest: ["https://neutron-api.polkachu.com/"],
                    },
                    cosmoshub: {
                        rpc: ["https://cosmos-rpc.polkachu.com"],
                        rest: ["https://cosmos-api.polkachu.com/"],
                    },
                },
                isLazy: true,
            }}
        >
            <div className="mx-auto max-w-screen">
                <div className="mx-auto flex items-center"></div>
                {children}
            </div>
        </ChainProvider>
    )
}
