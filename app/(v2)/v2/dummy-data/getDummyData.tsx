'use server'

import { random, range, sample } from 'lodash'
import { cache } from 'react'

interface Bid {
  id: number
  bucketId: number
  roundId: number
  title: string
  duration: string
  apr: number
}

export type DummyData = Awaited<ReturnType<typeof getDummyData>>

const currentRoundId = 5

const bidTitleCandidates = [
  'Decentralized NFT marketplace with gasless transactions',
  'Blockchain-based voting system for transparent elections',
  'Tokenized real estate investment platform on Ethereum',
  'Decentralized social media platform with privacy focus',
  'Supply chain tracking solution using smart contracts',
  'Cross-chain bridge for seamless asset transfers',
  'DeFi lending protocol with automated risk assessment',
  'DAO governance tool with quadratic voting',
  'Web3 identity verification system',
  'NFT fractionalization platform',
  'Decentralized file storage with encryption',
  'Smart contract audit automation tool',
  'Blockchain-based insurance platform',
  'Crypto payment gateway for merchants',
  'DeFi yield aggregator with risk management',
]

const bidDurationCandidates = ['1 month', '3 months', '6 months']

const votingTokenCandidates = ['ATOM', 'stOSMO']

export const getDummyData = cache(
  async ({
    minBuckets = 6,
    maxBuckets = 12,
    maxBidsPerBucket = 20,
    maxVotesCast = 2,
  }: {
    minBuckets?: number
    maxBuckets?: number
    maxBidsPerBucket?: number
    maxVotesCast?: number
  } = {}) => {
    const userVotedOnBidIds: number[] = []
    const numBuckets = random(minBuckets, maxBuckets)
    const bids: Bid[] = []

    let votesCast = 0

    const buckets = range(0, numBuckets).map((_, bucketId) => {
      const numBidsInBucket = random(0, maxBidsPerBucket)
      const userVotedInBucket =
        votesCast < maxVotesCast && sample([true, false])

      if (userVotedInBucket) {
        votesCast += 1
        userVotedOnBidIds.push(bids.length + sample(range(0, numBidsInBucket))!)
      }

      const bidsInBucket = range(0, numBidsInBucket).map(
        (bidIndex) =>
          ({
            id: bids.length + bidIndex,
            bucketId,
            roundId: currentRoundId,
            title: sample(bidTitleCandidates),
            duration: sample(bidDurationCandidates),
            apr: random(0, 25) / 100,
          }) as Bid,
      )

      bids.push(...bidsInBucket)

      return {
        id: bucketId,
        label: `Bucket No. ${bucketId + 1}`,
        denom: sample(votingTokenCandidates),
        numBids: numBidsInBucket,
        userVotedInBucket,
      }
    })

    const dummyData = {
      buckets,
      bids,
      currentRoundId,
      votingTokens: votingTokenCandidates,
      userVotedOnBidIds,
    }

    return dummyData
  },
)
