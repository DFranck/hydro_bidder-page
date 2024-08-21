import { Tranche, Constants, Proposal, LockEntry, Timestamp, Uint128, Vote, Addr } from './ts_types/HydroBase.types';
import { RoundState, GlobalState } from './types'

const roundOneTranchOneTopNProposals: Proposal[] = [
    {
        description: "Deploy 2,200,000 ATOM to Osmosis AMM for ATOM/USDC liquidity pool.",
        percentage: "22",
        power: "2200000",
        proposal_id: 1,
        round_id: 1,
        title: "Osmosis ATOM/USDC Liquidity",
        tranche_id: 1,
    },
    {
        description: "Provide 2,000,000 ATOM as liquidity on Astroport DEX for ATOM/USDC pair.",
        percentage: "20",
        power: "2000000",
        proposal_id: 2,
        round_id: 1,
        title: "Astroport ATOM/USDC Provision",
        tranche_id: 1,
    },
    {
        description: "Allocate 1,800,000 ATOM to Sifchain DEX for ATOM/USDC liquidity.",
        percentage: "18",
        power: "1800000",
        proposal_id: 3,
        round_id: 1,
        title: "Sifchain ATOM/USDC Liquidity",
        tranche_id: 1,
    },
    {
        description: "Deploy 1,600,000 ATOM to Crescent DEX for ATOM/USDC trading pair.",
        percentage: "16",
        power: "1600000",
        proposal_id: 4,
        round_id: 1,
        title: "Crescent ATOM/USDC Addition",
        tranche_id: 1,
    },
    {
        description: "Provide 1,500,000 ATOM as liquidity on Junoswap for ATOM/USDC pool.",
        percentage: "15",
        power: "1500000",
        proposal_id: 5,
        round_id: 1,
        title: "Junoswap ATOM/USDC Deployment",
        tranche_id: 1,
    },
    {
        description: "Allocate 1,400,000 ATOM to Kujira for ATOM/USDC liquidity pool.",
        percentage: "14",
        power: "1400000",
        proposal_id: 6,
        round_id: 1,
        title: "Kujira ATOM/USDC Provision",
        tranche_id: 1,
    },
    {
        description: "Deploy 1,200,000 ATOM to Injective Protocol for ATOM/USDC futures market.",
        percentage: "12",
        power: "1200000",
        proposal_id: 7,
        round_id: 1,
        title: "Injective ATOM/USDC Futures",
        tranche_id: 1,
    },
    {
        description: "Provide 1,000,000 ATOM as collateral on Umee for lending and borrowing.",
        percentage: "10",
        power: "1000000",
        proposal_id: 8,
        round_id: 1,
        title: "Umee ATOM Lending Deployment",
        tranche_id: 1,
    },
    {
        description: "Allocate 800,000 ATOM to Gravity DEX for ATOM/USDC liquidity pool.",
        percentage: "8",
        power: "800000",
        proposal_id: 9,
        round_id: 1,
        title: "Gravity DEX ATOM/USDC Addition",
        tranche_id: 1,
    },
    {
        description: "Deploy 700,000 ATOM to Comdex for ATOM/USDC trading pair.",
        percentage: "7",
        power: "700000",
        proposal_id: 10,
        round_id: 1,
        title: "Comdex ATOM/USDC Provision",
        tranche_id: 1,
    },
];

