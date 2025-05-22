"use client"

import {
  bidDurationCandidates,
  bidTitleCandidates,
  currentRoundId,
  votingTokenCandidates,
} from "@/app/(v2)/v2/page"
import random from "lodash/random"
import range from "lodash/range"
import sample from "lodash/sample"
import { createContext, use } from "react"

interface Bid {
  id: number
  bucketId: number
  roundId: number
  title: string
  duration: string
  amount: number
}

function buildDummyData({
  minBuckets = 3,
  maxBuckets = 8,
  maxBidsPerBucket = 20,
  maxVotesCast = 2,
}: {
  minBuckets?: number
  maxBuckets?: number
  maxBidsPerBucket?: number
  maxVotesCast?: number
} = {}) {
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

  return {
    buckets,
    bids,
    currentRoundId,
    votingTokens: votingTokenCandidates,
    userVotedOnBidIds,
  }
}

const DummyDataContext = createContext<ReturnType<
  typeof buildDummyData
> | null>(null)

export function DummyDataProvider({ children }: { children: React.ReactNode }) {
  const dummyData = buildDummyData()
  return <DummyDataContext value={dummyData}>{children}</DummyDataContext>
}

export function useDummyData() {
  return use(DummyDataContext)
}
