export const CHAIN_NAME = "localchain";
export const CHAIN_NAME_STORAGE_KEY = "selected-chain";
import { AssetList, Chain } from "@chain-registry/types";

export const DEFAULT_CHAIN = process.env.NEXT_PUBLIC_USE_CHAIN || "localchain";

export const testnetChain: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "cosmoshubtestnet",
  chain_id: "theta-testnet-001",
  pretty_name: "Cosmos Hub Public Testnet",
  status: "live",
  network_type: "testnet",
  bech32_prefix: "cosmos",
  daemon_name: "gaiad",
  node_home: "$HOME/.gaia",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "uatom",
        fixed_min_gas_price: 0.005,
        low_gas_price: 0.01,
        average_gas_price: 0.025,
        high_gas_price: 0.03,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "uatom",
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/cosmos/gaia",
    recommended_version: "v14.1.0",
    compatible_versions: ["v14.1.0-rc0", "v14.1.0"],
    binaries: {
      "linux/amd64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-amd64",
      "linux/arm64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-arm64",
      "darwin/amd64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-amd64",
      "darwin/arm64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-arm64",
      "windows/amd64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-amd64.exe",
      "windows/arm64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-arm64.exe",
    },
    genesis: {
      genesis_url:
        "https://github.com/cosmos/testnets/raw/master/public/genesis.json.gz",
    },
    versions: [
      {
        name: "v9.0.1",
        recommended_version: "v9.0.1",
        compatible_versions: ["v9.0.1"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-windows-amd64.exe",
        },
      },
      {
        name: "v10.0.1",
        recommended_version: "v10.0.1",
        compatible_versions: ["v10.0.1"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-windows-amd64.exe",
        },
      },
      {
        name: "v11",
        recommended_version: "v11.0.0",
        compatible_versions: ["v11.0.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-windows-arm64.exe",
        },
      },
      {
        name: "v12",
        recommended_version: "v12.0.0",
        compatible_versions: ["v12.0.0-rc0", "v12.0.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-windows-arm64.exe",
        },
      },
      {
        name: "v13",
        recommended_version: "v13.0.0",
        compatible_versions: ["v13.0.0-rc0", "v13.0.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-windows-arm64.exe",
        },
      },
      {
        name: "v14",
        recommended_version: "v14.1.0",
        compatible_versions: ["v14.1.0-rc0", "v14.1.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-arm64.exe",
        },
      },
    ],
  },
  peers: {
    seeds: [
      {
        id: "639d50339d7045436c756a042906b9a69970913f",
        address: "seed-01.theta-testnet.polypore.xyz:26656",
        provider: "Hypha",
      },
      {
        id: "3e506472683ceb7ed75c1578d092c79785c27857",
        address: "seed-02.theta-testnet.polypore.xyz:26656",
        provider: "Hypha",
      },
    ],
    persistent_peers: [],
  },
  apis: {
    rpc: [
      {
        address: "https://rpc.sentry-01.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://rpc.sentry-02.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://rpc.state-sync-01.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://rpc.state-sync-02.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://public-cosmos-theta.w3node.com",
        provider: "Interchain.FM",
      },
      {
        address: "https://rpc-theta.osmotest5.osmosis.zone/",
        provider: "Osmosis",
      },
    ],
    rest: [
      {
        address: "https://rest.sentry-01.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://rest.sentry-02.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://rest.state-sync-01.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://rest.state-sync-02.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://public-cosmos-theta.w3node.com/rest/",
        provider: "Interchain.FM",
      },
      {
        address: "https://lcd-theta.osmotest5.osmosis.zone/",
        provider: "Osmosis",
      },
    ],
    grpc: [
      {
        address: "https://grpc.sentry-01.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://grpc.sentry-02.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://grpc.state-sync-01.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
      {
        address: "https://grpc.state-sync-02.theta-testnet.polypore.xyz",
        provider: "Hypha",
      },
    ],
  },
  explorers: [
    {
      kind: "Mintscan",
      url: "https://mintscan.io/cosmoshub-testnet",
      tx_page: "https://mintscan.io/cosmoshub-testnet/txs/${txHash}",
    },
    {
      kind: "Big Dipper",
      url: "https://explorer.theta-testnet.polypore.xyz/",
      tx_page:
        "https://explorer.theta-testnet.polypore.xyz/transactions/${txHash}",
    },
  ],
};

