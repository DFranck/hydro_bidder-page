import { BackendDataTweak } from "@/contract-apis/types"

export const initialTweaks: BackendDataTweak[] = [
  {
    id: "2",
    json: {
      hydroData: {
        tranches: [
          {
            id: 2,
            name: "USDC Bucket",
            metadata: "A bucket of USDC to deploy as PoL",
          },
        ],
      },
    },
    label: "Second USDC tranche",
    disabled: true,
  },
  {
    id: "1",
    json: {
      hydroData: {
        constants: {
          max_locked_tokens: 100000000000,
        },
      },
    },
    label: "Cap to 100,000",
    disabled: true,
  },
  {
    id: "13",
    json: {
      patchData: {
        address: "neutron1r6rv879netg009eh6ty23v57qrq29afecuehlm",
        isWalletConnected: true,
      },
    },
    label: "Connected to Wallet",
    disabled: true,
  },
  {
    id: "12",
    json: {
      externalData: {
        assetListWithPrices: {
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9":
            {
              priceUsd: 15,
            },
        },
      },
    },
    label: "ATOM to $15",
    disabled: true,
  },
  {
    id: "11",
    json: {
      externalData: {
        assetListWithPrices: {
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9":
            {
              priceUsd: 0.5,
            },
        },
      },
    },
    label: "ATOM to $0.50",
    disabled: true,
  },
  {
    id: "7d6f3c6f-2ac3-41fb-8228-a9fb05a7826b",
    json: {
      hydroData: {
        round_id: 3,
        tranches: [
          {
            id: 1,
            name: "ATOM Bucket",
            metadata: "A bucket of ATOM to deploy as PoL",
          },
        ],
      },
      externalData: {
        $bidMetaDataById: {
          "25": {
            title: "Stride: stATOM Liquidity on Osmosis",
            projectLogoUrl: "/images/logo-stride.png",
            projectName: "Stride",
            projectUrl: "https://www.stride.zone/",
            requestAmount: [[100000, "ATOM"]],
            minMaxTargetPolApr: [1, 5],
          },
          "26": {
            title: "Nolus Liquidity Provision ATOM LP",
            projectLogoUrl: "/images/logo-nolus.png",
            projectName: "Nolus",
            projectUrl: "https://nolus.io/",
            requestAmount: [[5000, "ATOM"]],
            minMaxTargetPolApr: [6, 7],
          },
          "27": {
            title: "Neptune x Drop: nATOM/dATOM LP on Injective",
            projectLogoUrl: "/images/logo-neptune.png",
            projectName: "Neptune Finance",
            projectUrl: "https://nept.finance/",
            requestAmount: [[10000, "ATOM"]],
            minMaxTargetPolApr: [2, 7],
          },
        },
        $numiaBids: [
          {
            round: "3",
            tranche: 1,
            project: "Stride",
            project_url: "https://www.stride.zone/",
            project_logo_url: "/images/logo-stride.png",
            id: "25",
            title: "Stride: stATOM Liquidity on Osmosis",
            apr: 3,
            current_allocation_amount: 0,
            duration_days: 90,
            initial_allocation_amount: 0,
            offchain_tribute_info: "STRD",
            offchain_tribute: "STRD",
            onchain_tribute_assets: "STRD",
            onchain_tribute_usdc: 0,
            requested_allocation_amount: 100000,
            requested_allocation_denom: "ATOM",
            status: "voting",
            voters: 0,
            voting_power: 0,
            yield: 3,
          },
          {
            round: "3",
            tranche: 1,
            project: "Nolus",
            project_url: "https://nolus.io/",
            project_logo_url: "/images/logo-nolus.png",
            id: "26",
            title: "Nolus Liquidity Provision ATOM LP",
            apr: 6.5,
            current_allocation_amount: 0,
            duration_days: 90,
            initial_allocation_amount: 0,
            offchain_tribute_info: "NLS",
            offchain_tribute: "NLS",
            onchain_tribute_assets: "NLS",
            onchain_tribute_usdc: 0,
            requested_allocation_amount: 5000,
            requested_allocation_denom: "ATOM",
            status: "voting",
            voters: 0,
            voting_power: 0,
            yield: 6.5,
          },
          {
            round: "3",
            tranche: 1,
            project: "Neptune Finance",
            project_url: "https://nept.finance/",
            project_logo_url: "/images/logo-neptune.png",
            id: "27",
            title: "Neptune x Drop: nATOM/dATOM LP on Injective",
            apr: 4.75,
            current_allocation_amount: 0,
            duration_days: 90,
            initial_allocation_amount: 0,
            offchain_tribute_info: "USDC",
            offchain_tribute: "USDC",
            onchain_tribute_assets: "USDC",
            onchain_tribute_usdc: 0,
            requested_allocation_amount: 10000,
            requested_allocation_denom: "ATOM",
            status: "voting",
            voters: 0,
            voting_power: 0,
            yield: 4.75,
          },
        ],
      },
      walletData: {
        $votes: [],
      },
    },
    label: "3 Bids in Round 4",
    disabled: true,
  },
]
