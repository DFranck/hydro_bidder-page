export enum AllowedLockupPeriodInEpochs {
  ONE_EPOCH = 1,
  TWO_EPOCHS = 2,
  THREE_EPOCHS = 3,
}

export const HYDRO_TELEGRAM_COMMUNITY_URL = "https://t.me/hydro_community"
export const HYDRO_TELEGRAM_ANNOUNCEMENTS_URL = "https://t.me/hydro_announcements"

export const DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS = 3

export const SOCIAL_MEDIA_LINKS = [
  {
    name: "Twitter",
    url: "https://x.com/HydroTeam_",
    icon: "brands:x-twitter",
  },
  {
    name: "Telegram",
    url: HYDRO_TELEGRAM_COMMUNITY_URL,
    icon: "solid:paper-plane",
  },
]

export const voteThresholdByTrancheId = {
  1: 0.05,
  2: 0.35,
} as const

export const sharedEndpoints = {
  neutron: {
    rpc: ["https://hydro-neutron-rpc.citadel.one/"],
    rest: ["https://hydro-neutron-api.citadel.one/"],
  },
  cosmoshub: {
    rpc: ["https://hydro-cosmoshub-rpc.citadel.one/"],
    rest: ["https://hydro-cosmoshub-api.citadel.one/"],
  },
}

export const EPOCH_LENGTH = 2628000000000000

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