export const testnetAssets = {
  $schema: "../../assetlist.schema.json",
  chain_name: "cosmoshubtestnet",
  assets: [
    {
      description:
        "The native staking and governance token of the Theta testnet version of the Cosmos Hub.",
      denom_units: [
        {
          denom: "uatom",
          exponent: 0,
        },
        {
          denom: "atom",
          exponent: 6,
        },
      ],
      base: "uatom",
      name: "Cosmos",
      display: "atom",
      symbol: "ATOM",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
        },
      ],
    },
  ],
};

export const localnetChain: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "localchain",
  chain_id: "theta-testnet-001",
  pretty_name: "Cosmos Hub Public Testnet",
  status: "live",
  network_type: "testnet",
  bech32_prefix: "cosmos",
  daemon_name: "gaiad",
  node_home: "$HOME/.gaia",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "uatom",
        fixed_min_gas_price: 0.005,
        low_gas_price: 0.01,
        average_gas_price: 0.025,
        high_gas_price: 0.03,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "uatom",
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/cosmos/gaia",
    recommended_version: "v14.1.0",
    compatible_versions: ["v14.1.0-rc0", "v14.1.0"],
    binaries: {
      "linux/amd64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-amd64",
      "linux/arm64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-arm64",
      "darwin/amd64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-amd64",
      "darwin/arm64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-arm64",
      "windows/amd64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-amd64.exe",
      "windows/arm64":
        "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-arm64.exe",
    },
    genesis: {
      genesis_url:
        "https://github.com/cosmos/testnets/raw/master/public/genesis.json.gz",
    },
    versions: [
      {
        name: "v9.0.1",
        recommended_version: "v9.0.1",
        compatible_versions: ["v9.0.1"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.0.1/gaiad-v9.0.1-windows-amd64.exe",
        },
      },
      {
        name: "v10.0.1",
        recommended_version: "v10.0.1",
        compatible_versions: ["v10.0.1"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.1/gaiad-v10.0.1-windows-amd64.exe",
        },
      },
      {
        name: "v11",
        recommended_version: "v11.0.0",
        compatible_versions: ["v11.0.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v11.0.0/gaiad-v11.0.0-windows-arm64.exe",
        },
      },
      {
        name: "v12",
        recommended_version: "v12.0.0",
        compatible_versions: ["v12.0.0-rc0", "v12.0.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v12.0.0/gaiad-v12.0.0-windows-arm64.exe",
        },
      },
      {
        name: "v13",
        recommended_version: "v13.0.0",
        compatible_versions: ["v13.0.0-rc0", "v13.0.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.0/gaiad-v13.0.0-windows-arm64.exe",
        },
      },
      {
        name: "v14",
        recommended_version: "v14.1.0",
        compatible_versions: ["v14.1.0-rc0", "v14.1.0"],
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-amd64.exe",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.1.0/gaiad-v14.1.0-windows-arm64.exe",
        },
      },
    ],
  },
  peers: {
    seeds: [
      {
        id: "639d50339d7045436c756a042906b9a69970913f",
        address: "seed-01.theta-testnet.polypore.xyz:26656",
        provider: "Hypha",
      },
      {
        id: "3e506472683ceb7ed75c1578d092c79785c27857",
        address: "seed-02.theta-testnet.polypore.xyz:26656",
        provider: "Hypha",
      },
    ],
    persistent_peers: [],
  },
  apis: {
    rpc: [
      {
        address: "http://localhost:3000/tm",
        provider: "LOCAL",
      },
    ],
    rest: [
      {
        address: "http://localhost:3000/rpc",
        provider: "LOCAL",
      },
    ],
    grpc: [
      {
        address: "http://localhost:9090",
        provider: "LOCAL",
      },
    ],
  },
  explorers: [
    {
      kind: "Mintscan",
      url: "https://mintscan.io/cosmoshub-testnet",
      tx_page: "https://mintscan.io/cosmoshub-testnet/txs/${txHash}",
    },
    {
      kind: "Big Dipper",
      url: "https://explorer.theta-testnet.polypore.xyz/",
      tx_page:
        "https://explorer.theta-testnet.polypore.xyz/transactions/${txHash}",
    },
  ],
};

