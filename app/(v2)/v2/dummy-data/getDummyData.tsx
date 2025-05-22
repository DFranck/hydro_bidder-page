"use server"

import { random, range, sample } from "lodash"
import { cache } from "react"

interface Bid {
  id: number
  bucketId: number
  roundId: number
  title: string
  duration: string
  amount: number
}

export type DummyData = Awaited<ReturnType<typeof getDummyData>>

const currentRoundId = 5

const bidTitleCandidates = [
  "Decentralized NFT marketplace with gasless transactions",
  "Blockchain-based voting system for transparent elections",
  "Tokenized real estate investment platform on Ethereum",
  "Decentralized social media platform with privacy focus",
  "Supply chain tracking solution using smart contracts",
]

const bidDurationCandidates = ["1 month", "3 months", "6 months"]

const votingTokenCandidates = ["ATOM", "stOSMO"]

export const getDummyData = cache(
  async ({
    minBuckets = 3,
    maxBuckets = 8,
    maxBidsPerBucket = 20,
    maxVotesCast = 2,
  }: {
    minBuckets?: number
    maxBuckets?: number
    maxBidsPerBucket?: number
    maxVotesCast?: number
  } = {}) => {
    const numBuckets = random(minBuckets, maxBuckets)

    const bids: Bid[] = []

    const buckets = range(0, numBuckets).map((_, bucketId) => {
      const bidsInBucket = random(0, maxBidsPerBucket)

      bids.push(
        ...range(0, bidsInBucket).map(
          (bidIndex) =>
            ({
              id: bids.length + bidIndex,
              bucketId,
              roundId: currentRoundId,
              title: sample(bidTitleCandidates),
              duration: sample(bidDurationCandidates),
              amount: random(0, 100),
            }) as Bid
        )
      )

      return {
        id: bucketId,
        label: `Bucket No. ${bucketId + 1}`,
        denom: sample(votingTokenCandidates),
        numBids: bidsInBucket,
      }
    })

    const userVotedOnBidIds = range(0, maxVotesCast).map(() =>
      sample(range(0, bids.length))
    )

    const dummyData = {
      buckets,
      bids,
      currentRoundId,
      votingTokens: votingTokenCandidates,
      userVotedOnBidIds,
    }

    console.log({ dummyData })

    return dummyData
  }
)
