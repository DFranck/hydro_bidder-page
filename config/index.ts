export const CHAIN_NAME = "localchain"
export const CHAIN_NAME_STORAGE_KEY = "selected-chain"
import { AssetList, Chain } from "@chain-registry/types"

export const endpoints = {
  // cosmoshubtestnet: {
  //     rpc: ["https://rpc.sentry-01.theta-testnet.polypore.xyz"],
  //     rest: ["https://rest.sentry-01.theta-testnet.polypore.xyz"],
  // },
  // neutrontestnet: {
  //     rpc: ["https://rpc-palvus.pion-1.ntrn.tech"],
  //     rest: ["https://rest-palvus.pion-1.ntrn.tech"],
  // },
  neutron: {
    rpc: ["https://neutron-rpc.polkachu.com"],
    rest: ["https://neutron-api.polkachu.com/"],
  },
  cosmoshub: {
    rpc: ["https://cosmos-rpc.publicnode.com/"],
    rest: ["https://cosmos-rest.publicnode.com/"],
  },
}

export const NEUTRON_DEFAULT_RPC = "https://rpc.neutron.quokkastake.io/"

export const DEFAULT_EPOCH_LENGTH = 2628000000000000

export const DEFAULT_TOP_N = 5

export const getPriceFeedUrl = (denoms: string[]) =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${denoms.join(
    ","
  )}&vs_currencies=usd`

export const ATOM_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=usd"

export const EPOCH_LENGTH = 2628000000000000

export const DEFAULT_CHAIN = process.env.NEXT_PUBLIC_USE_CHAIN || "localchain"

export const testnetChain: Chain = {
  $schema: "../../chain.schema.json",
  chain_type: "cosmos",
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
}

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
}

export const localnetChain: Chain = {
  $schema: "../../chain.schema.json",
  chain_type: "cosmos",
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
}

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
}

export const pionChain: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "neutrontestnet",
  status: "live",
  network_type: "testnet",
  pretty_name: "Neutron Testnet",
  chain_type: "cosmos",
  chain_id: "pion-1",
  bech32_prefix: "neutron",
  daemon_name: "neutrond",
  node_home: "$HOME/.neutrond",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "untrn",
        low_gas_price: 0.0053,
        average_gas_price: 0.0053,
        high_gas_price: 0.0053,
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/neutron-org/neutron",
    recommended_version: "v4.0.0-rc3",
    compatible_versions: ["v4.0.0-rc3"],
    cosmos_sdk_version: "0.50",
    consensus: {
      type: "cometbft",
      version: "0.38.7",
    },
    cosmwasm_version: "0.52",
    cosmwasm_enabled: true,
    ibc_go_version: "8.2.1",
    genesis: {
      genesis_url:
        "https://github.com/cosmos/testnets/raw/master/replicated-security/pion-1/pion-1-genesis.json",
    },
    versions: [
      {
        name: "v0.4.3",
        next_version_name: "v1.0.4",
        recommended_version: "v0.4.3",
        compatible_versions: ["v0.4.3"],
        cosmos_sdk_version: "0.45",
        consensus: {
          type: "tendermint",
          version: "0.34",
        },
        cosmwasm_version: "0.31",
        cosmwasm_enabled: true,
        ibc_go_version: "4.3.0",
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
        name: "v1.0.4",
        next_version_name: "v2.0.0",
        recommended_version: "v1.0.4",
        compatible_versions: ["v1.0.4"],
        cosmos_sdk_version: "0.45",
        consensus: {
          type: "cometbft",
          version: "0.34.27",
        },
        cosmwasm_version: "0.31",
        cosmwasm_enabled: true,
        ibc_go_version: "4.3.1",
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
        name: "v2.0.0",
        next_version_name: "",
        recommended_version: "v2.0.0",
        compatible_versions: ["v2.0.0"],
        cosmos_sdk_version: "0.47",
        consensus: {
          type: "cometbft",
          version: "0.37.2",
        },
        cosmwasm_version: "0.45",
        cosmwasm_enabled: true,
        ibc_go_version: "7.3.1",
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
        name: "v3.0.0",
        next_version_name: "v4.0.0-rc3",
        recommended_version: "v3.0.0",
        compatible_versions: ["v3.0.0"],
        cosmos_sdk_version: "0.47",
        consensus: {
          type: "cometbft",
          version: "0.37.4",
        },
        cosmwasm_version: "0.45",
        cosmwasm_enabled: true,
        ibc_go_version: "7.3.2",
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
        name: "v4.0.0-rc3",
        next_version_name: "v4.2.1-testnet",
        recommended_version: "v4.0.0-rc3",
        compatible_versions: ["v4.0.0-rc3"],
        cosmos_sdk_version: "0.50",
        consensus: {
          type: "cometbft",
          version: "0.38.7",
        },
        cosmwasm_version: "0.51",
        cosmwasm_enabled: true,
        ibc_go_version: "8.2.1",
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
        name: "v4.2.1-testnet",
        next_version_name: "",
        recommended_version: "v4.2.1-testnet",
        compatible_versions: ["v4.2.1-testnet"],
        cosmos_sdk_version: "0.50",
        consensus: {
          type: "cometbft",
          version: "0.38.11",
        },
        cosmwasm_version: "0.51",
        cosmwasm_enabled: true,
        ibc_go_version: "8.2.1",
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
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.png",
    svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.svg",
  },
  peers: {
    seeds: [
      {
        id: "0de4d730b5341d3a83721e1cbb5ce7772e26a400",
        address: "p2p-falcron.pion-1.ntrn.tech:26656",
        provider: "Neutron",
      },
    ],
    persistent_peers: [
      {
        id: "49d75c6094c006b6f2758e45457c1f3d6002ce7a",
        address: "pion-banana.rs-testnet.polypore.xyz:26656",
        provider: "Hypha",
      },
      {
        id: "f2520026fb9086f1b2f09e132d209cbe88064ec1",
        address: "pion-cherry.rs-testnet.polypore.xyz:26656",
        provider: "Hypha",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://rpc-falcron.pion-1.ntrn.tech",
        provider: "Neutron",
      },
      {
        address: "https://neutron-testnet-rpc.polkachu.com/",
        provider: "Polkachu",
      },
    ],
    rest: [
      {
        address: "https://rest-falcron.pion-1.ntrn.tech",
        provider: "Neutron",
      },
      {
        address: "https://api.pion.remedy.tm.p2p.org",
        provider: "P2P.ORG",
      },
      {
        address: "https://rest.baryon-sentry-01.rs-testnet.polypore.xyz",
        provider: "Hypha",
      },
    ],
    grpc: [
      {
        address: "grpc-falcron.pion-1.ntrn.tech:80",
        provider: "Neutron",
      },
      {
        address: "grpc.baryon.remedy.tm.p2p.org:443",
        provider: "P2P.ORG",
      },
    ],
  },
  explorers: [
    {
      kind: "Ping.pub Explorer from Hypha",
      url: "https://explorer.rs-testnet.polypore.xyz/pion-1",
      tx_page: "https://explorer.rs-testnet.polypore.xyz/pion-1/tx/${txHash}",
      account_page:
        "https://explorer.rs-testnet.polypore.xyz/baryon-1/account/${accountAddress}",
    },
    {
      kind: "Mintscan",
      url: "https://mintscan.io/neutron-testnet",
      tx_page: "https://mintscan.io/neutron-testnet/txs/${txHash}",
      account_page:
        "https://mintscan.io/neutron-testnet/account/${accountAddress}",
    },
  ],
  images: [
    {
      png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.png",
      svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron-black-logo.svg",
    },
  ],
}

export const hubChain = {
  $schema: "../chain.schema.json",
  chain_name: "cosmoshub",
  chain_type: "cosmos",
  chain_id: "cosmoshub-4",
  website: "https://cosmos.network/",
  pretty_name: "Cosmos Hub",
  status: "live",
  network_type: "mainnet",
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
    recommended_version: "v19.2.0",
    compatible_versions: ["v19.2.0"],
    cosmos_sdk_version: "v0.50.9-lsm",
    ibc_go_version: "v8.4.0",
    consensus: {
      type: "cometbft",
      version: "v0.38.11",
    },
    cosmwasm_version: "v0.51.0",
    binaries: {
      "linux/amd64":
        "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-linux-amd64",
      "linux/arm64":
        "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-linux-arm64",
      "darwin/amd64":
        "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-darwin-amd64",
      "darwin/arm64":
        "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-darwin-arm64",
    },
    genesis: {
      genesis_url:
        "https://github.com/cosmos/mainnet/raw/master/genesis/genesis.cosmoshub-4.json.gz",
    },
    versions: [
      {
        name: "v9-Lambda",
        tag: "v9.1.1",
        recommended_version: "v9.1.1",
        compatible_versions: ["v9.1.1"],
        cosmos_sdk_version: "v0.45.15-ics",
        ibc_go_version: "v4.2.1",
        consensus: {
          type: "cometbft",
          version: "v0.34.27",
        },
        height: 15213800,
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.1.1/gaiad-v9.1.1-linux-amd64?checksum=sha256:f62814711be991e535b2fd86f7d4ed8c055bebf774253a06477dc182ce98cdc3",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v9.1.1/gaiad-v9.1.1-linux-arm64?checksum=sha256:a7112c03c7a2bec2a761a3d430bfea9616ed0ebb10c785cafdd6fac117abc504",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.1.1/gaiad-v9.1.1-darwin-amd64?checksum=sha256:959f3ddbf3a65b557574527222c5a673b706e9d52a203dfbda2ceb827b760261",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v9.1.1/gaiad-v9.1.1-darwin-arm64?checksum=sha256:0a913a3a9a31456ddfba26eccdfccca61d00b06498faa94019776df391509d27",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v9.1.1/gaiad-v9.1.1-windows-amd64.exe?checksum=sha256:db1d82650ed2a0aa9abccb2bb60dca902c4d1444444f6c76a8b6d61d6bc41e08",
        },
        next_version_name: "v10",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.45.15",
        //   "tag": "v0.45.15-ics"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v4.2.1"
        // }
      },
      {
        name: "v10",
        tag: "v10.0.2",
        proposal: 798,
        height: 15816200,
        recommended_version: "v10.0.2",
        compatible_versions: ["v10.0.0", "v10.0.1", "v10.0.2"],
        cosmos_sdk_version: "v0.45.16-ics",
        ibc_go_version: "v4.4.2",
        consensus: {
          type: "cometbft",
          version: "v0.34.29",
        },
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.2/gaiad-v10.0.2-linux-amd64?checksum=sha256:fcb8210308223d78bc36f3d4c89e2578dcf784994c052cea97efd61f1672cf72",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.2/gaiad-v10.0.2-linux-arm64?checksum=sha256:db9b69cf224b410c669fa4f820192890357534e74d4693a744ef915028567462",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.2/gaiad-v10.0.2-darwin-amd64?checksum=sha256:d0bee3b4b243fe1f88ad3258f4648de3a73787434702bcac6e31ca38f81a283a",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.2/gaiad-v10.0.2-darwin-arm64?checksum=sha256:c8124d66ffa99b51da274656f6c3401b1ec9e165a76f3f01699761672e83a136gaiad-v10.0.1-linux-amd64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v10.0.2/gaiad-v10.0.2-windows-amd64.exe?checksum=sha256:c02ab2b8fc347f858db1c33fcacafa2467ca550ed83178aee67331762e876926",
        },
        next_version_name: "v11",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.45.16",
        //   "tag": "v0.45.16-ics"
        // // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v4.4.2"
        // }
      },
      {
        name: "v11",
        tag: "v11.0.0",
        proposal: 804,
        height: 16596000,
        recommended_version: "v11.0.0",
        compatible_versions: ["v11.0.0"],
        cosmos_sdk_version: "v0.45.16-ics",
        ibc_go_version: "v4.4.2",
        consensus: {
          type: "cometbft",
          version: "v0.34.29",
        },
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
        next_version_name: "v12",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.45.16",
        //   "tag": "v0.45.16-ics"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v4.4.2"
        // }
      },
      {
        name: "v12",
        tag: "v12.0.0",
        proposal: 821,
        height: 16985500,
        recommended_version: "v12.0.0",
        compatible_versions: ["v12.0.0"],
        cosmos_sdk_version: "v0.45.16-ics",
        ibc_go_version: "v4.4.2",
        consensus: {
          type: "cometbft",
          version: "v0.34.29",
        },
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
        next_version_name: "v13",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.45.16",
        //   "tag": "v0.45.16-ics"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v4.4.2"
        // }
      },
      {
        name: "v13",
        tag: "v13.0.2",
        proposal: 825,
        height: 17380000,
        recommended_version: "v13.0.2",
        compatible_versions: ["v13.0.1", "v13.0.2"],
        cosmos_sdk_version: "v0.45.16-ics-lsm",
        ibc_go_version: "v4.4.2",
        consensus: {
          type: "cometbft",
          version: "v0.34.29",
        },
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.2/gaiad-v13.0.2-linux-amd64?checksum=sha256:729a55b29857fedfe1271f26e1fdf2cb12d2c6515c2ad0d9bbe432a81ae43df8",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.2/gaiad-v13.0.2-linux-arm64?checksum=sha256:9bfbe0d5212fa3cdabe34b75b42e1420f50fe8aff64ec9247dcbc5942969e333",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.2/gaiad-v13.0.2-darwin-amd64?checksum=sha256:910b515369b0cfa8eecc54f2f930fd5de2634b7106825b62f4c4c563fe2a6a07",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.2/gaiad-v13.0.2-darwin-arm64?checksum=sha256:5a148b56bec7d9ef23d21778725eedb9bc70eaa6a61155b22947216812a17369",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.2/gaiad-v13.0.2-windows-amd64.exe?checksum=sha256:bc339c368b07306a73a16af8f005bc14439b393790f61d0568358495eb83e71c",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v13.0.2/gaiad-v13.0.2-windows-arm64.exe?checksum=sha256:8728e0f56d52479c80ba4b1c8f68a8fc3085220fad241ba1180867b2c3bc97fa",
        },
        next_version_name: "v14",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.45.16",
        //   "tag": "v0.45.16-ics-lsm"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v4.4.2"
        // }
      },
      {
        name: "v14",
        tag: "v14.2.0",
        proposal: 854,
        height: 18262000,
        recommended_version: "v14.2.0",
        compatible_versions: ["v14.2.0"],
        cosmos_sdk_version: "v0.45.16-ics-lsm",
        ibc_go_version: "v4.4.2",
        consensus: {
          type: "cometbft",
          version: "v0.34.29",
        },
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.2.0/gaiad-v14.2.0-linux-amd64?checksum=sha256:baed43bd3f523fd587cff4d8f78f395a3bcb6d20d9a671bef69b8fbe101338f6",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.2.0/gaiad-v14.2.0-linux-arm64?checksum=sha256:a57822b2a199ca461f8a8baf4e98a46803f8fa5d4ceb130b539ebd0c03c035a8",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.2.0/gaiad-v14.2.0-darwin-amd64?checksum=sha256:4edec8b191bbb0bdcd0f89d1fadfc1cfdb720ac943b7c03d584760725547c047",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.2.0/gaiad-v14.2.0-darwin-arm64?checksum=sha256:5177c7ca2b0e66daedc506c6fcdab0d8c436dae846de32081556b8edd57027e8",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v14.2.0/gaiad-v14.2.0-windows-amd64.exe?checksum=sha256:d912548fc1c87ca26defce1a60f089910fa55b38d27063870750efeab176db9d",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v14.2.0/gaiad-v14.2.0-windows-arm64.exe?checksum=sha256:b17cc1f1a9a5050b72f99d497fdda6d1d4615b6a42971f556d2777ba838fe7b0",
        },
        next_version_name: "v15",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.45.16",
        //   "tag": "v0.45.16-ics-lsm"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v4.4.2"
        // }
      },
      {
        name: "v15",
        tag: "v15.2.0",
        proposal: 885,
        height: 19639600,
        recommended_version: "v15.2.0",
        compatible_versions: ["v15.2.0"],
        cosmos_sdk_version: "v0.47.11-ics-lsm",
        ibc_go_version: "v7.4.0",
        consensus: {
          type: "cometbft",
          version: "v0.37.4",
        },
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v15.2.0/gaiad-v15.2.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v15.2.0/gaiad-v15.2.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v15.2.0/gaiad-v15.2.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v15.2.0/gaiad-v15.2.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v15.2.0/gaiad-v15.2.0-darwin-amd64",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v15.2.0/gaiad-v15.2.0-windows-arm64.exe",
        },
        next_version_name: "v16",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.47.11",
        //   "tag": "v0.47.11-ics-lsm"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v7.4.0"
        // }
      },
      {
        name: "v16",
        tag: "v16.0.0",
        proposal: 914,
        height: 20440500,
        recommended_version: "v16.0.0",
        compatible_versions: ["v16.0.0"],
        cosmos_sdk_version: "v0.47.13-ics-lsm",
        ibc_go_version: "v7.4.0",
        consensus: {
          type: "cometbft",
          version: "v0.37.5",
        },
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v16.0.0/gaiad-v16.0.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v16.0.0/gaiad-v16.0.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v16.0.0/gaiad-v16.0.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v16.0.0/gaiad-v16.0.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v16.0.0/gaiad-v16.0.0-darwin-amd64",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v16.0.0/gaiad-v16.0.0-windows-arm64.exe",
        },
        next_version_name: "",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.47.13",
        //   "tag": "v0.47.13-ics-lsm"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v7.4.0"
        // }
      },
      {
        name: "v17",
        tag: "v17.3.0",
        proposal: 924,
        height: 20739800,
        recommended_version: "v17.3.0",
        compatible_versions: ["v17.3.0"],
        cosmos_sdk_version: "v0.47.15-ics-lsm",
        ibc_go_version: "v7.4.0",
        consensus: {
          type: "cometbft",
          version: "v0.37.6",
        },
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v17.3.0/gaiad-v17.3.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v17.3.0/gaiad-v17.3.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v17.3.0/gaiad-v17.3.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v17.3.0/gaiad-v17.3.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v17.3.0/gaiad-v17.3.0-darwin-amd64",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v17.3.0/gaiad-v17.3.0-windows-arm64.exe",
        },
        next_version_name: "v18",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.47.15",
        //   "tag": "v0.47.15-ics-lsm"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v7.4.0"
        // }
      },
      {
        name: "v18",
        tag: "v18.1.0",
        proposal: 937,
        height: 21330500,
        recommended_version: "v18.1.0",
        compatible_versions: ["v18.1.0"],
        cosmos_sdk_version: "v0.47.16-ics-lsm",
        ibc_go_version: "v7.6.0",
        consensus: {
          type: "cometbft",
          version: "v0.37.6",
        },
        cosmwasm_version: "informalsystems/wasmd v0.45.0-lsm",
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v18.1.0/gaiad-v18.1.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v18.1.0/gaiad-v18.1.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v18.1.0/gaiad-v18.1.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v18.1.0/gaiad-v18.1.0-darwin-arm64",
          "windows/amd64":
            "https://github.com/cosmos/gaia/releases/download/v18.1.0/gaiad-v18.1.0-darwin-amd64",
          "windows/arm64":
            "https://github.com/cosmos/gaia/releases/download/v18.1.0/gaiad-v18.1.0-windows-arm64.exe",
        },
        next_version_name: "v19",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.47.16",
        //   "tag": "v0.47.16-ics-lsm"
        // },
        // "cosmwasm": {
        //   "version": "v0.45.0",
        //   "repo": "https://github.com/informalsystems/wasmd",
        //   "tag": "v0.45.0-lsm"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v7.6.0"
        // }
      },
      {
        name: "v19",
        tag: "v19.2.0",
        proposal: 948,
        height: 21835200,
        recommended_version: "v19.2.0",
        compatible_versions: ["v19.2.0"],
        cosmos_sdk_version: "v0.50.9-lsm",
        ibc_go_version: "v8.4.0",
        consensus: {
          type: "cometbft",
          version: "v0.38.11",
        },
        cosmwasm_version: "v0.51.0",
        binaries: {
          "linux/amd64":
            "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-linux-amd64",
          "linux/arm64":
            "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-linux-arm64",
          "darwin/amd64":
            "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-darwin-amd64",
          "darwin/arm64":
            "https://github.com/cosmos/gaia/releases/download/v19.2.0/gaiad-v19.2.0-darwin-arm64",
        },
        next_version_name: "",
        // "sdk": {
        //   "type": "cosmos",
        //   "version": "v0.50.9",
        //   "tag": "v0.50.9-lsm"
        // },
        // "cosmwasm": {
        //   "version": "v0.51.0",
        //   "repo": "https://github.com/CosmWasm/wasmd",
        //   "tag": "v0.51.0"
        // },
        // "ibc": {
        //   "type": "go",
        //   "version": "v8.4.0"
        // }
      },
    ],
    // "sdk": {
    //   "type": "cosmos",
    //   "version": "v0.50.9",
    //   "tag": "v0.50.9-lsm"
    // },
    // "ibc": {
    //   "type": "go",
    //   "version": "v8.4.0"
    // },
    // "cosmwasm": {
    //   "version": "v0.51.0",
    //   "repo": "https://github.com/CosmWasm/wasmd",
    //   "tag": "v0.51.0"
    // }
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
    svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
  },
  description:
    "In a nutshell, Cosmos Hub bills itself as a project that solves some of the hardest problems facing the blockchain industry. It aims to offer an antidote to slow, expensive, unscalable and environmentally harmful proof-of-work protocols, like those used by Bitcoin, by offering an ecosystem of connected blockchains.\n\nThe project’s other goals include making blockchain technology less complex and difficult for developers thanks to a modular framework that demystifies decentralized apps. Last but not least, an Inter-blockchain Communication protocol makes it easier for blockchain networks to communicate with each other — preventing fragmentation in the industry.\n\nCosmos Hub's origins can be dated back to 2014, when Tendermint, a core contributor to the network, was founded. In 2016, a white paper for Cosmos was published — and a token sale was held the following year. ATOM tokens are earned through a hybrid proof-of-stake algorithm, and they help to keep the Cosmos Hub, the project’s flagship blockchain, secure. This cryptocurrency also has a role in the network’s governance.",
  peers: {
    seeds: [
      {
        id: "ba3bacc714817218562f743178228f23678b2873",
        address: "public-seed-node.cosmoshub.certus.one:26656",
        provider: "certusone",
      },
      {
        id: "ade4d8bc8cbe014af6ebdf3cb7b1e9ad36f412c0",
        address: "seeds.polkachu.com:14956",
        provider: "Polkachu",
      },
      {
        id: "20e1000e88125698264454a884812746c2eb4807",
        address: "seeds.lavenderfive.com:14956",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        id: "57a5297537b9b6ef8b105c08a8ad3f6ac452c423",
        address: "seeds.goldenratiostaking.net:1618",
        provider: "Golden Ratio Staking",
      },
      {
        id: "c28827cb96c14c905b127b92065a3fb4cd77d7f6",
        address: "seeds.whispernode.com:14956",
        provider: "WhisperNode 🤐",
      },
      {
        id: "8542cd7e6bf9d260fef543bc49e59be5a3fa9074",
        address: "seed.publicnode.com:26656",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        id: "400f3d9e30b69e78a7fb891f60d76fa3c73f0ecc",
        address: "cosmoshub.rpc.kjnodes.com:11359",
        provider: "kjnodes",
      },
      {
        id: "fe21dd474640247888fc7c4dce82da8da08a8bfd",
        address: "seed-cosmos-hub-01.stakeflow.io:26656",
        provider: "Stakeflow",
      },
      {
        id: "11c6114a18f7b380e536b0bd17c031f4746e4ded",
        address: "seed-node.mms.team:43656",
        provider: "MMS",
      },
      {
        id: "87ccc1dcc0b846fc1623ab9a5ab55682e8e2ad2e",
        address: "seed-cosmoshub.freshstaking.com:26656",
        provider: "FreshSTAKING",
      },
      {
        id: "b85358e035343a3b15e77e1102857dcdaf70053b",
        address: "seeds.bluestake.net:28156",
        provider: "BlueStake 🚀",
      },
    ],
    persistent_peers: [
      {
        id: "d6318b3bd51a5e2b8ed08f2e520d50289ed32bf1",
        address: "52.79.43.100:26656",
      },
      {
        id: "b0e746acb6fbed7a0311fe21cfb2ee94581ca3bc",
        address: "51.79.21.187:26656",
      },
      {
        id: "1da54d20c7339713f1d6d28dd2117087dd33d0ca",
        address: "cosmos-seed.icycro.org:26656",
        provider: "IcyCRO 🧊",
      },
      {
        id: "fe21dd474640247888fc7c4dce82da8da08a8bfd",
        address: "peer-cosmos-hub-01.stakeflow.io:26656",
        provider: "Stakeflow",
      },
      {
        id: "01c0d24922dcdf6f8816ec814a5c3436c5d5fbc5",
        address: "65.108.195.29:36656",
        provider: "Staketab",
      },
      {
        id: "28d36c3d45f0208528de3c38f2934ae241bd23e7",
        address: "peer-cosmoshub.mms.team:26656",
        provider: "MMS",
      },
      {
        id: "87ccc1dcc0b846fc1623ab9a5ab55682e8e2ad2e",
        address: "seed-cosmoshub.freshstaking.com:26656",
        provider: "FreshSTAKING",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://cosmos-rpc.quickapi.com:443",
        provider: "Chainlayer",
      },
      {
        address: "https://cosmos-rpc.onivalidator.com",
        provider: "Oni Validator ⛩️",
      },
      {
        address: "https://rpc-cosmoshub.whispernode.com:443",
        provider: "WhisperNode 🤐",
      },
      {
        address: "https://cosmoshub-rpc.lavenderfive.com:443",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        address: "https://rpc-cosmoshub.ecostake.com",
        provider: "ecostake",
      },
      {
        address: "https://go.getblock.io/17515cb3ec0e43b7817f182e5de6066a",
        provider: "GetBlock RPC Nodes",
      },
      {
        address: "https://rpc-cosmoshub.pupmos.network",
        provider: "PUPMØS",
      },
      {
        address: "https://rpc-cosmoshub.cosmos-spaces.cloud",
        provider: "Cosmos Spaces",
      },
      {
        address: "https://cosmos-rpc.polkachu.com",
        provider: "Polkachu",
      },
      {
        address: "https://cosmos-rpc.staketab.org:443",
        provider: "Staketab",
      },
      {
        address: "https://rpc-cosmoshub-ia.cosmosia.notional.ventures/",
        provider: "Notional",
      },
      {
        address: "https://rpc-cosmoshub.architectnodes.com",
        provider: "Architect Nodes",
      },
      {
        address: "https://rpc.cosmos.dragonstake.io",
        provider: "DragonStake",
      },
      {
        address: "https://cosmoshub.rpc.stakin-nodes.com",
        provider: "Stakin",
      },
      {
        address: "https://rpc.cosmos.bh.rocks",
        provider: "BlockHunters 🎯",
      },
      {
        address: "https://cosmos-rpc.rockrpc.net",
        provider: "RockawayX Infra",
      },
      {
        address: "http://rpc-cosmoshub.freshstaking.com:26657",
        provider: "FreshSTAKING",
      },
      {
        address: "https://cosmos-rpc.easy2stake.com/",
        provider: "Easy 2 Stake",
      },
      {
        address: "https://rpc.cosmos.nodestake.top",
        provider: "NodeStake",
      },
      {
        address: "https://cosmos.rpc.silknodes.io",
        provider: "Silk Nodes",
      },
      {
        address: "https://cosmos-rpc.publicnode.com:443",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        address: "https://cosmoshub.rpc.kjnodes.com",
        provider: "kjnodes",
      },
      {
        address: "https://rpc.cosmoshub.goldenratiostaking.net",
        provider: "Golden Ratio Staking",
      },
      {
        address: "https://rpc-cosmos-hub-01.stakeflow.io",
        provider: "Stakeflow",
      },
      {
        address: "https://cosmos-rpc.w3coins.io",
        provider: "w3coins",
      },
      {
        address: "https://rpc-cosmoshub.mms.team",
        provider: "MMS",
      },
      {
        address: "https://cosmos-rpc.tienthuattoan.com",
        provider: "TTT 🇻🇳",
      },
      {
        address: "https://community.nuxian-node.ch:6797/gaia/trpc",
        provider: "PRO Delegators",
      },
      {
        address: "https://cosmos-rpc.highstakes.ch",
        provider: "High Stakes 🇨🇭",
      },
      {
        address: "https://cosmoshub-rpc.cosmosrescue.dev",
        provider: "cosmosrescue",
      },
      {
        address: "https://cosmos.interstellar-lounge.org",
        provider: "Interstellar Lounge 🍸",
      },
      {
        address: "https://public.stakewolle.com/cosmos/cosmoshub/rpc",
        provider: "Stakewolle",
      },
      {
        address: "https://rpc-cosmos.kewrnode.com",
        provider: "Kewr Node",
      },
      {
        address: "https://rpc.cosmoshub-4.citizenweb3.com",
        provider: "Citizen Web3",
      },
      {
        address: "https://cosmos-rpc.stakeandrelax.net",
        provider: "Stake&Relax 🦥",
      },
      {
        address: "https://cosmos-hub.drpc.org",
        provider: "dRPC",
      },
    ],
    rest: [
      {
        address: "https://cosmos-lcd.quickapi.com:443",
        provider: "Chainlayer",
      },
      {
        address: "https://rest.cosmoshub.goldenratiostaking.net",
        provider: "Golden Ratio Staking",
      },
      {
        address: "https://cosmoshub-api.lavenderfive.com:443",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        address: "https://api-cosmoshub.pupmos.network",
        provider: "PUPMØS",
      },
      {
        address: "https://api-cosmoshub.cosmos-spaces.cloud",
        provider: "Cosmos Spaces",
      },
      {
        address: "https://api-cosmoshub-ia.cosmosia.notional.ventures/",
        provider: "Notional",
      },
      {
        address: "https://cosmos-rest.staketab.org",
        provider: "Staketab",
      },
      {
        address: "https://lcd.cosmos.dragonstake.io",
        provider: "DragonStake",
      },
      {
        address: "https://cosmoshub.rest.stakin-nodes.com",
        provider: "Stakin",
      },
      {
        address: "https://rest-cosmoshub.architectnodes.com",
        provider: "Architect Nodes",
      },
      {
        address: "https://rest-cosmoshub.ecostake.com",
        provider: "ecostake",
      },
      {
        address: "https://lcd-cosmoshub.whispernode.com:443",
        provider: "WhisperNode 🤐",
      },
      {
        address: "https://cosmos-lcd.easy2stake.com",
        provider: "Easy 2 Stake",
      },
      {
        address: "https://api.cosmos.nodestake.top",
        provider: "NodeStake",
      },
      {
        address: "https://cosmos.api.silknodes.io",
        provider: "Silk Nodes",
      },
      {
        address: "https://cosmos-rest.publicnode.com",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        address: "https://cosmoshub.api.kjnodes.com",
        provider: "kjnodes",
      },
      {
        address: "https://api-cosmos-hub-01.stakeflow.io",
        provider: "Stakeflow",
      },
      {
        address: "https://cosmos-api.w3coins.io",
        provider: "w3coins",
      },
      {
        address: "https://api-cosmoshub.mms.team",
        provider: "MMS",
      },
      {
        address: "https://cosmos-api.tienthuattoan.ventures",
        provider: "TienThuatToan",
      },
      {
        address: "https://community.nuxian-node.ch:6797/gaia/crpc",
        provider: "PRO Delegators",
      },
      {
        address: "https://cosmos-api.highstakes.ch",
        provider: "High Stakes 🇨🇭",
      },
      {
        address: "https://cosmoshub-api.cosmosrescue.dev",
        provider: "cosmosrescue",
      },
      {
        address: "https://cosmos-rest.interstellar-lounge.org",
        provider: "Interstellar Lounge 🍸",
      },
      {
        address: "https://public.stakewolle.com/cosmos/cosmoshub/rest",
        provider: "Stakewolle",
      },
      {
        address: "https://rest-cosmos.kewrnode.com",
        provider: "Kewr Node",
      },
      {
        address: "https://cosmos-api.stakeandrelax.net",
        provider: "Stake&Relax 🦥",
      },
    ],
    grpc: [
      {
        address: "cosmoshub-grpc.lavenderfive.com:443",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        address: "grpc-cosmoshub-ia.cosmosia.notional.ventures:443",
        provider: "Notional",
      },
      {
        address: "cosmos-grpc.polkachu.com:14990",
        provider: "Polkachu",
      },
      {
        address: "grpc.cosmos.interbloc.org:443",
        provider: "Interbloc",
      },
      {
        address: "services.staketab.com:9030",
        provider: "Staketab",
      },
      {
        address: "grpc.cosmos.dragonstake.io:443",
        provider: "DragonStake",
      },
      {
        address: "cosmoshub.grpc.stakin-nodes.com:443",
        provider: "Stakin",
      },
      {
        address: "https://grpc.cosmos.nodestake.top",
        provider: "NodeStake",
      },
      {
        address: "cosmos-grpc.publicnode.com:443",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        address: "grpc-cosmoshub.cosmos-spaces.cloud:3910",
        provider: "Cosmos Spaces",
      },
      {
        address: "cosmoshub.grpc.kjnodes.com:11390",
        provider: "kjnodes",
      },
      {
        address: "grpc-cosmos-hub-01.stakeflow.io:9090",
        provider: "Stakeflow",
      },
      {
        address: "grpc-cosmoshub.whispernode.com:443",
        provider: "WhisperNode 🤐",
      },
      {
        address: "cosmos-grpc.w3coins.io:14990",
        provider: "w3coins",
      },
      {
        address: "grpc-cosmoshub.mms.team:443",
        provider: "MMS",
      },
      {
        address: "cosmos-grpc.tienthuattoan.ventures:9090",
        provider: "TienThuatToan",
      },
      {
        address: "cosmoshub-mainnet.grpc.l0vd.com:80",
        provider: "L0vd.com ❤️",
      },
      {
        address: "https://grpc-cosmos.nodeist.net",
        provider: "Nodeist",
      },
      {
        address: "cosmos-grpc.stakeandrelax.net:15090",
        provider: "Stake&Relax 🦥",
      },
    ],
  },
  explorers: [
    {
      kind: "mintscan",
      url: "https://www.mintscan.io/cosmos",
      tx_page: "https://www.mintscan.io/cosmos/transactions/${txHash}",
      account_page: "https://www.mintscan.io/cosmos/accounts/${accountAddress}",
      // "validator_page": "https://www.mintscan.io/cosmos/validators/${validatorAddress}",
      // "proposal_page": "https://www.mintscan.io/cosmos/proposals/${proposalId}",
      // "block_page": "https://www.mintscan.io/cosmos/blocks/${blockHeight}"
    },
    {
      kind: "ezstaking",
      url: "https://ezstaking.app/cosmoshub",
      tx_page: "https://ezstaking.app/cosmoshub/txs/${txHash}",
      account_page: "https://ezstaking.app/cosmoshub/account/${accountAddress}",
      // "validator_page": "https://ezstaking.app/cosmoshub/validators/${validatorAddress}",
      // "proposal_page": "https://ezstaking.app/cosmoshub/proposals/${proposalId}",
      // "block_page": "https://ezstaking.app/cosmoshub/blocks/${blockHeight}"
    },
    {
      kind: "ping.pub",
      url: "https://ping.pub/cosmos",
      tx_page: "https://ping.pub/cosmos/tx/${txHash}",
      account_page: "https://ping.pub/cosmos/account/${accountAddress}",
      // "validator_page": "https://ping.pub/cosmos/staking/${validatorAddress}",
      // "proposal_page": "https://ping.pub/cosmos/gov/${proposalId}",
      // "block_page": "https://ping.pub/cosmos/block/${blockHeight}"
    },
    {
      kind: "atomscan",
      url: "https://atomscan.com",
      tx_page: "https://atomscan.com/transactions/${txHash}",
      account_page: "https://atomscan.com/accounts/${accountAddress}",
      // "validator_page": "https://atomscan.com/validators/${validatorAddress}",
      // "proposal_page": "https://atomscan.com/votes/${proposalId}",
      // "block_page": "https://atomscan.com/blocks/${blockHeight}"
    },
    {
      kind: "unichain",
      url: "https://unicha.in/cosmos",
      tx_page: "https://unicha.in/cosmos/transaction/${txHash}",
    },
    {
      kind: "TC Network",
      url: "https://explorer.tcnetwork.io/cosmoshub",
      tx_page: "https://explorer.tcnetwork.io/cosmoshub/transaction/${txHash}",
      account_page:
        "https://explorer.tcnetwork.io/cosmoshub/account/${accountAddress}",
      // "validator_page": "https://explorer.tcnetwork.io/cosmoshub/validator/${validatorAddress}",
      // "proposal_page": "https://explorer.tcnetwork.io/cosmoshub/proposal/${proposalId}",
      // "block_page": "https://explorer.tcnetwork.io/cosmoshub/block/${blockHeight}"
    },
    {
      kind: "Stakeflow",
      url: "https://stakeflow.io/cosmos",
      account_page: "https://stakeflow.io/cosmos/accounts/${accountAddress}",
      // "validator_page": "https://stakeflow.io/cosmos/validators/${validatorAddress}"
    },
    {
      kind: "Nodeist Explorer",
      url: "https://exp.nodeist.net/cosmos",
    },
    {
      kind: "Inbloc",
      url: "https://inbloc.org",
      tx_page: "https://inbloc.org/transactions/${txHash}",
      account_page: "https://inbloc.org/account/${accountAddress}",
      // "validator_page": "https://inbloc.org/cosmos/validator/${validatorAddress}",
      // "proposal_page": "https://inbloc.org/cosmos/proposal/${proposalId}",
      // "block_page": "https://inbloc.org/cosmos/blocks/${blockHeight}"
    },
    {
      kind: "WhisperNode 🤐",
      url: "https://mainnet.whispernode.com/cosmos",
      tx_page: "https://mainnet.whispernode.com/cosmos/tx/${txHash}",
      account_page:
        "https://mainnet.whispernode.com/cosmos/account/${accountAddress}",
      // "validator_page": "https://mainnet.whispernode.com/cosmos/staking/${validatorAddress}",
      // "proposal_page": "https://mainnet.whispernode.com/cosmos/gov/${proposalId}",
      // "block_page": "https://mainnet.whispernode.com/cosmos/block/${blockHeight}"
    },
  ],
  images: [
    {
      png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
      svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
      theme: {
        primary_color_hex: "#272d45",
      },
    },
  ],
} as any

export const neutronChain = {
  $schema: "../chain.schema.json",
  chain_name: "neutron",
  status: "live",
  network_type: "mainnet",
  pretty_name: "Neutron",
  chain_type: "cosmos",
  chain_id: "neutron-1",
  bech32_prefix: "neutron",
  website: "https://neutron.org/",
  daemon_name: "neutrond",
  node_home: "$HOME/.neutrond",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "untrn",
        low_gas_price: 0.0053,
        average_gas_price: 0.0053,
        high_gas_price: 0.0053,
      },
      {
        denom:
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
        low_gas_price: 0.0008,
        average_gas_price: 0.0008,
        high_gas_price: 0.0008,
      },
      {
        denom:
          "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
        low_gas_price: 0.008,
        average_gas_price: 0.008,
        high_gas_price: 0.008,
      },
      {
        denom:
          "factory/neutron1ug740qrkquxzrk2hh29qrlx3sktkfml3je7juusc2te7xmvsscns0n2wry/wstETH",
        low_gas_price: 2903231.6597,
        average_gas_price: 2903231.6597,
        high_gas_price: 2903231.6597,
      },
      {
        denom:
          "ibc/2CB87BCE0937B1D1DFCEE79BE4501AAF3C265E923509AEAC410AD85D27F35130",
        low_gas_price: 2564102564.1026,
        average_gas_price: 2564102564.1026,
        high_gas_price: 2564102564.1026,
      },
      {
        denom:
          "ibc/773B4D0A3CD667B2275D5A4A7A2F0909C0BA0F4059C0B9181E680DDF4965DCC7",
        low_gas_price: 0.0004,
        average_gas_price: 0.0004,
        high_gas_price: 0.0004,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "untrn",
      },
    ],
  },
  // "codebase": {
  //   "git_repo": "https://github.com/neutron-org/neutron",
  //   "recommended_version": "v4.2.0",
  //   "compatible_versions": [
  //     "v4.2.0"
  //   ],
  //   "binaries": {
  //     "linux/amd64": "https://github.com/neutron-org/neutron/releases/download/v4.2.0/neutrond-linux-amd64"
  //   },
  //   "cosmos_sdk_version": "neutron-org/cosmos-sdk v0.50.7-neutron",
  //   "consensus": {
  //     "type": "cometbft",
  //     "version": "v0.38.7"
  //   },
  //   "cosmwasm_version": "neutron-org/wasmd v0.51.0",
  //   "cosmwasm_enabled": true,
  //   "ibc_go_version": "v8.2.1",
  //   "genesis": {
  //     "genesis_url": "https://raw.githubusercontent.com/neutron-org/mainnet-assets/main/neutron-1-genesis.json"
  //   },
  //   "versions": [
  //     {
  //       "name": "v1.0.1",
  //       "recommended_version": "v1.0.4",
  //       "compatible_versions": [
  //         "v1.0.3",
  //         "v1.0.4"
  //       ],
  //       "cosmos_sdk_version": "0.45",
  //       "consensus": {
  //         "type": "tendermint",
  //         "version": "0.34"
  //       },
  //       "cosmwasm_version": "0.31",
  //       "cosmwasm_enabled": true,
  //       "ibc_go_version": "4.3.0",
  //       "next_version_name": "v2.0.0",
  //       "sdk": {
  //         "type": "cosmos",
  //         "version": "0.45"
  //       },
  //       "cosmwasm": {
  //         "version": "0.31",
  //         "enabled": true
  //       },
  //       "ibc": {
  //         "type": "go",
  //         "version": "4.3.0"
  //       }
  //     },
  //     {
  //       "name": "v2.0.0",
  //       "proposal": 25,
  //       "height": 5416000,
  //       "recommended_version": "v2.0.4",
  //       "compatible_versions": [
  //         "v2.0.4"
  //       ],
  //       "binaries": {
  //         "linux/amd64": "https://github.com/neutron-org/neutron/releases/download/v2.0.4/neutrond-linux-amd64"
  //       },
  //       "cosmos_sdk_version": "v0.47.6",
  //       "consensus": {
  //         "type": "cometbft",
  //         "version": "v0.37.2"
  //       },
  //       "cosmwasm_version": "v0.45.0",
  //       "cosmwasm_enabled": true,
  //       "ibc_go_version": "v7.3.1",
  //       "next_version_name": "v3.0.1",
  //       "sdk": {
  //         "type": "cosmos",
  //         "version": "v0.47.6"
  //       },
  //       "cosmwasm": {
  //         "version": "v0.45.0",
  //         "enabled": true
  //       },
  //       "ibc": {
  //         "type": "go",
  //         "version": "v7.3.1"
  //       }
  //     },
  //     {
  //       "name": "v3.0.1",
  //       "proposal": 35,
  //       "height": 9034900,
  //       "recommended_version": "v3.0.2",
  //       "compatible_versions": [
  //         "v3.0.2"
  //       ],
  //       "binaries": {
  //         "linux/amd64": "https://github.com/neutron-org/neutron/releases/download/v3.0.2/neutrond-linux-amd64"
  //       },
  //       "cosmos_sdk_version": "neutron-org/cosmos-sdk v0.47.10-neutron",
  //       "consensus": {
  //         "type": "cometbft",
  //         "version": "v0.37.4"
  //       },
  //       "cosmwasm_version": "neutron-org/wasmd v0.45.0",
  //       "cosmwasm_enabled": true,
  //       "ibc_go_version": "v7.3.2",
  //       "next_version_name": "v3.0.5",
  //       "sdk": {
  //         "type": "cosmos",
  //         "repo": "https://github.com/neutron-org/cosmos-sdk",
  //         "version": "v0.47.10",
  //         "tag": "v0.47.10-neutron"
  //       },
  //       "cosmwasm": {
  //         "version": "v0.45.0",
  //         "repo": "https://github.com/neutron-org/wasmd",
  //         "enabled": true
  //       },
  //       "ibc": {
  //         "type": "go",
  //         "version": "v7.3.2"
  //       }
  //     },
  //     {
  //       "name": "v3.0.5",
  //       "proposal": 37,
  //       "height": 10525000,
  //       "recommended_version": "v3.0.6",
  //       "compatible_versions": [
  //         "v3.0.6"
  //       ],
  //       "binaries": {
  //         "linux/amd64": "https://github.com/neutron-org/neutron/releases/download/v3.0.6/neutrond-linux-amd64"
  //       },
  //       "cosmos_sdk_version": "neutron-org/cosmos-sdk v0.47.10-neutron",
  //       "consensus": {
  //         "type": "cometbft",
  //         "version": "v0.37.4"
  //       },
  //       "cosmwasm_version": "neutron-org/wasmd v0.45.0",
  //       "cosmwasm_enabled": true,
  //       "ibc_go_version": "v7.4.0",
  //       "next_version_name": "v4.0.1",
  //       "sdk": {
  //         "type": "cosmos",
  //         "repo": "https://github.com/neutron-org/cosmos-sdk",
  //         "version": "v0.47.10",
  //         "tag": "v0.47.10-neutron"
  //       },
  //       "cosmwasm": {
  //         "version": "v0.45.0",
  //         "repo": "https://github.com/neutron-org/wasmd",
  //         "enabled": true
  //       },
  //       "ibc": {
  //         "type": "go",
  //         "version": "v7.4.0"
  //       }
  //     },
  //     {
  //       "name": "v4.0.1",
  //       "proposal": 41,
  //       "height": 12255555,
  //       "recommended_version": "v4.2.0",
  //       "compatible_versions": [
  //         "v4.2.0"
  //       ],
  //       "binaries": {
  //         "linux/amd64": "https://github.com/neutron-org/neutron/releases/download/v4.2.0/neutrond-linux-amd64"
  //       },
  //       "cosmos_sdk_version": "neutron-org/cosmos-sdk v0.50.7-neutron",
  //       "consensus": {
  //         "type": "cometbft",
  //         "version": "v0.38.7"
  //       },
  //       "cosmwasm_version": "neutron-org/wasmd v0.51.0",
  //       "cosmwasm_enabled": true,
  //       "ibc_go_version": "v8.2.1",
  //       "next_version_name": "",
  //       "sdk": {
  //         "type": "cosmos",
  //         "repo": "https://github.com/neutron-org/cosmos-sdk",
  //         "version": "v0.50.7",
  //         "tag": "v0.50.7-neutron"
  //       },
  //       "cosmwasm": {
  //         "version": "v0.51.0",
  //         "repo": "https://github.com/neutron-org/wasmd",
  //         "enabled": true
  //       },
  //       "ibc": {
  //         "type": "go",
  //         "version": "v8.2.1"
  //       }
  //     }
  //   ],
  //   "sdk": {
  //     "type": "cosmos",
  //     "repo": "https://github.com/neutron-org/cosmos-sdk",
  //     "version": "v0.50.7",
  //     "tag": "v0.50.7-neutron"
  //   },
  //   "ibc": {
  //     "type": "go",
  //     "version": "v8.2.1"
  //   },
  //   "cosmwasm": {
  //     "version": "v0.51.0",
  //     "repo": "https://github.com/neutron-org/wasmd",
  //     "enabled": true
  //   }
  // },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.png",
    svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.svg",
  },
  description:
    "The most secure CosmWasm platform in Cosmos, Neutron lets smart-contracts leverage bleeding-edge Interchain technology with minimal overhead.",
  peers: {
    seeds: [
      {
        id: "74f3a4a0423e72334f4439b438b29934e5f0dbbd",
        address: "p2p-xyphion.neutron-1.neutron.org:26656",
        provider: "Neutron",
      },
      {
        id: "65beeffac5c0f29e6c3749687f03b2040d265895",
        address: "p2p-talzor.neutron-1.neutron.org:26656",
        provider: "Neutron",
      },
      {
        id: "20e1000e88125698264454a884812746c2eb4807",
        address: "seeds.lavenderfive.com:19156",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        id: "c28827cb96c14c905b127b92065a3fb4cd77d7f6",
        address: "seeds.whispernode.com:19156",
        provider: "WhisperNode 🤐",
      },
      {
        id: "8542cd7e6bf9d260fef543bc49e59be5a3fa9074",
        address: "seed.publicnode.com:26656",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
    ],
    persistent_peers: [
      {
        id: "e5d2743d9a3de514e4f7b9461bf3f0c1500c58d9",
        address: "neutron.peer.stakewith.us:39956",
        provider: "StakeWithUs",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://rpc.novel.remedy.tm.p2p.org",
        provider: "P2P",
      },
      {
        address: "https://neutron-rpc.lavenderfive.com",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        address: "https://rpc-neutron.whispernode.com",
        provider: "WhisperNode 🤐",
      },
      {
        address: "https://rpc-neutron.cosmos-spaces.cloud",
        provider: "Cosmos Spaces",
      },
      {
        address: "http://rpc.neutron.nodestake.top",
        provider: "NodeStake",
      },
      {
        address: "https://neutron-rpc.publicnode.com:443",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        address: "https://community.nuxian-node.ch:6797/neutron/trpc",
        provider: "PRO Delegators",
      },
      {
        address: "https://rpc.neutron.bronbro.io:443",
        provider: "Bro_n_Bro",
      },
      {
        address: "https://rpc.neutron.quokkastake.io",
        provider: "🐹 Quokka Stake",
      },
      {
        address: "https://neutron.drpc.org",
        provider: "dRPC",
      },
    ],
    rest: [
      {
        address: "https://api.novel.remedy.tm.p2p.org",
        provider: "P2P",
      },
      {
        address: "https://neutron-api.lavenderfive.com",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        address: "https://lcd-neutron.whispernode.com",
        provider: "WhisperNode 🤐",
      },
      {
        address: "https://api-neutron.cosmos-spaces.cloud",
        provider: "Cosmos Spaces",
      },
      {
        address: "http://api.neutron.nodestake.top",
        provider: "NodeStake",
      },
      {
        address: "https://neutron-rest.publicnode.com",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        address: "https://community.nuxian-node.ch:6797/neutron/crpc",
        provider: "PRO Delegators",
      },
      {
        address: "https://lcd.neutron.bronbro.io:443",
        provider: "Bro_n_Bro",
      },
      {
        address: "https://api.neutron.quokkastake.io",
        provider: "🐹 Quokka Stake",
      },
    ],
    grpc: [
      {
        address: "grpc-kralum.neutron-1.neutron.org:80",
        provider: "Neutron",
      },
      {
        address: "neutron-grpc-pub.rpc.p2p.world:3001",
        provider: "P2P",
      },
      {
        address: "neutron-grpc.lavenderfive.com:443",
        provider: "Lavender.Five Nodes 🐝",
      },
      {
        address: "grpc-neutron.whispernode.com:443",
        provider: "WhisperNode 🤐",
      },
      {
        address: "grpc-neutron.cosmos-spaces.cloud:3090",
        provider: "Cosmos Spaces",
      },
      {
        address: "grpc.neutron.nodestake.top:9090",
        provider: "NodeStake",
      },
      {
        address: "neutron-grpc.publicnode.com:443",
        provider: "Allnodes ⚡️ Nodes & Staking",
      },
      {
        address: "https://grpc.neutron.bronbro.io:443",
        provider: "Bro_n_Bro",
      },
      {
        address: "rpc.neutron.quokkastake.io:9090",
        provider: "🐹 Quokka Stake",
      },
    ],
  },
  explorers: [
    {
      kind: "Mintscan",
      url: "https://www.mintscan.io/neutron",
      tx_page: "https://www.mintscan.io/neutron/transactions/${txHash}",
      account_page:
        "https://www.mintscan.io/neutron/accounts/${accountAddress}",
    },
    {
      kind: "ezstaking",
      url: "https://ezstaking.app/neutron",
      tx_page: "https://ezstaking.app/neutron/txs/${txHash}",
      account_page: "https://ezstaking.app/neutron/account/${accountAddress}",
    },
    {
      kind: "WhisperNode 🤐",
      url: "https://mainnet.whispernode.com/neutron",
      tx_page: "https://mainnet.whispernode.com/neutron/tx/${txHash}",
      account_page:
        "https://mainnet.whispernode.com/neutron/account/${accountAddress}",
    },
  ],
  images: [
    {
      png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.png",
      svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-raw.svg",
      theme: {
        primary_color_hex: "#000000",
        background_color_hex: "#00000000",
        circle: false,
      },
    },
    {
      png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png",
      svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.svg",
      theme: {
        primary_color_hex: "#040404",
        background_color_hex: "#000000",
        circle: true,
      },
    },
    {
      png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.png",
      svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.svg",
    },
  ],
} as any

export const NEUTRON_ASSETS = {
  $schema: "../assetlist.schema.json",
  chain_name: "neutron",
  assets: [
    {
      description:
        "Neutron is a smart contract blockchain within the Cosmos ecosystem, leveraging the Cosmos Hub's security to provide cross-chain DeFi applications.",
      extended_description:
        "Neutron is a blockchain network designed to bring smart contracts to the Cosmos ecosystem using CosmWasm. It leverages Interchain Security to rely on the Cosmos Hub's validator set, enhancing its security without needing its own validators. This allows Neutron to provide robust, cross-chain smart contract applications across more than 50 interconnected blockchains. Neutron's focus on interchain queries and transactions enables secure data retrieval and transaction execution across multiple chains, fostering the development of complex and decentralized applications within the Cosmos network.",
      denom_units: [
        {
          denom: "untrn",
          exponent: 0,
        },
        {
          denom: "ntrn",
          exponent: 6,
        },
      ],
      base: "untrn",
      name: "Neutron",
      display: "ntrn",
      symbol: "NTRN",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.svg",
      },
      coingecko_id: "neutron-3",
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ntrn.svg",
          theme: {
            primary_color_hex: "#040404",
            background_color_hex: "#000000",
            circle: true,
          },
        },
      ],
      socials: {
        website: "https://neutron.org/",
        twitter: "https://twitter.com/Neutron_org",
      },
    },
    {
      description: "IBC uatom through cosmoshub-4 transfer/channel-1",
      denom_units: [
        {
          denom:
            "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
          exponent: 0,
          aliases: ["uatom"],
        },
        {
          denom: "atom",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
      name: "IBC atom",
      display: "atom",
      symbol: "ATOM",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "cosmoshub",
            base_denom: "uatom",
            channel_id: "channel-569",
          },
          chain: {
            channel_id: "channel-1",
            path: "transfer/channel-1/uatom",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "cosmoshub",
            base_denom: "uatom",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
          theme: {
            primary_color_hex: "#272d45",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.svg",
      },
    },
    {
      description: "IBC Axelar uusdc through axelar-dojo-1 transfer/channel-2",
      denom_units: [
        {
          denom:
            "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
          exponent: 0,
          aliases: ["uusdc"],
        },
        {
          denom: "axlusdc",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
      name: "USD Coin (Axelar)",
      display: "axlusdc",
      symbol: "axlUSDC",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "axelar",
            base_denom: "uusdc",
            channel_id: "channel-78",
          },
          chain: {
            channel_id: "channel-2",
            path: "transfer/channel-2/uusdc",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "axelar",
            base_denom: "uusdc",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.svg",
          theme: {
            primary_color_hex: "#2474cc",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.svg",
      },
    },
    {
      description: "Tia on Neutron",
      denom_units: [
        {
          denom:
            "ibc/773B4D0A3CD667B2275D5A4A7A2F0909C0BA0F4059C0B9181E680DDF4965DCC7",
          exponent: 0,
          aliases: ["utia"],
        },
        {
          denom: "tia",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/773B4D0A3CD667B2275D5A4A7A2F0909C0BA0F4059C0B9181E680DDF4965DCC7",
      name: "Celestia TIA",
      display: "tia",
      symbol: "TIA",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "celestia",
            base_denom: "utia",
            channel_id: "channel-8",
          },
          chain: {
            channel_id: "channel-35",
            path: "transfer/channel-35/utia",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "celestia",
            base_denom: "utia",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.svg",
          theme: {
            primary_color_hex: "#7c2cfb",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.svg",
      },
    },
    {
      description: "Astropepe meme coin",
      denom_units: [
        {
          denom:
            "factory/neutron14henrqx9y328fjrdvz6l6d92r0t7g5hk86q5nd/uastropepe",
          exponent: 0,
        },
        {
          denom: "ASTROPEPE",
          exponent: 6,
        },
      ],
      base: "factory/neutron14henrqx9y328fjrdvz6l6d92r0t7g5hk86q5nd/uastropepe",
      name: "AstroPepe",
      display: "ASTROPEPE",
      symbol: "ASTROPEPE",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/astropepe.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/astropepe.png",
          theme: {
            primary_color_hex: "#47391d",
          },
        },
      ],
    },
    {
      description: "wstETH on Neutron",
      denom_units: [
        {
          denom:
            "factory/neutron1ug740qrkquxzrk2hh29qrlx3sktkfml3je7juusc2te7xmvsscns0n2wry/wstETH",
          exponent: 0,
        },
        {
          denom: "wstETH",
          exponent: 18,
        },
      ],
      base: "factory/neutron1ug740qrkquxzrk2hh29qrlx3sktkfml3je7juusc2te7xmvsscns0n2wry/wstETH",
      name: "wstETH",
      display: "wstETH",
      symbol: "wstETH",
      traces: [
        {
          type: "bridge",
          counterparty: {
            chain_name: "ethereum",
            base_denom: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
          },
          provider: "Lido wstETH Cosmos Bridge",
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "ethereum",
            base_denom: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
          },
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/wsteth.svg",
        },
      ],
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/wsteth.svg",
      },
    },
    {
      description: "NBTC on Neutron",
      denom_units: [
        {
          denom:
            "ibc/DDC3C60EE82BF544F1A0C6A983FF500EF1C14DE20071A5E1E7C0FB470E36E920",
          exponent: 0,
          aliases: ["usat"],
        },
        {
          denom: "sat",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/DDC3C60EE82BF544F1A0C6A983FF500EF1C14DE20071A5E1E7C0FB470E36E920",
      name: "Nomic NBTC",
      display: "sat",
      symbol: "SAT",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "nomic",
            base_denom: "usat",
            channel_id: "channel-2",
          },
          chain: {
            channel_id: "channel-42",
            path: "transfer/channel-42/usat",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "nomic",
            base_denom: "usat",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nomic/images/nbtc.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nomic/images/nbtc.svg",
          theme: {
            primary_color_hex: "#8436e6",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nomic/images/nbtc.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nomic/images/nbtc.svg",
      },
    },
    {
      description: "DYDX on Neutron",
      denom_units: [
        {
          denom:
            "ibc/2CB87BCE0937B1D1DFCEE79BE4501AAF3C265E923509AEAC410AD85D27F35130",
          exponent: 0,
          aliases: ["adydx"],
        },
        {
          denom: "dydx",
          exponent: 18,
        },
      ],
      type_asset: "ics20",
      base: "ibc/2CB87BCE0937B1D1DFCEE79BE4501AAF3C265E923509AEAC410AD85D27F35130",
      name: "DYDX",
      display: "dydx",
      symbol: "DYDX",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "dydx",
            base_denom: "adydx",
            channel_id: "channel-11",
          },
          chain: {
            channel_id: "channel-48",
            path: "transfer/channel-48/adydx",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "dydx",
            base_denom: "adydx",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.svg",
          theme: {
            primary_color_hex: "#21212f",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.svg",
      },
    },
    {
      description: "The cutest NEWT token on Neutron chain.",
      denom_units: [
        {
          denom: "factory/neutron1p8d89wvxyjcnawmgw72klknr3lg9gwwl6ypxda/newt",
          exponent: 0,
          aliases: ["unewt"],
        },
        {
          denom: "newt",
          exponent: 6,
        },
      ],
      base: "factory/neutron1p8d89wvxyjcnawmgw72klknr3lg9gwwl6ypxda/newt",
      name: "Newt",
      display: "newt",
      symbol: "NEWT",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/newt.png",
      },
      coingecko_id: "newt",
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/newt.png",
          theme: {
            primary_color_hex: "#16233d",
          },
        },
      ],
    },
    {
      description:
        "Astroport is a neutral marketplace where anyone, from anywhere in the galaxy, can dock to trade their wares.",
      denom_units: [
        {
          denom:
            "factory/neutron1ffus553eet978k024lmssw0czsxwr97mggyv85lpcsdkft8v9ufsz3sa07/astro",
          exponent: 0,
          aliases: ["uastro"],
        },
        {
          denom: "astro",
          exponent: 6,
        },
      ],
      base: "factory/neutron1ffus553eet978k024lmssw0czsxwr97mggyv85lpcsdkft8v9ufsz3sa07/astro",
      name: "Astroport token",
      display: "astro",
      symbol: "ASTRO",
      coingecko_id: "astroport-fi",
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/astro.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/astro.svg",
          theme: {
            primary_color_hex: "#4056e9",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/astro.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/astro.svg",
      },
      socials: {
        website: "https://astroport.fi/",
        twitter: "https://twitter.com/astroport_fi",
      },
    },
    {
      description:
        "Astroport is a neutral marketplace where anyone, from anywhere in the galaxy, can dock to trade their wares.",
      denom_units: [
        {
          denom:
            "factory/neutron1zlf3hutsa4qnmue53lz2tfxrutp8y2e3rj4nkghg3rupgl4mqy8s5jgxsn/xASTRO",
          exponent: 0,
          aliases: ["uxastro"],
        },
        {
          denom: "xASTRO",
          exponent: 6,
        },
      ],
      base: "factory/neutron1zlf3hutsa4qnmue53lz2tfxrutp8y2e3rj4nkghg3rupgl4mqy8s5jgxsn/xASTRO",
      name: "Staked Astroport Token",
      display: "xASTRO",
      symbol: "xASTRO",
      traces: [
        {
          type: "liquid-stake",
          counterparty: {
            chain_name: "neutron",
            base_denom:
              "factory/neutron1ffus553eet978k024lmssw0czsxwr97mggyv85lpcsdkft8v9ufsz3sa07/astro",
          },
          provider: "Astroport",
        },
      ],
      images: [
        {
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/xAstro.svg",
        },
      ],
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/xAstro.svg",
      },
      socials: {
        website: "https://astroport.fi/",
        twitter: "https://twitter.com/astroport_fi",
      },
    },
    {
      description: "ASTRO.cw20 on Neutron",
      denom_units: [
        {
          denom:
            "ibc/5751B8BCDA688FD0A8EC0B292EEF1CDEAB4B766B63EC632778B196D317C40C3A",
          exponent: 0,
          aliases: ["uastro"],
        },
        {
          denom: "astro.cw20",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/5751B8BCDA688FD0A8EC0B292EEF1CDEAB4B766B63EC632778B196D317C40C3A",
      name: "Astroport CW20 token",
      display: "astro.cw20",
      symbol: "ASTRO.cw20",
      traces: [
        {
          type: "ibc-cw20",
          counterparty: {
            chain_name: "terra2",
            base_denom:
              "cw20:terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
            channel_id: "channel-167",
            port: "wasm.terra1jhfjnm39y3nn9l4520mdn4k5mw23nz0674c4gsvyrcr90z9tqcvst22fce",
          },
          chain: {
            channel_id: "channel-5",
            path: "transfer/channel-5/cw20:terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
            port: "transfer",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "terra2",
            base_denom:
              "cw20:terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
          },
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/astro-cw20.svg",
        },
      ],
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/terra2/images/astro-cw20.svg",
      },
    },
    {
      description: "Baby Corgi is the real doggo of Neutron!",
      denom_units: [
        {
          denom: "factory/neutron1tklm6cvr2wxg8k65t8gh5ewslnzdfd5fsk0w3f/corgi",
          exponent: 0,
          aliases: ["ucorgi"],
        },
        {
          denom: "corgi",
          exponent: 6,
        },
      ],
      base: "factory/neutron1tklm6cvr2wxg8k65t8gh5ewslnzdfd5fsk0w3f/corgi",
      name: "Baby Corgi",
      display: "corgi",
      symbol: "CORGI",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/babycorgi.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/babycorgi.png",
          theme: {
            primary_color_hex: "#fab442",
          },
        },
      ],
    },
    {
      description: "clownmaxxed store of value",
      denom_units: [
        {
          denom:
            "factory/neutron170v88vrtnedesyfytuku257cggxc79rd7lwt7q/ucircus",
          exponent: 0,
          aliases: ["ucircus"],
        },
        {
          denom: "circus",
          exponent: 6,
        },
      ],
      base: "factory/neutron170v88vrtnedesyfytuku257cggxc79rd7lwt7q/ucircus",
      name: "AtomEconomicZone69JaeKwonInu",
      display: "circus",
      symbol: "CIRCUS",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/circus.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/circus.png",
          theme: {
            primary_color_hex: "#242033",
          },
        },
      ],
    },
    {
      description: "Jimmy Neutron Finance",
      denom_units: [
        {
          denom: "factory/neutron108x7vp9zv22d6wxrs9as8dshd3pd5vsga463yd/JIMMY",
          exponent: 0,
          aliases: ["ujimmy"],
        },
        {
          denom: "jimmy",
          exponent: 6,
        },
      ],
      base: "factory/neutron108x7vp9zv22d6wxrs9as8dshd3pd5vsga463yd/JIMMY",
      name: "jimmy",
      display: "jimmy",
      symbol: "JIMMY",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/jimmy.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/jimmy.png",
          theme: {
            primary_color_hex: "#7d3c20",
          },
        },
      ],
    },
    {
      description: "Baddest coin on Cosmos",
      denom_units: [
        {
          denom: "factory/neutron143wp6g8paqasnuuey6zyapucknwy9rhnld8hkr/bad",
          exponent: 0,
          aliases: ["ubad"],
        },
        {
          denom: "bad",
          exponent: 6,
        },
      ],
      base: "factory/neutron143wp6g8paqasnuuey6zyapucknwy9rhnld8hkr/bad",
      name: "Badcoin",
      display: "bad",
      symbol: "BAD",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/bad.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/bad.png",
          theme: {
            primary_color_hex: "#211a0d",
          },
        },
      ],
    },
    {
      description: "BITCOSMOS",
      denom_units: [
        {
          denom:
            "neutron1fjzg7fmv770hsvahqm0nwnu6grs3rjnd2wa6fvm9unv6vedkzekqpw44qj",
          exponent: 0,
          aliases: ["ubitcosmos"],
        },
        {
          denom: "bitcosmos",
          exponent: 6,
        },
      ],
      base: "neutron1fjzg7fmv770hsvahqm0nwnu6grs3rjnd2wa6fvm9unv6vedkzekqpw44qj",
      name: "Bitcosmos",
      display: "bitcosmos",
      symbol: "BTC",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/bitcosmos.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/bitcosmos.png",
          theme: {
            primary_color_hex: "#1b0847",
          },
        },
      ],
    },
    {
      description: "What the Fuck",
      denom_units: [
        {
          denom:
            "neutron12h09p8hq5y4xpsmcuxxzsn9juef4f6jvekp8yefc6xnlwm6uumnsdk29wf",
          exponent: 0,
          aliases: ["uwtf"],
        },
        {
          denom: "wtf",
          exponent: 6,
        },
      ],
      base: "neutron12h09p8hq5y4xpsmcuxxzsn9juef4f6jvekp8yefc6xnlwm6uumnsdk29wf",
      name: "wtf",
      display: "wtf",
      symbol: "WTF",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/WTF.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/WTF.png",
          theme: {
            primary_color_hex: "#dcd5ab",
          },
        },
      ],
    },
    {
      description: "NLS on Neutron",
      denom_units: [
        {
          denom:
            "ibc/6C9E6701AC217C0FC7D74B0F7A6265B9B4E3C3CDA6E80AADE5F950A8F52F9972",
          exponent: 0,
          aliases: ["unls"],
        },
        {
          denom: "nls",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/6C9E6701AC217C0FC7D74B0F7A6265B9B4E3C3CDA6E80AADE5F950A8F52F9972",
      name: "Nolus NLS",
      display: "nls",
      symbol: "NLS",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "nolus",
            base_denom: "unls",
            channel_id: "channel-3839",
          },
          chain: {
            channel_id: "channel-44",
            path: "transfer/channel-44/unls",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "nolus",
            base_denom: "unls",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nolus/images/nolus.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nolus/images/nolus.svg",
          theme: {
            primary_color_hex: "#fc542c",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nolus/images/nolus.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/nolus/images/nolus.svg",
      },
    },
    {
      description: "A Mechanical Canine",
      denom_units: [
        {
          denom:
            "factory/neutron1t5qrjtyryh8gzt800qr5vylhh2f8cmx4wmz9mc/ugoddard",
          exponent: 0,
          aliases: ["ugoddard"],
        },
        {
          denom: "goddard",
          exponent: 6,
        },
      ],
      base: "factory/neutron1t5qrjtyryh8gzt800qr5vylhh2f8cmx4wmz9mc/ugoddard",
      name: "Goddard",
      display: "goddard",
      symbol: "GODRD",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/goddardntrn.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/goddardntrn.png",
          theme: {
            primary_color_hex: "#516b80",
          },
        },
      ],
    },
    {
      description: "The deflationary utility token of the Apollo DAO project",
      denom_units: [
        {
          denom:
            "factory/neutron154gg0wtm2v4h9ur8xg32ep64e8ef0g5twlsgvfeajqwghdryvyqsqhgk8e/APOLLO",
          exponent: 0,
          aliases: ["uapollo"],
        },
        {
          denom: "apollo",
          exponent: 6,
        },
      ],
      base: "factory/neutron154gg0wtm2v4h9ur8xg32ep64e8ef0g5twlsgvfeajqwghdryvyqsqhgk8e/APOLLO",
      name: "Apollo DAO",
      display: "apollo",
      symbol: "APOLLO",
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/apollo.svg",
      },
      images: [
        {
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/apollo.svg",
        },
      ],
      socials: {
        website: "https://apollo.farm/",
        twitter: "https://twitter.com/ApolloDAO",
      },
    },
    {
      description: "NEWTROLL",
      denom_units: [
        {
          denom:
            "factory/neutron1ume2n42r5j0660gegrr28fzdze7aqf7r5cd9y6/newtroll",
          exponent: 0,
          aliases: ["unewtroll"],
        },
        {
          denom: "newtroll",
          exponent: 6,
        },
      ],
      base: "factory/neutron1ume2n42r5j0660gegrr28fzdze7aqf7r5cd9y6/newtroll",
      name: "Newtroll",
      display: "newtroll",
      symbol: "NTRL",
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/newtroll.svg",
      },
      images: [
        {
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/newtroll.svg",
        },
      ],
    },
    {
      description: "Retro Game",
      denom_units: [
        {
          denom:
            "factory/neutron1t24nc7whl77relnu3taxyg3p66pjyuk82png2y/uretro",
          exponent: 0,
          aliases: ["uretro"],
        },
        {
          denom: "retro",
          exponent: 6,
        },
      ],
      base: "factory/neutron1t24nc7whl77relnu3taxyg3p66pjyuk82png2y/uretro",
      name: "Retro",
      display: "retro",
      symbol: "RETRO",
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/retro.svg",
      },
      images: [
        {
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/retro.svg",
        },
      ],
    },
    {
      description: "THE FIRST NATIVE GODDARD MEMECOIN ON NEUTRON",
      denom_units: [
        {
          denom:
            "factory/neutron1yqj9vcc0y73xfxjzegaj4v8q0zefevnlpuh4rj/GODDARD",
          exponent: 0,
          aliases: ["ugoddard"],
        },
        {
          denom: "goddard",
          exponent: 6,
        },
      ],
      base: "factory/neutron1yqj9vcc0y73xfxjzegaj4v8q0zefevnlpuh4rj/GODDARD",
      name: "Goddard",
      display: "goddard",
      symbol: "GODDARD",
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/goddard.svg",
      },
      images: [
        {
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/goddard.svg",
        },
      ],
    },
    {
      description: "The first memecoin on osmosis.",
      denom_units: [
        {
          denom:
            "ibc/7DA39F5140741177846FCF3CFAB14450EE7F57B7794E5A94BEF73825D3741958",
          exponent: 0,
        },
        {
          denom: "WOSMO",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/7DA39F5140741177846FCF3CFAB14450EE7F57B7794E5A94BEF73825D3741958",
      name: "Wosmo",
      display: "WOSMO",
      symbol: "WOSMO",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "osmosis",
            base_denom:
              "factory/osmo1pfyxruwvtwk00y8z06dh2lqjdj82ldvy74wzm3/WOSMO",
            channel_id: "channel-874",
          },
          chain: {
            channel_id: "channel-10",
            path: "transfer/channel-10/factory/osmo1pfyxruwvtwk00y8z06dh2lqjdj82ldvy74wzm3/WOSMO",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "osmosis",
            base_denom:
              "factory/osmo1pfyxruwvtwk00y8z06dh2lqjdj82ldvy74wzm3/WOSMO",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/wosmo.png",
          theme: {
            primary_color_hex: "#edd5ee",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/wosmo.png",
      },
    },
    {
      description: "Astro BOY",
      denom_units: [
        {
          denom:
            "neutron1uqvse8fdrd9tam47f2jhy9m6al6xxtqpc83f9pdnz5gdle4swc0spfnctv",
          exponent: 0,
          aliases: ["uboy"],
        },
        {
          denom: "boy",
          exponent: 6,
        },
      ],
      base: "neutron1uqvse8fdrd9tam47f2jhy9m6al6xxtqpc83f9pdnz5gdle4swc0spfnctv",
      name: "boy",
      display: "boy",
      symbol: "BOY",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/boy.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/boy.png",
          theme: {
            primary_color_hex: "#333333",
          },
        },
      ],
    },
    {
      description:
        "A clan of 11y bad kids crafting chaos on the Cosmos eco. One bad memecoin to rule them all  $BADKID. Airdropped to Badkids NFT holders and $STARS stakers. It's so bad, your wallet's throwing a tantrum for it.",
      denom_units: [
        {
          denom:
            "ibc/9F8417FBA11E5E01F7F85DDD48C400EB746E95084C11706041663845B4A700A8",
          exponent: 0,
        },
        {
          denom: "BADKID",
          exponent: 6,
        },
      ],
      type_asset: "ics20",
      base: "ibc/9F8417FBA11E5E01F7F85DDD48C400EB746E95084C11706041663845B4A700A8",
      name: "Badkid",
      display: "BADKID",
      symbol: "BADKID",
      traces: [
        {
          type: "ibc",
          counterparty: {
            chain_name: "osmosis",
            base_denom:
              "factory/osmo10n8rv8npx870l69248hnp6djy6pll2yuzzn9x8/BADKID",
            channel_id: "channel-874",
          },
          chain: {
            channel_id: "channel-10",
            path: "transfer/channel-10/factory/osmo10n8rv8npx870l69248hnp6djy6pll2yuzzn9x8/BADKID",
          },
        },
      ],
      images: [
        {
          image_sync: {
            chain_name: "osmosis",
            base_denom:
              "factory/osmo10n8rv8npx870l69248hnp6djy6pll2yuzzn9x8/BADKID",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/badkid.png",
          theme: {
            primary_color_hex: "#57443f",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/badkid.png",
      },
    },
    {
      description: "Reflections of cartel activity on Cosmos.",
      denom_units: [
        {
          denom:
            "factory/neutron1w0pz4mjw7n96kkragj8etgfgakg5vw9lzg77wq/cartel",
          exponent: 0,
          aliases: ["ucartel"],
        },
        {
          denom: "cartel",
          exponent: 6,
        },
      ],
      base: "factory/neutron1w0pz4mjw7n96kkragj8etgfgakg5vw9lzg77wq/cartel",
      name: "cartel",
      display: "cartel",
      symbol: "CARTEL",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/cartel.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/cartel.png",
          theme: {
            primary_color_hex: "#8c9098",
          },
        },
      ],
    },
    {
      description: "$ATOM to $1,000 LFG!!",
      denom_units: [
        {
          denom:
            "factory/neutron13lkh47msw28yynspc5rnmty3yktk43wc3dsv0l/ATOM1KLFG",
          exponent: 0,
          aliases: ["uatom1klfg"],
        },
        {
          denom: "ATOM1KLFG",
          exponent: 6,
        },
      ],
      base: "factory/neutron13lkh47msw28yynspc5rnmty3yktk43wc3dsv0l/ATOM1KLFG",
      name: "ATOM1KLFG",
      display: "ATOM1KLFG",
      symbol: "ATOM1KLFG",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ATOM1KLFGc.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/ATOM1KLFGc.png",
          theme: {
            primary_color_hex: "#040404",
          },
        },
      ],
    },
    {
      type_asset: "ics20",
      description: "USD Coin on Neutron",
      denom_units: [
        {
          denom:
            "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
          exponent: 0,
          aliases: ["uusdc", "microusdc"],
        },
        {
          denom: "usdc",
          exponent: 6,
        },
      ],
      base: "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
      name: "USD Coin",
      display: "usdc",
      symbol: "USDC",
      coingecko_id: "usd-coin",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.svg",
      },
      images: [
        {
          image_sync: {
            chain_name: "noble",
            base_denom: "uusdc",
          },
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.svg",
          theme: {
            circle: true,
            primary_color_hex: "#2775CA",
          },
        },
      ],
      traces: [
        {
          type: "ibc",
          counterparty: {
            channel_id: "channel-18",
            base_denom: "uusdc",
            chain_name: "noble",
          },
          chain: {
            channel_id: "channel-30",
            path: "transfer/channel-30/uusdc",
          },
        },
      ],
    },
    {
      description: "WEIRD FRIENDS token",
      denom_units: [
        {
          denom: "factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/WEIRD",
          exponent: 0,
          aliases: ["uWEIRD"],
        },
        {
          denom: "WEIRD",
          exponent: 6,
        },
      ],
      base: "factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/WEIRD",
      name: "WEIRD",
      display: "WEIRD",
      symbol: "WEIRD",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/WEIRD.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/WEIRD.png",
          theme: {
            primary_color_hex: "#ebf0f4",
          },
        },
      ],
    },
    {
      denom_units: [
        {
          denom:
            "factory/neutron19tynwawkm2rgefqxy7weupu4hdamyhg890zep2/TAKUMI",
          exponent: 0,
          aliases: ["utakumi"],
        },
        {
          denom: "takumi",
          exponent: 6,
        },
      ],
      base: "factory/neutron19tynwawkm2rgefqxy7weupu4hdamyhg890zep2/TAKUMI",
      name: "Takumi Asano",
      display: "takumi",
      symbol: "TAKUMI",
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/TAKUMI.png",
          theme: {
            primary_color_hex: "#556867",
          },
        },
      ],
    },
    {
      name: "Ninja Blaze Token",
      description: "Ninja Blaze Token",
      denom_units: [
        {
          denom:
            "factory/neutron1a6ydq8urdj0gkvjw9e9e5y9r5ce2qegm9m4xufpt96kcm60kmuass0mqq4/nbz",
          exponent: 0,
          aliases: ["uNBZ"],
        },
        {
          denom: "NBZ",
          exponent: 6,
        },
      ],
      base: "factory/neutron1a6ydq8urdj0gkvjw9e9e5y9r5ce2qegm9m4xufpt96kcm60kmuass0mqq4/nbz",
      display: "NBZ",
      symbol: "NBZ",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/NBZ.png",
      },
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/NBZ.png",
          theme: {
            primary_color_hex: "#9890f9",
          },
        },
      ],
    },
    {
      description:
        "Mars Protocol is a cross-collateralized Money Market Protocol on Neutron and Osmosis.",
      extended_description:
        "Lend, borrow and earn with an autonomous credit protocol in the Cosmos universe. Open to all, closed to none.",
      denom_units: [
        {
          denom: "factory/neutron1ndu2wvkrxtane8se2tr48gv7nsm46y5gcqjhux/MARS",
          exponent: 0,
          aliases: ["umars"],
        },
        {
          denom: "MARS",
          exponent: 6,
        },
      ],
      base: "factory/neutron1ndu2wvkrxtane8se2tr48gv7nsm46y5gcqjhux/MARS",
      name: "Mars Protocol token",
      display: "MARS",
      symbol: "MARS",
      coingecko_id: "mars-protocol-a7fcbcfb-fd61-4017-92f0-7ee9f9cc6da3",
      images: [
        {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/mars-token.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/mars-token.svg",
          theme: {
            primary_color_hex: "#ef4136",
          },
        },
      ],
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/mars-token.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/mars-token.svg",
      },
      socials: {
        website: "https://marsprotocol.io/",
        twitter: "https://x.com/mars_protocol",
      },
    },
    {
      description: "Drop staked ATOM",
      extended_description: "Drop protocol token for the interchain liquidity",
      denom_units: [
        {
          denom:
            "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
          exponent: 0,
        },
        {
          denom: "dATOM",
          exponent: 6,
        },
      ],
      base: "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
      name: "dATOM",
      display: "dATOM",
      symbol: "dATOM",
      coingecko_id: "drop-staked-atom",
      traces: [
        {
          type: "liquid-stake",
          counterparty: {
            chain_name: "cosmoshub",
            base_denom: "uatom",
          },
          provider: "Drop Protocol",
        },
      ],
      images: [
        {
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/dATOM.svg",
        },
      ],
      logo_URIs: {
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/dATOM.svg",
      },
      socials: {
        website: "https://www.drop.money/",
        twitter: "https://x.com/Dropdotmoney",
      },
    },
  ],
}