export const localAssets: AssetList = {
  $schema: "../../assetlist.schema.json",
  chain_name: "localchain",
  assets: [
    {
      description:
        "The native staking and governance token of the Theta testnet version of the Cosmos Hub.",
      denom_units: [
        {
          denom: "uatom",
          exponent: 0,
        },
        {
          denom: "atom",
          exponent: 6,
        },
      ],
      base: "uatom",
      name: "Cosmos",
      display: "atom",
      symbol: "ATOM",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
        },
      ],
    },
  ],
};

export const pionChain: Chain = {
  "$schema": "../../chain.schema.json",
  "chain_name": "neutrontestnet",
  "status": "live",
  "network_type": "testnet",
  "pretty_name": "Neutron Testnet",
  // "chain_type": "cosmos",
  "chain_id": "pion-1",
  "bech32_prefix": "neutron",
  "daemon_name": "neutrond",
  "node_home": "$HOME/.neutrond",
  "key_algos": [
    "secp256k1"
  ],
  "slip44": 118,
  "fees": {
    "fee_tokens": [
      {
        "denom": "untrn",
        "low_gas_price": 0.0053,
        "average_gas_price": 0.0053,
        "high_gas_price": 0.0053
      }
    ]
  },
  "codebase": {
    "git_repo": "https://github.com/neutron-org/neutron",
    "recommended_version": "v4.0.0-rc3",
    "compatible_versions": [
      "v4.0.0-rc3"
    ],
    "cosmos_sdk_version": "0.50",
    "consensus": {
      "type": "cometbft",
      "version": "0.38.7"
    },
    "cosmwasm_version": "0.52",
    "cosmwasm_enabled": true,
    "ibc_go_version": "8.2.1",
    "genesis": {
      "genesis_url": "https://github.com/cosmos/testnets/raw/master/replicated-security/pion-1/pion-1-genesis.json"
    },
    "versions": [
      {
        "name": "v0.4.3",
        "next_version_name": "v1.0.4",
        "recommended_version": "v0.4.3",
        "compatible_versions": [
          "v0.4.3"
        ],
        "cosmos_sdk_version": "0.45",
        "consensus": {
          "type": "tendermint",
          "version": "0.34"
        },
        "cosmwasm_version": "0.31",
        "cosmwasm_enabled": true,
        "ibc_go_version": "4.3.0",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "0.45"
        // },
        // "cosmwasm": {
        //   "version": "0.31",
        //   "enabled": true
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "4.3.0"
        // }
      },
      {
        "name": "v1.0.4",
        "next_version_name": "v2.0.0",
        "recommended_version": "v1.0.4",
        "compatible_versions": [
          "v1.0.4"
        ],
        "cosmos_sdk_version": "0.45",
        "consensus": {
          "type": "cometbft",
          "version": "0.34.27"
        },
        "cosmwasm_version": "0.31",
        "cosmwasm_enabled": true,
        "ibc_go_version": "4.3.1",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "0.45"
        // },
        // "cosmwasm": {
        //   "version": "0.31",
        //   "enabled": true
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "4.3.1"
        // }
      },
      {
        "name": "v2.0.0",
        "next_version_name": "",
        "recommended_version": "v2.0.0",
        "compatible_versions": [
          "v2.0.0"
        ],
        "cosmos_sdk_version": "0.47",
        "consensus": {
          "type": "cometbft",
          "version": "0.37.2"
        },
        "cosmwasm_version": "0.45",
        "cosmwasm_enabled": true,
        "ibc_go_version": "7.3.1",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "0.47"
        // },
        // "cosmwasm": {
        //   "version": "0.45",
        //   "enabled": true
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "7.3.1"
        // }
      },
      {
        "name": "v3.0.0",
        "next_version_name": "v4.0.0-rc3",
        "recommended_version": "v3.0.0",
        "compatible_versions": [
          "v3.0.0"
        ],
        "cosmos_sdk_version": "0.47",
        "consensus": {
          "type": "cometbft",
          "version": "0.37.4"
        },
        "cosmwasm_version": "0.45",
        "cosmwasm_enabled": true,
        "ibc_go_version": "7.3.2",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "0.47"
        // },
        // "cosmwasm": {
        //   "version": "0.45",
        //   "enabled": true
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "7.3.2"
        // }
      },
      {
        "name": "v4.0.0-rc3",
        "next_version_name": "v4.2.1-testnet",
        "recommended_version": "v4.0.0-rc3",
        "compatible_versions": [
          "v4.0.0-rc3"
        ],
        "cosmos_sdk_version": "0.50",
        "consensus": {
          "type": "cometbft",
          "version": "0.38.7"
        },
        "cosmwasm_version": "0.51",
        "cosmwasm_enabled": true,
        "ibc_go_version": "8.2.1",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "0.50"
        // },
        // "cosmwasm": {
        //   "version": "0.51",
        //   "enabled": true
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "8.2.1"
        // }
      },
      {
        "name": "v4.2.1-testnet",
        "next_version_name": "",
        "recommended_version": "v4.2.1-testnet",
        "compatible_versions": [
          "v4.2.1-testnet"
        ],
        "cosmos_sdk_version": "0.50",
        "consensus": {
          "type": "cometbft",
          "version": "0.38.11"
        },
        "cosmwasm_version": "0.51",
        "cosmwasm_enabled": true,
        "ibc_go_version": "8.2.1",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "0.50"
        // },
        // "cosmwasm": {
        //   "version": "0.51",
        //   "enabled": true
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "8.2.1"
        // }
      }
    ],
    // "sdk": {
    //   "type": "cosmos",
    //   "version": "0.50"
    // },
    // "ibc": {
    //   "type": "go",
    //   "version": "8.2.1"
    // },
    // "cosmwasm": {
    //   "version": "0.52",
    //   "enabled": true
    // }
  },
  "logo_URIs": {
    "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.png",
    "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.svg"
  },
  "peers": {
    "seeds": [
      {
        "id": "0de4d730b5341d3a83721e1cbb5ce7772e26a400",
        "address": "p2p-falcron.pion-1.ntrn.tech:26656",
        "provider": "Neutron"
      }
    ],
    "persistent_peers": [
      {
        "id": "49d75c6094c006b6f2758e45457c1f3d6002ce7a",
        "address": "pion-banana.rs-testnet.polypore.xyz:26656",
        "provider": "Hypha"
      },
      {
        "id": "f2520026fb9086f1b2f09e132d209cbe88064ec1",
        "address": "pion-cherry.rs-testnet.polypore.xyz:26656",
        "provider": "Hypha"
      }
    ]
  },
  "apis": {
    "rpc": [
      {
        "address": "https://rpc-falcron.pion-1.ntrn.tech",
        "provider": "Neutron"
      },
      {
        "address": "https://neutron-testnet-rpc.polkachu.com/",
        "provider": "Polkachu"
      }
    ],
    "rest": [
      {
        "address": "https://rest-falcron.pion-1.ntrn.tech",
        "provider": "Neutron"
      },
      {
        "address": "https://api.pion.remedy.tm.p2p.org",
        "provider": "P2P.ORG"
      },
      {
        "address": "https://rest.baryon-sentry-01.rs-testnet.polypore.xyz",
        "provider": "Hypha"
      }
    ],
    "grpc": [
      {
        "address": "grpc-falcron.pion-1.ntrn.tech:80",
        "provider": "Neutron"
      },
      {
        "address": "grpc.baryon.remedy.tm.p2p.org:443",
        "provider": "P2P.ORG"
      }
    ]
  },
  "explorers": [
    {
      "kind": "Ping.pub Explorer from Hypha",
      "url": "https://explorer.rs-testnet.polypore.xyz/pion-1",
      "tx_page": "https://explorer.rs-testnet.polypore.xyz/pion-1/tx/${txHash}",
      "account_page": "https://explorer.rs-testnet.polypore.xyz/baryon-1/account/${accountAddress}"
    },
    {
      "kind": "Mintscan",
      "url": "https://mintscan.io/neutron-testnet",
      "tx_page": "https://mintscan.io/neutron-testnet/txs/${txHash}",
      "account_page": "https://mintscan.io/neutron-testnet/account/${accountAddress}"
    }
  ],
  "images": [
    {
      "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.png",
      "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.svg"
    }
  ]
}