const roundOneTrancheTwoTopNProposals: Proposal[] = [
    {
        description: "Allocate 5,000,000 USDC to Aave protocol for lending and borrowing.",
        percentage: "25",
        power: "5000000",
        proposal_id: 11,
        round_id: 1,
        title: "Aave USDC Lending Pool",
        tranche_id: 2,
    },
    {
        description: "Deploy 4,000,000 USDC to Compound Finance for yield generation.",
        percentage: "20",
        power: "4000000",
        proposal_id: 12,
        round_id: 1,
        title: "Compound USDC Yield Strategy",
        tranche_id: 2,
    },
    {
        description: "Provide 3,000,000 USDC as liquidity on Curve Finance for stablecoin pools.",
        percentage: "15",
        power: "3000000",
        proposal_id: 13,
        round_id: 1,
        title: "Curve Stablecoin Pool Liquidity",
        tranche_id: 2,
    },
    {
        description: "Allocate 2,500,000 USDC to Yearn Finance for automated yield strategies.",
        percentage: "12.5",
        power: "2500000",
        proposal_id: 14,
        round_id: 1,
        title: "Yearn USDC Yield Optimization",
        tranche_id: 2,
    },
    {
        description: "Deploy 2,000,000 USDC to Maker protocol as collateral for DAI minting.",
        percentage: "10",
        power: "2000000",
        proposal_id: 15,
        round_id: 1,
        title: "Maker USDC Collateral Provision",
        tranche_id: 2,
    },
    {
        description: "Provide 1,500,000 USDC as liquidity on Uniswap V3 for concentrated liquidity pools.",
        percentage: "7.5",
        power: "1500000",
        proposal_id: 16,
        round_id: 1,
        title: "Uniswap V3 USDC Liquidity",
        tranche_id: 2,
    },
    {
        description: "Allocate 1,000,000 USDC to Anchor protocol for stable yield generation.",
        percentage: "5",
        power: "1000000",
        proposal_id: 17,
        round_id: 1,
        title: "Anchor USDC Yield Deployment",
        tranche_id: 2,
    },
    {
        description: "Deploy 500,000 USDC to Balancer for weighted pool liquidity.",
        percentage: "2.5",
        power: "500000",
        proposal_id: 18,
        round_id: 1,
        title: "Balancer USDC Weighted Pool",
        tranche_id: 2,
    },
    {
        description: "Provide 300,000 USDC as liquidity on SushiSwap for USDC/ETH pair.",
        percentage: "1.5",
        power: "300000",
        proposal_id: 19,
        round_id: 1,
        title: "SushiSwap USDC/ETH Liquidity",
        tranche_id: 2,
    },
    {
        description: "Allocate 200,000 USDC to Convex Finance for boosted CRV rewards.",
        percentage: "1",
        power: "200000",
        proposal_id: 20,
        round_id: 1,
        title: "Convex USDC Strategy",
        tranche_id: 2,
    },
];

const roundTwoTrancheOneTopNProposals: Proposal[] = [
    {
        description: "Stake 3,000,000 ATOM with top validators to secure the Cosmos Hub network.",
        percentage: "30",
        power: "3000000",
        proposal_id: 21,
        round_id: 2,
        title: "Cosmos Hub Staking Initiative",
        tranche_id: 1,
    },
    {
        description: "Allocate 2,500,000 ATOM to Osmosis for concentrated liquidity pools.",
        percentage: "25",
        power: "2500000",
        proposal_id: 22,
        round_id: 2,
        title: "Osmosis Concentrated Liquidity",
        tranche_id: 1,
    },
    {
        description: "Deploy 1,500,000 ATOM to Stride for liquid staking.",
        percentage: "15",
        power: "1500000",
        proposal_id: 23,
        round_id: 2,
        title: "Stride Liquid Staking Deployment",
        tranche_id: 1,
    },
    {
        description: "Provide 1,000,000 ATOM as collateral on Mars Protocol for lending and borrowing.",
        percentage: "10",
        power: "1000000",
        proposal_id: 24,
        round_id: 2,
        title: "Mars Protocol ATOM Lending",
        tranche_id: 1,
    },
    {
        description: "Allocate 800,000 ATOM to Neutron for smart contract deployment and ecosystem growth.",
        percentage: "8",
        power: "800000",
        proposal_id: 25,
        round_id: 2,
        title: "Neutron Ecosystem Development",
        tranche_id: 1,
    },
    {
        description: "Deploy 500,000 ATOM to Umee for cross-chain lending and borrowing.",
        percentage: "5",
        power: "500000",
        proposal_id: 26,
        round_id: 2,
        title: "Umee Cross-Chain Lending",
        tranche_id: 1,
    },
    {
        description: "Provide 300,000 ATOM as liquidity on Crescent DEX for new trading pairs.",
        percentage: "3",
        power: "300000",
        proposal_id: 27,
        round_id: 2,
        title: "Crescent DEX Liquidity Expansion",
        tranche_id: 1,
    },
    {
        description: "Allocate 200,000 ATOM to Kujira for ATOM/USK liquidity pool.",
        percentage: "2",
        power: "200000",
        proposal_id: 28,
        round_id: 2,
        title: "Kujira ATOM/USK Liquidity",
        tranche_id: 1,
    },
    {
        description: "Deploy 150,000 ATOM to Injective Protocol for perpetual futures markets.",
        percentage: "1.5",
        power: "150000",
        proposal_id: 29,
        round_id: 2,
        title: "Injective ATOM Perpetuals",
        tranche_id: 1,
    },
    {
        description: "Provide 50,000 ATOM as a grant for Cosmos ecosystem development projects.",
        percentage: "0.5",
        power: "50000",
        proposal_id: 30,
        round_id: 2,
        title: "Cosmos Ecosystem Grants",
        tranche_id: 1,
    },
];

