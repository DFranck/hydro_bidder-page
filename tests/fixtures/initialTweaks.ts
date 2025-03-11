import { BackendDataTweak } from "@/contract-apis/types"

export const initialTweaks: BackendDataTweak[] = [
  {
    id: "2",
    json: {
      hydroMetaData: {
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
      hydroMetaData: {
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
]
