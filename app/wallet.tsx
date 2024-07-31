"use client";
import "@interchain-ui/react/styles";

import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplr } from "@cosmos-kit/keplr-extension";
import { ChainName } from "@cosmos-kit/core";
import { Chain } from "@chain-registry/types";
import { Registry } from "@cosmjs/proto-signing";

import { defaultRegistryTypes, GasPrice } from "@cosmjs/stargate";

import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as cosmostation } from "@cosmos-kit/cosmostation-extension";

import {
  CHAIN_NAME,
  DEFAULT_CHAIN,
  localAssets,
  localnetChain,
  testnetAssets,
  testnetChain,
} from "../config";
// import {
//   MsgOptIn,
//   MsgOptOut,
// } from "./proto-types-gen/src/interchain_security/ccv/provider/v1/tx";

function initRegistry(): Registry {
  const myRegistry = new Registry(defaultRegistryTypes);
  // myRegistry.register(
  //   "/interchain_security.ccv.provider.v1.MsgOptIn",
  //   MsgOptIn
  // );
  // myRegistry.register(
  //   "/interchain_security.ccv.provider.v1.MsgOptOut",
  //   MsgOptOut
  // );
  return myRegistry;
}

export function WalletHandler({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChainProvider
      chains={[testnetChain, localnetChain]}
      assetLists={[testnetAssets, localAssets]}
      wallets={[...keplr, ...leap, ...cosmostation]} // supported wallets
      signerOptions={{
        signingStargate: (chain: Chain | ChainName) => {
          const chainName =
            typeof chain === "string" ? chain : chain.chain_name;
          switch (chainName) {
            case DEFAULT_CHAIN:
              return {
                registry: initRegistry(),
                gasPrice: GasPrice.fromString("0.005uatom"),
              };
            default:
              return void 0;
          }
        },
        preferredSignType: (chain: Chain | ChainName) => {
          return "direct";
        },
      }}
      endpointOptions={{
        endpoints: {
          cosmoshubtestnet: {
            // rpc: ["http://localhost:3000/tm"],
            // rest: ["http://localhost:3000/rpc"],
            rpc: ["https://rpc.sentry-01.theta-testnet.polypore.xyz"],
            rest: ["https://rest.sentry-01.theta-testnet.polypore.xyz"],
          },
        },
        isLazy: true,
      }}
    >
      <div className="mx-auto max-w-screen">
        <div className="mx-auto flex items-center">
        </div>
        {children}
      </div>
    </ChainProvider>
  );
}
