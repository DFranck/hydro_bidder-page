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
        $proposals: [
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 25,
            title: "[Dummy] Stride: stATOM Liquidity on Osmosis",
            description: "Description goes here",
            power: "2175080268",
            percentage: "0",
            deployment_duration: 3,
            minimum_atom_liquidity_request: "0",
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 26,
            title: "[Dummy] Nolus Liquidity Provision ATOM LP",
            description: "Description goes here",
            power: "74969975",
            percentage: "0",
            deployment_duration: 3,
            minimum_atom_liquidity_request: "0",
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 27,
            title: "[Dummy] Neptune x Drop: nATOM/dATOM LP on Injective",
            description: "Description goes here",
            power: "0",
            percentage: "0",
            deployment_duration: 3,
            minimum_atom_liquidity_request: "0",
          },
        ],
        round_id: 3,
        tranches: [
          {
            id: 1,
            name: "ATOM Bucket",
            metadata: "A bucket of ATOM to deploy as PoL",
          },
        ],
        $tributes: [
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 25,
            tribute_id: 38,
            depositor: "neutron1gy3e7pyuzcmnm33pgvhnpwvch8u88vu6v4t6z8",
            funds: {
              denom:
                "ibc/3552CECB7BCE1891DB6070D37EC6E954C972B1400141308FCD85FD148BD06DE5",
              amount: "1000000",
            },
            refunded: false,
            creation_time: "1739309811696371320",
            creation_round: 3,
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 25,
            tribute_id: 39,
            depositor: "neutron1gy3e7pyuzcmnm33pgvhnpwvch8u88vu6v4t6z8",
            funds: {
              denom:
                "ibc/3552CECB7BCE1891DB6070D37EC6E954C972B1400141308FCD85FD148BD06DE5",
              amount: "4000000000",
            },
            refunded: false,
            creation_time: "1739317394779134274",
            creation_round: 3,
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 25,
            tribute_id: 41,
            depositor: "neutron16s9lqwxpx3v37pktkf0tly5gntj9fpny5h6kuc",
            funds: {
              denom: "untrn",
              amount: "1000000",
            },
            refunded: false,
            creation_time: "1740155024370889473",
            creation_round: 3,
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 25,
            tribute_id: 42,
            depositor: "neutron16s9lqwxpx3v37pktkf0tly5gntj9fpny5h6kuc",
            funds: {
              denom: "untrn",
              amount: "1000000",
            },
            refunded: false,
            creation_time: "1740155295750541784",
            creation_round: 3,
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 26,
            tribute_id: 40,
            depositor: "neutron17rjgmry3w2xcc8yer4h4m8vuypkhkh8ht7967w",
            funds: {
              denom:
                "ibc/6C9E6701AC217C0FC7D74B0F7A6265B9B4E3C3CDA6E80AADE5F950A8F52F9972",
              amount: "13000000000",
            },
            refunded: false,
            creation_time: "1739439112941028482",
            creation_round: 3,
          },
          {
            round_id: 3,
            tranche_id: 1,
            proposal_id: 27,
            tribute_id: 43,
            depositor: "neutron1zy40vjpanekhn575430glyhjlysqp38k3spv0q",
            funds: {
              denom:
                "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
              amount: "290000000",
            },
            refunded: false,
            creation_time: "1740357060253549211",
            creation_round: 3,
          },
        ],
      },
      externalData: {
        $bidDescriptionsByBidId: {
          "25": {
            title: "[Dummy] Stride: stATOM Liquidity on Osmosis",
            projectLogoUrl: "/images/logo-stride.png",
            aboutProject:
              "Stride is the largest liquid staking provider in the Cosmos ecosystem, supporting 16 host-zones and over $100 million in total value locked.",
            description:
              "### Use case\n\nProvision of stATOM / ATOM liquidity on Osmosis in pool 1283.",
            projectName: "Stride",
            projectUrl: "https://www.stride.zone/",
            committeeComments:
              "For the Osmosis LP deployment, the requested amount will proceed under the condition that Hydro's share does not exceed 50% of the pool.",
            requestAmount: [[100000, "ATOM"]],
            minMaxTargetPolApr: [1, 5],
          },
          "26": {
            title: "[Dummy] Nolus Liquidity Provision ATOM LP",
            projectLogoUrl: "/images/logo-nolus.png",
            aboutProject:
              "Nolus Protocol is a Web3 financial suite that offers an innovative approach to money markets with a novel Lease solution to develop the DeFi space further.",
            description:
              "### Use case\n\nUtilizing ATOM to provide loans to borrowers aiming to leverage their equity and entering short positions.",
            projectName: "Nolus",
            projectUrl: "https://nolus.io/",
            committeeComments:
              "The single-sided asset liquidity pool design in Nolus protocol will not be subjected to impermanent loss.",
            requestAmount: [[5000, "ATOM"]],
            minMaxTargetPolApr: [6.5, 6.5],
          },
          "27": {
            title: "[Dummy] Neptune x Drop: nATOM/dATOM LP on Injective",
            projectLogoUrl: "/images/logo-neptune.png",
            aboutProject:
              "Neptune Finance is a next-generation credit network and high-yield lending protocol designed to provide unmatched capital efficiency for lenders, borrowers, and builders.",
            description:
              "### Use case\n\nATOM liquidity will be used in a strategic partnership between Drop and Neptune to bootstrap liquidity requirements for listing dATOM on Neptune.",
            projectName: "Neptune Finance",
            projectUrl: "https://nept.finance/",
            committeeComments:
              "The project currently holds approximately 30K ATOMs in deposits.",
            requestAmount: [[10000, "ATOM"]],
            minMaxTargetPolApr: [2.1, 7.5],
          },
        },
        $numiaBids: [
          {
            round: "3",
            tranche: 1,
            project: "Stride",
            project_url: "https://www.stride.zone/",
            project_logo_url: "/images/logo-stride.png",
            project_about:
              "Stride is the largest liquid staking provider in the Cosmos ecosystem, supporting 16 host-zones and over $100 million in total value locked. Stride handles liquid staking operations on its own sovereign appchain, secured by the Cosmos Hub via Interchain Security. Stride LSTs allow users to unlock the full value of their staked assets. By staking with Stride, stakers receive a fungible token (stToken) that allows them to use their assets in DeFi while simultaneously earning staking rewards. This innovative feature makes Stride LSTs some of the most prominent and compelling collateral assets in the Cosmos ecosystem, with over $40 million in TVL deployed across DeFi protocols in Cosmos and beyond.",
            id: "25",
            title: "Stride: stATOM Liquidity on Osmosis",
            description:
              "### Use case\n\nProvision of stATOM / ATOM liquidity on Osmosis in pool 1283. The liquidity will be maintained for 3 months.\n\n### Duration, Tribute, Yield & Target\n\nThe tribute will be paid in STRD. The liquidity target is 100,000 ATOM to be deployed to Osmosis. The range will be set wide to accommodate the extended time period. The estimated APR for this range is 1-5%.\n\n### Risk mitigation\n\nThe Osmosis LP deployment will proceed with the requested amount, provided Hydro's share remains capped at a maximum of 50% of the pool. This is an increase from our prior.\n\n### Security\n\nThe Stride source code is open-source and can be found [here](https://github.com/Stride-Labs/stride). The Stride codebase is audited regularly by Informal Systems and has been audited by other security firms, including Oak Security. You can find more information on Stride’s security practices [here](https://www.stride.zone/security). Stride’s documentation can be found [here](https://docs.stride.zone/).\n\nOsmosis is also open source/source available, and the codebase can be found below [here](https://github.com/osmosis-labs/osmosis).\n\nEmergency security contact has been provided to the hydro committee.\n\n### Monitoring\n\nThe committee may monitor the position using the Osmosis UI found [here](https://app.osmosis.zone/pool/1283).\n\nOur venue queries can be viewed [here](https://hackmd.io/@XcVbaDPzSDaZ2crWZ2_smw/r1I5-pROJl).\n\n### Deployment\n\nLiquidity to be deployed to the stATOM / ATOM concentrated liquidity pool on Osmosis (Pool ID: 1283).  \\\n\\\nPool address: osmo1z0j6zm4ndmwl27kekla8un73nfu8rh5dhfg2957yr0kg3uumd9rs9sv5kq\n\nThe concentrated liquidity range is to be set as follows:\n\n* Upper bound: 10% above the stATOM redemption rate at the time the position is deployed\n* Lower bound: 5% below the stATOM redemption rate at the time the position is deployed\n\nOur deployment example transactions can be viewed [here](https://hackmd.io/@XcVbaDPzSDaZ2crWZ2_smw/r1I5-pROJl).",
            comments:
              "For the Osmosis LP deployment, the requested amount will proceed under the condition that Hydro's share does not exceed 50% of the pool. If this threshold is reached, the committee will periodically review the allocation, adjusting by adding or removing liquidity to maintain the target balance.",
            requested_allocation_denom: "ATOM",
            requested_allocation_amount: 100000,
            onchain_tribute_assets:
              '[{"amount":2.0,"denom":"NTRN"},{"amount":4001.0,"denom":"STRD"}]',
            onchain_tribute_usdc: 980.801735512264,
            offchain_tribute: '[{"amount":0,"type":""}]',
            offchain_tribute_info: "",
            voters: 8,
            voting_power: 1250.0545109999998,
            status: "Voting",
            initial_allocation_amount: 0,
            current_allocation_amount: 0,
            duration_days: undefined,
            yield: 0,
            apr: 0,
          },
          {
            round: "3",
            tranche: 1,
            project: "Nolus",
            project_url: "https://nolus.io/",
            project_logo_url: "/images/logo-nolus.png",
            project_about:
              "Nolus Protocol is a Web3 financial suite that offers an innovative approach to money markets with a novel Lease solution to develop the DeFi space further. The DeFi Lease defines a money market between lenders looking to earn yield on stablecoins, and borrowers, looking to borrow more digital assets than their current equity. To borrow assets, the borrower locks up a down payment as collateral and can leverage their holdings in a preferred digital asset.",
            id: "26",
            title: "Nolus Liquidity Provision ATOM LP",
            description:
              "### Use case\n\nUtilizing ATOM to provide loans to borrowers aiming to leverage their equity and entering short positions. Borrowers on Nolus provide a deposit (down payment) in the form of a supported asset and they can borrow up to 150% of that deposit’s value from the ATOM lending pool. The loan is denominated in ATOM and has a fixed interest rate. Both the deposit and the loan get transferred over to a supported network, in this case, Osmosis, and get swapped to USDC on the native decentralized exchange there, essentially shorting ATOM. This means that if the value of ATOM decreases, borrowers need less USDC to pay back their ATOM-denominated debt and they can keep the rest as profit. If the value of ATOM increases, the position may face partial liquidation(s) where a portion of the position would get swapped back to ATOM to pay back the lenders.\n\n### Duration, Tribute, Yield & Target\n\nThe tribute will be paid in NLS tokens. The PoL target is 5,000 ATOM. The deployment duration will be 3 months. The Annual Percentage Yield (APY) is projected to range around 6.5% at optimal utilization thresholds (70%) and is paid out in ATOM from the interest borrowers pay to lenders. There is no manual claiming of rewards, rewards are accrued to the position, so the withdrawable amount increases as time passes. The utilization levels can be monitored [here](https://app.nolus.io/stats).\n\n### Risk Mitigation\n\nBoth the deposit and the loan in ATOM are swapped for USDC. The total amount acts as collateral for the position. A maximum 66% Loan-to-Value (LTV) ratio has been established as a safety precaution. Some borrowers may decide to have a lower initial LTV for their positions. A key advantage of the Nolus Protocol is its unique design of single-asset liquidity pools. Liquidity provided within these pools will not be subject to impermanent loss or traded against borrowers. This design ensures that the lent liquidity remains secure.\n\n### Security\n\nThe Nolus Protocol code is open-source and is available [here](https://github.com/nolus-protocol). Oak Security and Halborn audit the current on-chain code, and their audits can be found [here](https://hub.nolus.io/en/articles/9680739-security). The documentation for the Nolus protocol can be found [here](https://hub.nolus.io/en/collections/10034429-tech-documentation).\n\nEmergency security contact has been provided to the hydro committee.\n\n### Monitoring\n\nThe committee may monitor the position using the Nolus dApp UI found [here](https://app.nolus.io/earn).\n\nOur venue queries can be viewed [here](https://hackmd.io/Vz5ts3lUSSaND7m2WwBcMQ).\n\n### Deployment\n\nnolus1u0zt8x3mkver0447glfupz9lz6wnt62j70p5fhhtu3fr46gcdd9s5dz9l6 - ATOM lending pool\n\nOur deployment example transactions can be viewed [here](https://hackmd.io/Vz5ts3lUSSaND7m2WwBcMQ).",
            comments:
              "The single-sided asset liquidity pool design in Nolus protocol will not be subjected to impermanent loss. Having a cap of 66% Loan-to-Value (LTV) ratio follows the committee guidelines for liquidity exports.",
            requested_allocation_denom: "ATOM",
            requested_allocation_amount: 5000,
            onchain_tribute_assets: '[{"amount":13000.0,"denom":"NLS"}]',
            onchain_tribute_usdc: 90.75774749592453,
            offchain_tribute: '[{"amount":0,"type":""}]',
            offchain_tribute_info: "",
            voters: 2,
            voting_power: 250.000999,
            status: "Voting",
            initial_allocation_amount: 0,
            current_allocation_amount: 0,
            duration_days: null,
            yield: 0,
            apr: 0,
          },
          {
            round: "3",
            tranche: 1,
            project: "Neptune Finance",
            project_url: "https://nept.finance/",
            project_logo_url: "/images/logo-neptune.png",
            project_about:
              "Neptune Finance is a next-generation credit network and high-yield lending protocol designed to provide unmatched capital efficiency for lenders, borrowers, and builders. Neptune rates lead the market by dynamically shifting to encourage borrowing and ultimately deliver a narrower spread between lend and borrow rates, constantly calibrating to the most competitive rate. Using DeFi modularity, Neptune’s lend receipt tokens (or nAssets) can be reused in other protocols such as Pryzm and Astroport.",
            id: "27",
            title: "Neptune x Drop: nATOM/dATOM LP on Injective",
            description:
              "### Use case\n\nATOM liquidity will be used in a strategic partnership between Drop and Neptune to bootstrap liquidity requirements for listing dATOM on Neptune. This will mark the first ATOM LST deployment on the Injective chain, and the second LST listing on Neptune after hINJ.\n\nOnce requirements are met, dATOM will be enabled as a yield-bearing collateral asset on Neptune, allowing users to borrow against it in cross-margin accounts. Supporting this deployment, an nATOM/dATOM pair will be seeded on Astroport Injective to be used as a liquidation route and as a yield-farming opportunity for ATOM on Injective.\n\nFirst, ATOM liquidity will be deposited in [Neptune Lend](https://app.nept.finance/lend/), which can be borrowed by third parties with over-collateralized positions to generate returns from the cost of borrowing. Deposits mint nATOM, the yield-bearing receipt token.\n\nSecond, a maximum of 5,000 nATOM will be used to seed the nATOM/dATOM LP on Astroport, with the other half provided by Drop as dATOM for a total of 10,000 ATOM.\n\nWe intend to grow nATOM/dATOM liquidity through different incentive mechanisms in the coming months in order to meet the dATOM listing requirements. This Hydro bid marks the first step towards achieving that goal.\n\n### Duration, Tribute, Yield & Target\n\nThe tribute will be paid in USDC. In this pilot phase, the PoL target is 10,000 ATOM. The deployment duration will be 3 months. The historic 30-day average return for ATOM lending is between 2.1% and 7.50% APY. nATOM deposited on Astroport in the nATOM/dATOM LP will earn additional yield based on swap fees.\n\n### Risk mitigation\n\nThe target PoL will account for roughly 40% of the lending pool. Should ATOM loans exceed past target utilization levels, the dynamic Neptune interest rate model will increase exponentially and incentivize the return of loans.\n\nThe committee will also hold the nATOM receipt token for their deposit position and can trade it on the open market if needed.\n\n### Security\n\nOak Security has audited Neptune Finance; the audit can be found [here](https://github.com/oak-security/audit-reports/tree/master/Neptune).  \nNeptune’s docs can be found [here](https://docs.nept.finance/).\n\nEmergency security contact has been provided to the Hydro committee.\n\n### Monitoring\n\nThe committee may monitor the performance of ATOM lending via the Neptune lending [page](https://app.nept.finance/asset-details/?denom=ibc%2FC4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9) and the nATOM/dATOM pool on Astroport UI [here](https://app.astroport.fi/pools/inj18ucwme9nyemev9cjhy6jtagtu4laxh7ztzeqqc).\n\nOur venue queries can be viewed [here](https://hackmd.io/@jwEKz2IPTTqH3U9DC2aZ3A/BkShOvGc1x).\n\n### Deployment\n\nNeptune Money Market Contract:  \nInj1nc7gjkf2mhp34a6gquhurg8qahnw5kxs5u3s4u\n\nAstroport nATOM/dATOM Contract:  \ninj18ucwme9nyemev9cjhy6jtagtu4laxh7ztzeqqc\n\nOur deployment example transaction can be viewed [here](https://explorer.injective.network/transaction/50720C355D377BB175F4CDE7004CBF90453854D0DCDF37C5FEC240A112C84221/) and [here](https://explorer.injective.network/transaction/B0AFFB880DCAA2FAD22A0536D110F1D47D9C27DD26A8D4CEC74DB85615185D82/).",
            comments:
              "The project currently holds approximately 30K ATOMs in deposits. To prevent disrupting natural market dynamics and an excessive dilution of rewards, we propose a bid limit set at 50% of overall shares, similar to other participants. Based on these figures, we recommend capping the liquidity deployment to 30K ATOMs. As protocol utilization increases, we can consider introducing larger tranches in future bidding rounds. \n\nRegarding the nATOM/dATOM liquidity provision, the committee has agreed to set an initial cap of 10,000 ATOMs corresponding to this bid expectation due to the complex risk structure involved. It, therefore, allows for a quick deployment without extensively compromising community funds. This cap is temporarily set, waiting on a more thorough review by the committee, upon which the cap will be adjusted to allow the deposits to scale.",
            requested_allocation_denom: "ATOM",
            requested_allocation_amount: 10000,
            onchain_tribute_assets: '[{"amount":290.0,"denom":"USDC"}]',
            onchain_tribute_usdc: 290.4546963086505,
            offchain_tribute: '[{"amount":0,"type":""}]',
            offchain_tribute_info: "",
            voters: 0,
            voting_power: 0,
            status: "Voting",
            initial_allocation_amount: 0,
            current_allocation_amount: 0,
            duration_days: null,
            yield: 0,
            apr: 0,
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
