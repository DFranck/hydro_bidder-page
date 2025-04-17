import { BackendDataTweak, BidMetaDataById } from "@/contract-apis/types"
import { sumBy } from "lodash"
import cloneDeep from "lodash/cloneDeep"
import random from "lodash/random"
import hydroStateSnapshot from "./hydro-state-snapshot.json"
import walletDataSnapshot from "./wallet-data-snapshot.json"

const dummyBidRoundId = 4
const originalBidsInRoundId3 = hydroStateSnapshot.hydroRoundData[3].round_bids
const originalBidsInRoundId1 = hydroStateSnapshot.hydroRoundData[1].round_bids
const originalNumiaBidsForBoth =
  hydroStateSnapshot.externalData.numiaBids.filter((numiaBid) =>
    [1, 3].includes(Number(numiaBid.round)),
  )
const originalBidIds = originalNumiaBidsForBoth.map((numiaBid) => numiaBid.id)
const originalBidMetadataForBoth = Object.fromEntries(
  Object.entries(hydroStateSnapshot.externalData.bidMetaDataById).filter(
    ([bidId]) => originalBidIds.includes(bidId),
  ),
)

const bidsInTrancheOne = originalBidsInRoundId3.map((bid) => ({
  ...bid,
  round_id: dummyBidRoundId,
  tranche_id: 1,
  title: `[1] ${bid.title}`,
}))

const bidsInTrancheTwo = originalBidsInRoundId1.map((bid) => ({
  ...bid,
  round_id: dummyBidRoundId,
  tranche_id: 2,
  title: `[2] ${bid.title}`,
}))

const numiaBids = originalNumiaBidsForBoth.map((numiaBid) => ({
  ...numiaBid,
  round: dummyBidRoundId.toString(),
  tranche: numiaBid.tranche === "1" ? 1 : 2,
}))

const bidMetaDataById = Object.fromEntries(
  Object.entries(originalBidMetadataForBoth).map(([bidId, bidMetadata]) => [
    bidId,
    { ...bidMetadata, title: `[TX] ${bidMetadata.title}` },
  ]),
) as BidMetaDataById

const dummyLockups = walletDataSnapshot.lockups_with_per_tranche_infos.map(
  (lockup) => {
    const newLockup = cloneDeep(lockup)
    const randomAmount = (random(1, 50) * 1e6).toString()

    newLockup.lock_with_power.lock_entry.funds.amount = randomAmount

    newLockup.lock_with_power.current_voting_power = randomAmount

    newLockup.per_tranche_info.push({
      tranche_id: 2,
      current_voted_on_proposal: null,
      next_round_lockup_can_vote: dummyBidRoundId,
    })

    return newLockup
  },
)

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
        round_id: dummyBidRoundId,
      },
      hydroRoundData: [
        {
          round_bids: [...bidsInTrancheOne, ...bidsInTrancheTwo],
          round_id: dummyBidRoundId,
          round_lockups: [],
          round_tributes: [],
        },
      ],
      walletData: {
        $lockups_with_per_tranche_infos: dummyLockups,
        $voting_power: sumBy(dummyLockups, (lockup) =>
          Number(lockup.lock_with_power.current_voting_power),
        ),
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
      patchData: {
        currentRoundPrices: {
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9":
            {
              token_price: 15,
            },
        }
      },
    },
    label: "ATOM to $15",
    disabled: true,
  },
  {
    id: "11",
    json: {
      patchData: {
        currentRoundPrices: {
          "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9":
            {
              token_price: 0.5,
            },
        }
      },
    },
    label: "ATOM to $0.50",
    disabled: true,
  },
]
