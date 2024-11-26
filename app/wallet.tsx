"use client"

import { endpoints, hubChain, neutronChain } from "@/config"
import { Chain } from "@chain-registry/types"
import { Registry } from "@cosmjs/proto-signing"
import { AminoTypes, GasPrice } from "@cosmjs/stargate"
import { ChainName } from "@cosmos-kit/core"
import { wallets as cosmostation } from "@cosmos-kit/cosmostation"
import { wallets as keplr } from "@cosmos-kit/keplr"
import { wallets as leap } from "@cosmos-kit/leap"
import { ChainProvider } from "@cosmos-kit/react"
import "@interchain-ui/react/styles"
import { assets, chains } from "chain-registry"
import { assets as hubAssets } from "chain-registry/mainnet/cosmoshub"
import { assets as neutronAssets } from "chain-registry/mainnet/neutron"
import { cosmwasmAminoConverters } from "interchain"
import * as stride from "stridejs"

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
        ...chains,
        hubChain,
        neutronChain,
      ]}
      assetLists={[...assets, hubAssets, neutronAssets]}
      wallets={[...keplr, ...leap, ...cosmostation]} // supported wallets
      walletConnectOptions={{
        signClient: { projectId: "24cc0bf3e131070ae871552c32ea0cec" },
      }}
      signerOptions={{
        signingStargate: (chain: any) => {
          const chainName = typeof chain === "string" ? chain : chain.chain_name
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
        signingCosmwasm: (chain: any) => {
          return gasPrices(chain)
        },
      }}
      endpointOptions={{
        endpoints,
        isLazy: true,
      }}
    >
      {children}
    </ChainProvider>
  )
}
