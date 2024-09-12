'use client'
import '@interchain-ui/react/styles'

import { ChainProvider } from '@cosmos-kit/react'
import { wallets as keplr } from '@cosmos-kit/keplr-extension'
import { ChainName } from '@cosmos-kit/core'
import { Chain } from '@chain-registry/types'
import { Registry } from "@cosmjs/proto-signing";
import * as stride from 'stridejs';

import { GasPrice } from '@cosmjs/stargate'

import { wallets as leap } from '@cosmos-kit/leap-extension'
import { wallets as cosmostation } from '@cosmos-kit/cosmostation-extension'

import {
    DEFAULT_CHAIN,
    localAssets,
    localnetChain,
    testnetAssets,
    testnetChain,
    pionChain,
} from '../config'

function gasPrices(chain: Chain | ChainName) {
    const chainName = typeof chain === 'string' ? chain : chain.chain_name
    switch (chainName) {
        case 'neutrontestnet':
            return {
                gasPrice: GasPrice.fromString('0.008untrn'),
            }
        case 'cosmoshubtestnet':
            return {
                gasPrice: GasPrice.fromString('0.005uatom'),
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
            chains={[testnetChain, localnetChain, pionChain]}
            assetLists={[testnetAssets, localAssets]}
            wallets={[...keplr, ...leap, ...cosmostation]} // supported wallets
            signerOptions={{
                signingStargate: (chain: Chain | ChainName) => {
                    const chainName =
                        typeof chain === 'string' ? chain : chain.chain_name
                    switch (chainName) {
                        case 'neutrontestnet':
                            return {
                                gasPrice: GasPrice.fromString('0.008untrn'),
                            }
                        case 'cosmoshubtestnet':
                            return {
                                registry: new Registry([...stride.cosmosProtoRegistry, ...stride.ibcProtoRegistry]),
                                gasPrice: GasPrice.fromString('0.005uatom'),
                            }
                        default:
                            return void 0
                    }
                },
                preferredSignType: (chain: Chain | ChainName) => {
                    return 'direct'
                },
                signingCosmwasm: (chain: Chain | ChainName) => {
                    return gasPrices(chain)
                },
            }}
            endpointOptions={{
                endpoints: {
                    cosmoshubtestnet: {
                        // rpc: ["http://localhost:3000/tm"],
                        // rest: ["http://localhost:3000/rpc"],
                        rpc: [
                            'https://rpc.sentry-01.theta-testnet.polypore.xyz',
                        ],
                        rest: [
                            'https://rest.sentry-01.theta-testnet.polypore.xyz',
                        ],
                    },
                    neutrontestnet: {
                        rpc: ['https://rpc-palvus.pion-1.ntrn.tech'],
                        rest: ['https://rest-palvus.pion-1.ntrn.tech'],
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
