import { mockGlobalState } from "../../mockData";
import { TabLabel } from "./types";

export const loggedInTopModulesConfig = [
    {
        tab: TabLabel.TRIBUTE,
        title: 'Rewards snapshot',
        description: 'Your ROI on your staked stATOM',
        icon: '/images/Rewards_Light.svg',
        activeIcon: '/images/Rewards_Light-black.svg',
        value: 123,
        valueDescription: 'USDC EQUIVALENT',
        badge: 'Claim Rewards',
        badgeAction: () => undefined
    },
    {
        tab: TabLabel.LOCKUPS,
        title: 'Locked ATOM',
        description: 'Your locked ATOM balance',
        icon: '/images/Lock_Light.svg',
        activeIcon: '/images/Lock_Light-black.svg',
        value: mockGlobalState.totalLockedTokens,
        valueDescription: 'IN 3 Lockups'
    },
    {
        tab: TabLabel.VOTING,
        title: 'Voting Power',
        description: 'Your current Voting Power',
        icon: '/images/Wallet_Light.svg',
        activeIcon: '/images/Wallet_Light-black.svg',
        value: 456,
        valueDescription: 'until (pull date of soonest lockup)',
        badge: 'New Lockup',
        badgeAction: () => undefined
    }
]

export const loggedOutTopModulesConfig = [
    {
        title: 'Current Round Tribute Value',
        value: 12345.67,
        valueDescription: 'USDC EQUIVALENT',
    },
    {
        title: 'Current Round Time Remaining',
        value: '00:10',
        valueDescription: 'DAYS: HOURS'
    },
    {
        title: 'Total Locked\nATOM',
        value: 12345,
        valueDescription: '$1,200,534 USDC Equivalent'
    }
]


export const loggedOutTopModulesConfigProposalView = [
    {
        title: 'Total Platform Rewards',
        value: 12345.67,
        valueDescription: 'USDC EQUIVALENT',
    },
    {
        title: 'Total Locked\nATOM',
        value: 12345,
        valueDescription: ''
    },
    {
        title: 'Total Liquidity Deployed',
        value: 1234567,
        valueDescription: ''
    }
]