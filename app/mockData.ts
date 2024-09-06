import { Tranche, Constants, Proposal, LockEntry, Timestamp, Uint128, VoteWithPower, Addr } from './ts_types/HydroBase.types';
import { RoundState, GlobalState } from './types'
import { Tribute } from './ts_types/TributeBase.types';

const roundZeroTranchZeroTopNProposals: Proposal[] = [
    {
        description: "Deploy 2,200,000 ATOM to Osmosis AMM for ATOM/USDC liquidity pool.",
        percentage: "22",
        power: "2200000",
        proposal_id: 1,
        round_id: 0,
        title: "Osmosis ATOM/USDC Liquidity",
        tranche_id: 0,
    },
    {
        description: "Provide 2,000,000 ATOM as liquidity on Astroport DEX for ATOM/USDC pair.",
        percentage: "20",
        power: "2000000",
        proposal_id: 2,
        round_id: 0,
        title: "Astroport ATOM/USDC Provision",
        tranche_id: 0,
    },
    {
        description: "Allocate 1,800,000 ATOM to Sifchain DEX for ATOM/USDC liquidity.",
        percentage: "18",
        power: "1800000",
        proposal_id: 3,
        round_id: 0,
        title: "Sifchain ATOM/USDC Liquidity",
        tranche_id: 0,
    },
    {
        description: "Deploy 1,600,000 ATOM to Crescent DEX for ATOM/USDC trading pair.",
        percentage: "16",
        power: "1600000",
        proposal_id: 4,
        round_id: 0,
        title: "Crescent ATOM/USDC Addition",
        tranche_id: 0,
    },
    {
        description: "Provide 1,500,000 ATOM as liquidity on Junoswap for ATOM/USDC pool.",
        percentage: "15",
        power: "1500000",
        proposal_id: 5,
        round_id: 0,
        title: "Junoswap ATOM/USDC Deployment",
        tranche_id: 0,
    },
    {
        description: "Allocate 1,400,000 ATOM to Kujira for ATOM/USDC liquidity pool.",
        percentage: "14",
        power: "1400000",
        proposal_id: 6,
        round_id: 0,
        title: "Kujira ATOM/USDC Provision",
        tranche_id: 0,
    },
    {
        description: "Deploy 1,200,000 ATOM to Injective Protocol for ATOM/USDC futures market.",
        percentage: "12",
        power: "1200000",
        proposal_id: 7,
        round_id: 0,
        title: "Injective ATOM/USDC Futures",
        tranche_id: 0,
    },
    {
        description: "Provide 1,000,000 ATOM as collateral on Umee for lending and borrowing.",
        percentage: "10",
        power: "1000000",
        proposal_id: 8,
        round_id: 0,
        title: "Umee ATOM Lending Deployment",
        tranche_id: 0,
    },
    {
        description: "Allocate 800,000 ATOM to Gravity DEX for ATOM/USDC liquidity pool.",
        percentage: "8",
        power: "800000",
        proposal_id: 9,
        round_id: 0,
        title: "Gravity DEX ATOM/USDC Addition",
        tranche_id: 0,
    },
    {
        description: "Deploy 700,000 ATOM to Comdex for ATOM/USDC trading pair.",
        percentage: "7",
        power: "700000",
        proposal_id: 10,
        round_id: 0,
        title: "Comdex ATOM/USDC Provision",
        tranche_id: 0,
    },
];

