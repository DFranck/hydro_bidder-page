"use client"

import { hubChain, neutronChain, sharedEndpoints } from "@/config"
import { Chain } from "@chain-registry/types"
import { Registry } from "@cosmjs/proto-signing"
import { AminoTypes, GasPrice } from "@cosmjs/stargate"
import { ChainName } from "@cosmos-kit/core"
import { wallets as cosmostation } from "@cosmos-kit/cosmostation"
import { wallets as keplr } from "@cosmos-kit/keplr"
import { wallets as leap } from "@cosmos-kit/leap"
import { ChainProvider } from "@cosmos-kit/react"
import "@interchain-ui/react/styles"
import {
  chain as cosmosHubChain,
  assets as hubAssets,
} from "chain-registry/mainnet/cosmoshub"
import {
  assets as neutronAssets,
  chain as neutronChainRegistry,
} from "chain-registry/mainnet/neutron"
import { cosmwasmAminoConverters } from "interchain"
import {
  cosmosAminoConverters,
  cosmosProtoRegistry,
  gaiaAminoConverters,
  gaiaProtoRegistry,
  ibcAminoConverters,
  ibcProtoRegistry,
} from "moonkittjs"

// Conditionally import all chains only in production
const isDevelopment = process.env.NODE_ENV === "development"
let allChains: any[] = []
let allAssets: any[] = []

if (!isDevelopment) {
  const chains = require("chain-registry/chains")
  const assets = require("chain-registry/assets")
  allChains = chains.default || chains
  allAssets = assets.default || assets
}

function gasPrices(chain: Chain | ChainName) {
  const chainName = typeof chain === "string" ? chain : chain.chain_name
  switch (chainName) {
    case "cosmoshub":
      return {
        registry: new Registry([...cosmosProtoRegistry, ...ibcProtoRegistry]),
        gasPrice: GasPrice.fromString("0.005uatom"),
      }
    case "neutron":
      return {
        aminoTypes: new AminoTypes({
          ...cosmosAminoConverters,
          ...ibcAminoConverters,
          ...cosmwasmAminoConverters,
        }),
        gasPrice: GasPrice.fromString("0.008untrn"),
      }
    default:
      return void 0
  }
}

export function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const chainsList = isDevelopment
    ? [cosmosHubChain, neutronChainRegistry, hubChain, neutronChain]
    : [...allChains, hubChain, neutronChain]

  const assetsList = isDevelopment
    ? [hubAssets, neutronAssets]
    : [...allAssets, hubAssets, neutronAssets]

  return (
    <ChainProvider
      throwErrors={false}
      chains={chainsList}
      assetLists={assetsList}
      wallets={[...keplr, ...leap, ...cosmostation]} // supported wallets
      walletConnectOptions={{
        signClient: { projectId: "24cc0bf3e131070ae871552c32ea0cec" },
      }}
      signerOptions={{
        signingStargate: (chain: any) => {
          const chainName = typeof chain === "string" ? chain : chain.chain_name
          switch (chainName) {
            case "cosmoshub":
              return {
                registry: new Registry([
                  ...cosmosProtoRegistry,
                  ...ibcProtoRegistry,
                  ...gaiaProtoRegistry,
                ]),
                aminoTypes: new AminoTypes({
                  ...cosmosAminoConverters,
                  ...ibcAminoConverters,
                  ...gaiaAminoConverters,
                }),
                gasPrice: GasPrice.fromString("0.005uatom"),
              }
            case "neutron":
              return {
                aminoTypes: new AminoTypes({
                  ...cosmosAminoConverters,
                  ...ibcAminoConverters,
                }),
                gasPrice: GasPrice.fromString("0.008untrn"),
              }
            default:
              return void 0
          }
        },
        signingCosmwasm: (chain: any) => {
          return gasPrices(chain)
        },
      }}
      endpointOptions={{
        endpoints: sharedEndpoints,
        isLazy: true,
      }}
      logLevel="NONE"
    >
      {children}
    </ChainProvider>
  )
}