const roundTwoTrancheTwoTopNProposals: Proposal[] = [
    {
        description: "Allocate 6,000,000 USDC to Aave V3 for enhanced lending and borrowing opportunities.",
        percentage: "30",
        power: "6000000",
        proposal_id: 31,
        round_id: 2,
        title: "Aave V3 USDC Liquidity Expansion",
        tranche_id: 2,
    },
    {
        description: "Deploy 4,000,000 USDC to Compound V3 for isolated lending markets.",
        percentage: "20",
        power: "4000000",
        proposal_id: 32,
        round_id: 2,
        title: "Compound V3 Isolated Markets",
        tranche_id: 2,
    },
    {
        description: "Provide 3,000,000 USDC as liquidity on Curve Finance V2 for new metapool strategies.",
        percentage: "15",
        power: "3000000",
        proposal_id: 33,
        round_id: 2,
        title: "Curve V2 Metapool Liquidity",
        tranche_id: 2,
    },
    {
        description: "Allocate 2,000,000 USDC to Yearn Finance for new vault strategies.",
        percentage: "10",
        power: "2000000",
        proposal_id: 34,
        round_id: 2,
        title: "Yearn Finance Vault Expansion",
        tranche_id: 2,
    },
    {
        description: "Deploy 1,500,000 USDC to Uniswap V3 for concentrated liquidity in new trading pairs.",
        percentage: "7.5",
        power: "1500000",
        proposal_id: 35,
        round_id: 2,
        title: "Uniswap V3 New Pairs Liquidity",
        tranche_id: 2,
    },
    {
        description: "Provide 1,000,000 USDC as collateral on Maker for new DAI minting strategies.",
        percentage: "5",
        power: "1000000",
        proposal_id: 36,
        round_id: 2,
        title: "Maker New Collateral Strategies",
        tranche_id: 2,
    },
    {
        description: "Allocate 800,000 USDC to Convex Finance for optimized CRV farming.",
        percentage: "4",
        power: "800000",
        proposal_id: 37,
        round_id: 2,
        title: "Convex Optimized CRV Farming",
        tranche_id: 2,
    },
    {
        description: "Deploy 700,000 USDC to Balancer V2 for weighted pools with new assets.",
        percentage: "3.5",
        power: "700000",
        proposal_id: 38,
        round_id: 2,
        title: "Balancer V2 New Asset Pools",
        tranche_id: 2,
    },
    {
        description: "Provide 500,000 USDC as liquidity on SushiSwap for new farming incentives.",
        percentage: "2.5",
        power: "500000",
        proposal_id: 39,
        round_id: 2,
        title: "SushiSwap Enhanced Farming",
        tranche_id: 2,
    },
    {
        description: "Allocate 500,000 USDC to Ribbon Finance for structured products.",
        percentage: "2.5",
        power: "500000",
        proposal_id: 40,
        round_id: 2,
        title: "Ribbon Finance Structured Products",
        tranche_id: 2,
    },
];

export const topNProposals: Proposal[][][] = [
    // Round 1
    [
        roundOneTranchOneTopNProposals,
        roundOneTrancheTwoTopNProposals
    ],
    // Round 2
    [
        roundTwoTrancheOneTopNProposals,
        roundTwoTrancheTwoTopNProposals
    ]
];

export const mockRoundStates: RoundState[] = [
    {
        roundEnd: "1675209599000", // 2023-01-31T23:59:59.000Z
        totalVotingPower: 20000000, // Max of total_power from tranches in round 1
    },
    {
        roundEnd: "1677628799000", // 2023-02-28T23:59:59.000Z
        totalVotingPower: 20000000, // Max of total_power from tranches in round 2
    },
];

export const mockGlobalState: GlobalState = {
    constants: {
        first_round_start: "1683000000", // Example timestamp
        hub_transfer_channel_id: "channel-1",
        lock_epoch_length: 86400, // 1 day in seconds
        max_locked_tokens: 100000000, // Example max locked tokens
        max_validator_shares_participating: 1000, // Example max validator shares
        paused: false,
        round_length: 604800, // 1 week in seconds
    },
    currentRound: 1,
    totalLockedTokens: 40000000,
    tranches: [
        {
            id: 0,
            metadata: "ATOM tranche for Cosmos ecosystem liquidity provision and DeFi integrations",
            name: "ATOM Tranche",
        },
        {
            id: 1,
            metadata: "USDC tranche for stablecoin-based strategies and yield farming opportunities",
            name: "USDC Tranche",
        },
    ],
    whitelistAdmins: [
        "cosmos1whitelistadmin1...",
        "cosmos1whitelistadmin2...",
    ],
    whitelist: [
        "cosmos1user1...",
        "cosmos1user2...",
        "cosmos1user3...",
        // ... more whitelisted addresses ...
    ],
};