const roundZeroTranchOneTopNProposals: Proposal[] = [
    {
        description: "Allocate 5,000,000 USDC to Aave protocol for lending and borrowing.",
        percentage: "25",
        power: "5000000",
        proposal_id: 11,
        round_id: 0,
        title: "Aave USDC Lending Pool",
        tranche_id: 1,
    },
    {
        description: "Deploy 4,000,000 USDC to Compound Finance for yield generation.",
        percentage: "20",
        power: "4000000",
        proposal_id: 12,
        round_id: 0,
        title: "Compound USDC Yield Strategy",
        tranche_id: 1,
    },
    {
        description: "Provide 3,000,000 USDC as liquidity on Curve Finance for stablecoin pools.",
        percentage: "15",
        power: "3000000",
        proposal_id: 13,
        round_id: 0,
        title: "Curve Stablecoin Pool Liquidity",
        tranche_id: 1,
    },
    {
        description: "Allocate 2,500,000 USDC to Yearn Finance for automated yield strategies.",
        percentage: "12.5",
        power: "2500000",
        proposal_id: 14,
        round_id: 0,
        title: "Yearn USDC Yield Optimization",
        tranche_id: 1,
    },
    {
        description: "Deploy 2,000,000 USDC to Maker protocol as collateral for DAI minting.",
        percentage: "10",
        power: "2000000",
        proposal_id: 15,
        round_id: 0,
        title: "Maker USDC Collateral Provision",
        tranche_id: 1,
    },
    {
        description: "Provide 1,500,000 USDC as liquidity on Uniswap V3 for concentrated liquidity pools.",
        percentage: "7.5",
        power: "1500000",
        proposal_id: 16,
        round_id: 0,
        title: "Uniswap V3 USDC Liquidity",
        tranche_id: 1,
    },
    {
        description: "Allocate 1,000,000 USDC to Anchor protocol for stable yield generation.",
        percentage: "5",
        power: "1000000",
        proposal_id: 17,
        round_id: 0,
        title: "Anchor USDC Yield Deployment",
        tranche_id: 1,
    },
    {
        description: "Deploy 500,000 USDC to Balancer for weighted pool liquidity.",
        percentage: "2.5",
        power: "500000",
        proposal_id: 18,
        round_id: 0,
        title: "Balancer USDC Weighted Pool",
        tranche_id: 1,
    },
    {
        description: "Provide 300,000 USDC as liquidity on SushiSwap for USDC/ETH pair.",
        percentage: "1.5",
        power: "300000",
        proposal_id: 19,
        round_id: 0,
        title: "SushiSwap USDC/ETH Liquidity",
        tranche_id: 1,
    },
    {
        description: "Allocate 200,000 USDC to Convex Finance for boosted CRV rewards.",
        percentage: "1",
        power: "200000",
        proposal_id: 20,
        round_id: 0,
        title: "Convex USDC Strategy",
        tranche_id: 1,
    },
];

const roundOneTranchZeroTopNProposals: Proposal[] = [
    {
        description: "Stake 3,000,000 ATOM with top validators to secure the Cosmos Hub network.",
        percentage: "30",
        power: "3000000",
        proposal_id: 21,
        round_id: 1,
        title: "Cosmos Hub Staking Initiative",
        tranche_id: 0,
    },
    {
        description: "Allocate 2,500,000 ATOM to Osmosis for concentrated liquidity pools.",
        percentage: "25",
        power: "2500000",
        proposal_id: 22,
        round_id: 1,
        title: "Osmosis Concentrated Liquidity",
        tranche_id: 0,
    },
    {
        description: "Deploy 1,500,000 ATOM to Stride for liquid staking.",
        percentage: "15",
        power: "1500000",
        proposal_id: 23,
        round_id: 1,
        title: "Stride Liquid Staking Deployment",
        tranche_id: 0,
    },
    {
        description: "Provide 1,000,000 ATOM as collateral on Mars Protocol for lending and borrowing.",
        percentage: "10",
        power: "1000000",
        proposal_id: 24,
        round_id: 1,
        title: "Mars Protocol ATOM Lending",
        tranche_id: 0,
    },
    {
        description: "Allocate 800,000 ATOM to Neutron for smart contract deployment and ecosystem growth.",
        percentage: "8",
        power: "800000",
        proposal_id: 25,
        round_id: 1,
        title: "Neutron Ecosystem Development",
        tranche_id: 0,
    },
    {
        description: "Deploy 500,000 ATOM to Umee for cross-chain lending and borrowing.",
        percentage: "5",
        power: "500000",
        proposal_id: 26,
        round_id: 1,
        title: "Umee Cross-Chain Lending",
        tranche_id: 0,
    },
    {
        description: "Provide 300,000 ATOM as liquidity on Crescent DEX for new trading pairs.",
        percentage: "3",
        power: "300000",
        proposal_id: 27,
        round_id: 1,
        title: "Crescent DEX Liquidity Expansion",
        tranche_id: 0,
    },
    {
        description: "Allocate 200,000 ATOM to Kujira for ATOM/USK liquidity pool.",
        percentage: "2",
        power: "200000",
        proposal_id: 28,
        round_id: 1,
        title: "Kujira ATOM/USK Liquidity",
        tranche_id: 0,
    },
    {
        description: "Deploy 150,000 ATOM to Injective Protocol for perpetual futures markets.",
        percentage: "1.5",
        power: "150000",
        proposal_id: 29,
        round_id: 1,
        title: "Injective ATOM Perpetuals",
        tranche_id: 0,
    },
    {
        description: "Provide 50,000 ATOM as a grant for Cosmos ecosystem development projects.",
        percentage: "0.5",
        power: "50000",
        proposal_id: 30,
        round_id: 1,
        title: "Cosmos Ecosystem Grants",
        tranche_id: 0,
    },
];

