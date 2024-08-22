import { mockGlobalState, mockRoundStates } from "../mockData";
import { TabLabel } from "./TopModule";

export const topModulesConfig = [
    {
        tab: TabLabel.TRIBUTE,
        title: 'Rewards snapshot',
        description: 'Your ROI on your staked stATOM',
        icon: '/images/Rewards_Light.svg',
        activeIcon: '/images/Rewards_Light-black.svg',
        value: 123,
        valueDescription: 'USDC EQUIVALENT',
        hasRewards: true
    },
    {
        tab: TabLabel.LOCKUPS,
        title: 'Locked stATOM',
        description: 'Your locked stATOM balance',
        icon: '/images/Lock_Light.svg',
        activeIcon: '/images/Lock_Light-black.svg',
        value: mockGlobalState.totalLockedTokens,
        valueDescription: 'IN 3 Lockups'
    },
    {
        tab: TabLabel.VOTING,
        title: 'hATOM Balance',
        description: 'Your current Voting Power',
        icon: '/images/Wallet_Light.svg',
        activeIcon: '/images/Wallet_Light-black.svg',
        value: 456,
        valueDescription: 'until (pull date of soonest lockup)'
    }
]