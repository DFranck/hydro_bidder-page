"use client"
import "@interchain-ui/react/styles"

import { ChainProvider } from "@cosmos-kit/react"
import { wallets as keplr } from "@cosmos-kit/keplr-extension"
import { AminoTypes } from "@cosmjs/stargate"
import { ChainName } from "@cosmos-kit/core"
import { Chain } from "@chain-registry/types"
import { Registry } from "@cosmjs/proto-signing"
import * as stride from "stridejs"

import { GasPrice } from "@cosmjs/stargate"

import { wallets as leap } from "@cosmos-kit/leap-extension"
import { wallets as cosmostation } from "@cosmos-kit/cosmostation-extension"
import { assets as hubAssets } from "chain-registry/mainnet/cosmoshub"
import { assets as neutronAssets } from "chain-registry/mainnet/neutron"

import { hubChain, neutronChain, endpoints } from "@/config"
import { cosmwasmAminoConverters } from "interchain"

function gasPrices(chain: Chain | ChainName) {
    const chainName = typeof chain === "string" ? chain : chain.chain_name
    switch (chainName) {
        // case "neutrontestnet":
        //     return {
        //         gasPrice: GasPrice.fromString("0.008untrn"),
        //     }
        // case "cosmoshubtestnet":
        //     return {
        //         gasPrice: GasPrice.fromString("0.005uatom"),
        //     }
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
                aminoTypes: new AminoTypes({
                    ...stride.cosmosAminoConverters,
                    ...stride.ibcAminoConverters,
                    ...cosmwasmAminoConverters,
                }),
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
                // chain,
                // testnetChain,
                // localnetChain,
                // pionChain,
                hubChain,
                neutronChain,
            ]}
            assetLists={[hubAssets, neutronAssets]}
            wallets={[...keplr, ...leap, ...cosmostation]} // supported wallets
            signerOptions={{
                signingStargate: (chain: Chain | ChainName) => {
                    const chainName =
                        typeof chain === "string" ? chain : chain.chain_name
                    switch (chainName) {
                        // case "neutrontestnet":
                        //     return {
                        //         gasPrice: GasPrice.fromString("0.008untrn"),
                        //     }
                        // case "cosmoshubtestnet":
                        //     return {
                        //         registry: new Registry([
                        //             ...stride.cosmosProtoRegistry,
                        //             ...stride.ibcProtoRegistry,
                        //         ]),
                        //         gasPrice: GasPrice.fromString("0.005uatom"),
                        //     }
                        case "cosmoshub":
                            return {
                                registry: new Registry([
                                    ...stride.cosmosProtoRegistry,
                                    ...stride.ibcProtoRegistry,
                                ]),
                                aminoTypes: new AminoTypes({
                                    ...stride.cosmosAminoConverters,
                                    ...stride.ibcAminoConverters,
                                }),
                                gasPrice: GasPrice.fromString("0.005uatom"),
                            }
                        case "neutron":
                            return {
                                aminoTypes: new AminoTypes({
                                    ...stride.cosmosAminoConverters,
                                    ...stride.ibcAminoConverters,
                                }),
                                gasPrice: GasPrice.fromString("0.008untrn"),
                            }
                        default:
                            return void 0
                    }
                },
                signingCosmwasm: (chain: Chain | ChainName) => {
                    return gasPrices(chain)
                },
            }}
            endpointOptions={{
                endpoints,
                isLazy: true,
            }}
        >
            <div className="max-w-screen mx-auto">
                <div className="mx-auto flex items-center"></div>
                {children}
            </div>
        </ChainProvider>
    )
}