const roundOneTranchOneTopNProposals: Proposal[] = [
    {
        description: "Allocate 6,000,000 USDC to Aave V3 for enhanced lending and borrowing opportunities.",
        percentage: "30",
        power: "6000000",
        proposal_id: 31,
        round_id: 1,
        title: "Aave V3 USDC Liquidity Expansion",
        tranche_id: 1,
    },
    {
        description: "Deploy 4,000,000 USDC to Compound V3 for isolated lending markets.",
        percentage: "20",
        power: "4000000",
        proposal_id: 32,
        round_id: 1,
        title: "Compound V3 Isolated Markets",
        tranche_id: 1,
    },
    {
        description: "Provide 3,000,000 USDC as liquidity on Curve Finance V2 for new metapool strategies.",
        percentage: "15",
        power: "3000000",
        proposal_id: 33,
        round_id: 1,
        title: "Curve V2 Metapool Liquidity",
        tranche_id: 1,
    },
    {
        description: "Allocate 2,000,000 USDC to Yearn Finance for new vault strategies.",
        percentage: "10",
        power: "2000000",
        proposal_id: 34,
        round_id: 1,
        title: "Yearn Finance Vault Expansion",
        tranche_id: 1,
    },
    {
        description: "Deploy 1,500,000 USDC to Uniswap V3 for concentrated liquidity in new trading pairs.",
        percentage: "7.5",
        power: "1500000",
        proposal_id: 35,
        round_id: 1,
        title: "Uniswap V3 New Pairs Liquidity",
        tranche_id: 1,
    },
    {
        description: "Provide 1,000,000 USDC as collateral on Maker for new DAI minting strategies.",
        percentage: "5",
        power: "1000000",
        proposal_id: 36,
        round_id: 1,
        title: "Maker New Collateral Strategies",
        tranche_id: 1,
    },
    {
        description: "Allocate 800,000 USDC to Convex Finance for optimized CRV farming.",
        percentage: "4",
        power: "800000",
        proposal_id: 37,
        round_id: 1,
        title: "Convex Optimized CRV Farming",
        tranche_id: 1,
    },
    {
        description: "Deploy 700,000 USDC to Balancer V2 for weighted pools with new assets.",
        percentage: "3.5",
        power: "700000",
        proposal_id: 38,
        round_id: 1,
        title: "Balancer V2 New Asset Pools",
        tranche_id: 1,
    },
    {
        description: "Provide 500,000 USDC as liquidity on SushiSwap for new farming incentives.",
        percentage: "2.5",
        power: "500000",
        proposal_id: 39,
        round_id: 1,
        title: "SushiSwap Enhanced Farming",
        tranche_id: 1,
    },
    {
        description: "Allocate 500,000 USDC to Ribbon Finance for structured products.",
        percentage: "2.5",
        power: "500000",
        proposal_id: 40,
        round_id: 1,
        title: "Ribbon Finance Structured Products",
        tranche_id: 1,
    },
];

export const topNProposals: Proposal[][][] = [
    // Round 0
    [
        roundZeroTranchZeroTopNProposals,
        roundZeroTranchOneTopNProposals
    ],
    // Round 1
    [
        roundOneTranchZeroTopNProposals,
        roundOneTranchOneTopNProposals
    ]
];

