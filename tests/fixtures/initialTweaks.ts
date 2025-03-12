import { BackendDataTweak, BidMetaDataById } from "@/contract-apis/types"
import hydroStateSnapshot from "./hydro-state-snapshot.json"

const roundId = 99
const originalBidsInRoundId3 = hydroStateSnapshot.hydroRoundData[3].round_bids
const originalBidsInRoundId1 = hydroStateSnapshot.hydroRoundData[1].round_bids
const originalNumiaBidsForBoth =
  hydroStateSnapshot.externalData.numiaBids.filter((numiaBid) =>
    [1, 3].includes(Number(numiaBid.round))
  )
const originalBidIds = originalNumiaBidsForBoth.map((numiaBid) => numiaBid.id)
const originalBidMetadataForBoth = Object.fromEntries(
  Object.entries(hydroStateSnapshot.externalData.bidMetaDataById).filter(
    ([bidId]) => originalBidIds.includes(bidId)
  )
)

const bidsInTrancheOne = originalBidsInRoundId3.map((bid) => ({
  ...bid,
  round_id: roundId,
  tranche_id: 1,
  title: `[1] ${bid.title}`,
}))
const bidsInTrancheTwo = originalBidsInRoundId1.map((bid) => ({
  ...bid,
  round_id: roundId,
  tranche_id: 2,
  title: `[2] ${bid.title}`,
}))
const numiaBids = originalNumiaBidsForBoth.map((numiaBid) => ({
  ...numiaBid,
  round: roundId.toString(),
  tranche: numiaBid.tranche === "1" ? 1 : 2,
}))
const bidMetaDataById = Object.fromEntries(
  Object.entries(originalBidMetadataForBoth).map(([bidId, bidMetadata]) => [
    bidId,
    { ...bidMetadata, title: `[TX] ${bidMetadata.title}` },
  ])
) as BidMetaDataById

export const initialTweaks: BackendDataTweak[] = [
  {
    id: "2",
    json: {
      externalData: {
        numiaBids,
        bidMetaDataById,
      },
      hydroMetaData: {
        tranches: [
          {
            id: 2,
            name: "USDC Bucket",
            metadata: "A bucket of USDC to deploy as PoL",
          },
        ],
        round_id: roundId,
      },
      hydroRoundData: [
        {
          round_bids: [...bidsInTrancheOne, ...bidsInTrancheTwo],
          round_id: roundId,
          round_lockups: [],
          round_tributes: [],
        },
      ],
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