export const mockTributes: Record<number, Record<number, Record<number, Tribute[]>>> = {
    0: {
        0: {
            1: [
                {
                    depositor: "cosmos1user1...",
                    funds: { amount: "100000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
                    proposal_id: 1,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 1
                },
                {
                    depositor: "cosmos1user2...",
                    funds: { amount: "50000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
                    proposal_id: 1,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 2
                },
            ],
            2: [
                {
                    depositor: "cosmos1user3...",
                    funds: { amount: "75000000000", denom: "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4" },
                    proposal_id: 2,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 3
                }
            ],
            3: [],
            4: [
                {
                    depositor: "cosmos1user5...",
                    funds: { amount: "5000000000", denom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9" },
                    proposal_id: 4,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 5
                }
            ],
            5: [
                {
                    depositor: "cosmos1user1...",
                    funds: { amount: "120000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
                    proposal_id: 5,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 6
                },
            ],
            6: [
                {
                    depositor: "cosmos1user2...",
                    funds: { amount: "80000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
                    proposal_id: 6,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 7
                }
            ],
            7: [],
            8: [
                {
                    depositor: "cosmos1user3...",
                    funds: { amount: "90000000000", denom: "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4" },
                    proposal_id: 8,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 8
                }
            ],
            9: [],
            10: [
                {
                    depositor: "cosmos1user4...",
                    funds: { amount: "1500000000", denom: "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4" },
                    proposal_id: 10,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 0,
                    tribute_id: 9
                }
            ],
        },
        1: {
            11: [
                {
                    depositor: "cosmos1user2...",
                    funds: { amount: "200000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 11,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 10
                }
            ],
            12: [
                {
                    depositor: "cosmos1user5...",
                    funds: { amount: "180000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 12,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 11
                }
            ],
            13: [
                {
                    depositor: "cosmos1user3...",
                    funds: { amount: "150000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 13,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 12
                },
            ],
            14: [],
            15: [
                {
                    depositor: "cosmos1user1...",
                    funds: { amount: "220000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 15,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 13
                }
            ],
            16: [
                {
                    depositor: "cosmos1user4...",
                    funds: { amount: "100000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 16,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 14
                }
            ],
            17: [],
            18: [
                {
                    depositor: "cosmos1user2...",
                    funds: { amount: "190000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 18,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 15
                }
            ],
            19: [],
            20: [
                {
                    depositor: "cosmos1user5...",
                    funds: { amount: "170000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 20,
                    refunded: false,
                    round_id: 0,
                    tranche_id: 1,
                    tribute_id: 16
                }
            ],
        }
    },
    1: {
        0: {
            21: [
                {
                    depositor: "cosmos1user2...",
                    funds: { amount: "110000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
                    proposal_id: 21,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 17
                },
                {
                    depositor: "cosmos1user3...",
                    funds: { amount: "90000000", denom: "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1" },
                    proposal_id: 21,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 18
                }
            ],
            22: [
                {
                    depositor: "cosmos1user4...",
                    funds: { amount: "2000000000", denom: "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4" },
                    proposal_id: 22,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 19
                }
            ],
            23: [
                {
                    depositor: "cosmos1user5...",
                    funds: { amount: "90000000000", denom: "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4" },
                    proposal_id: 23,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 20
                }
            ],
            24: [],
            25: [
                {
                    depositor: "cosmos1user1...",
                    funds: { amount: "130000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
                    proposal_id: 25,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 21
                },
                {
                    depositor: "cosmos1user6...",
                    funds: { amount: "7000000000", denom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9" },
                    proposal_id: 25,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 22
                }
            ],
            26: [],
            27: [
                {
                    depositor: "cosmos1user7...",
                    funds: { amount: "5000000000", denom: "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1" },
                    proposal_id: 27,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 31
                }
            ],
            28: [
                {
                    depositor: "cosmos1user8...",
                    funds: { amount: "75000000", denom: "ibc/9117A26BA81E29FA4F78F57DC2BD90CD3D26848101BA880445F119B22A1E254E" },
                    proposal_id: 28,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 32
                }
            ],
            29: [],
            30: [
                {
                    depositor: "cosmos1user9...",
                    funds: { amount: "3000000000", denom: "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349" },
                    proposal_id: 30,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 0,
                    tribute_id: 33
                }
            ],
        },
        1: {
            31: [
                {
                    depositor: "cosmos1user3...",
                    funds: { amount: "220000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 31,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 23
                },
                {
                    depositor: "cosmos1user4...",
                    funds: { amount: "180000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 31,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 24
                }
            ],
            32: [
                {
                    depositor: "cosmos1user1...",
                    funds: { amount: "190000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 32,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 25
                }
            ],
            33: [
                {
                    depositor: "cosmos1user10...",
                    funds: { amount: "8000000000", denom: "ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293" },
                    proposal_id: 33,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 34
                }
            ],
            34: [],
            35: [
                {
                    depositor: "cosmos1user11...",
                    funds: { amount: "100000000", denom: "ibc/B448C0CA358B958301D328CCDC5D5AD642FC30A6D3AE106FF721DB315F3DDE5C" },
                    proposal_id: 35,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 35
                }
            ],
            36: [],
            37: [],
            38: [],
            39: [
                {
                    depositor: "cosmos1user2...",
                    funds: { amount: "160000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 39,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 26
                },
                {
                    depositor: "cosmos1user5...",
                    funds: { amount: "140000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 39,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 27
                },
                {
                    depositor: "cosmos1user6...",
                    funds: { amount: "120000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 39,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 28
                }
            ],
            40: [
                {
                    depositor: "cosmos1user3...",
                    funds: { amount: "170000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 40,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 29
                },
                {
                    depositor: "cosmos1user4...",
                    funds: { amount: "130000000", denom: "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858" },
                    proposal_id: 40,
                    refunded: false,
                    round_id: 1,
                    tranche_id: 1,
                    tribute_id: 30
                }
            ]
        }
    }
};

export const mockRoundStates: RoundState[] = [
    {
        roundEnd: "1675209599000", // 2023-01-31T23:59:59.000Z
        totalVotingPower: BigInt(20000000), // Max of total_power from tranches in round 0
    },
    {
        roundEnd: "1677628799000", // 2023-02-28T23:59:59.000Z
        totalVotingPower: BigInt(20000000), // Max of total_power from tranches in round 1
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

// export type UserState = {
//     allUserLockups: LockEntry[];
//     expiredUserLockups: LockEntry[];
//     userVote: Vote;
//     userVotingPower: Uint128;
// };
// export interface LockEntry {
//     funds: Coin;
//     lock_end: Timestamp;
//     lock_start: Timestamp;
// }
// export interface Vote {
//     power: Uint128;
//     prop_id: number;
//   }
//   export interface Coin {
//     amount: Uint128;
//     denom: string;
//   }
export const mockVotes: Record<number, VoteWithPower> = {
    0: { // ATOM Tranche
        power: "1000000",
        prop_id: 21
    },
    1: { // USDC Tranche
        power: "500000",
        prop_id: 1
    }
};

export const mockAllLockEntries: LockEntry[] = [
    {
        lock_id: 0,
        funds: {
            amount: "1000000000",
            denom: "uatom"
        },
        lock_start: "1706745600000000000",
        lock_end: "1738281600000000000"
    },
    {
        lock_id: 1,
        funds: {
            amount: "750000000",
            denom: "uatom"
        },
        lock_start: "1714608000000000000",
        lock_end: "1746144000000000000"
    },
    {
        lock_id: 2,
        funds: {
            amount: "500000000",
            denom: "uatom"
        },
        lock_start: "1719878400000000000",
        lock_end: "1751414400000000000"
    },
    {
        lock_id: 3,
        funds: {
            amount: "2000000000",
            denom: "uatom"
        },
        lock_start: "1692662400000000000",
        lock_end: "1708560000000000000"
    },
    {
        lock_id: 4,
        funds: {
            amount: "1500000000",
            denom: "uatom"
        },
        lock_start: "1700006400000000000",
        lock_end: "1715904000000000000"
    }
];

export const mockExpiredLockEntries: LockEntry[] = [
    {
        lock_id: 0,
        funds: {
            amount: "2000000000",
            denom: "uatom"
        },
        lock_start: "2023-08-22T00:00:00Z",
        lock_end: "2024-02-22T00:00:00Z"
    },
    {
        lock_id: 1,
        funds: {
            amount: "1500000000",
            denom: "uatom"
        },
        lock_start: "2023-11-15T00:00:00Z",
        lock_end: "2024-05-15T00:00:00Z"
    }
];
