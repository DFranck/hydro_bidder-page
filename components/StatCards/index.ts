import { StatCards as BaseStatCards } from "./StatCards"
import { AllTimeAprGlobal } from "./cards/AllTimeAprGlobal"
import { AllTimeAprWallet } from "./cards/AllTimeAprWallet"
import { AllTimeAverageAtomLockedPerWallet } from "./cards/AllTimeAverageAtomLockedPerWallet"
import { AllTimeAverageRoundsPerWallet } from "./cards/AllTimeAverageRoundsPerWallet"
import { AllTimePoLDeployed } from "./cards/AllTimePoLDeployed"
import { AllTimePoLRevenue } from "./cards/AllTimePoLRevenue"
import { AllTimeRewardsWallet } from "./cards/AllTimeRewardsWallet"
import { CurrentRoundAprGlobal } from "./cards/CurrentRoundAprGlobal"
import { CurrentRoundAprWallet } from "./cards/CurrentRoundAprWallet"
import { CurrentRoundAtomLockedGlobal } from "./cards/CurrentRoundAtomLockedGlobal"
import { CurrentRoundAtomLockedWallet } from "./cards/CurrentRoundAtomLockedWallet"
import { CurrentRoundNumberOfBids } from "./cards/CurrentRoundNumberOfBids"
import { CurrentRoundPoLAvailable } from "./cards/CurrentRoundPoLAvailable"
import { CurrentRoundTimeLeft } from "./cards/CurrentRoundTimeLeft"
import { CurrentRoundUniqueWallets } from "./cards/CurrentRoundUniqueWallets"
import { CurrentRoundVotingPowerWallet } from "./cards/CurrentRoundVotingPowerWallet"

const StatCards = Object.assign(BaseStatCards, {
  CurrentRoundAprGlobal,
  AllTimeAverageAtomLockedPerWallet,
  AllTimeAverageRoundsPerWallet,
  CurrentRoundTimeLeft,
  AllTimeAprGlobal,
  CurrentRoundUniqueWallets,
  CurrentRoundPoLAvailable,
  AllTimePoLDeployed,
  AllTimePoLRevenue,
  CurrentRoundAtomLockedGlobal,
  CurrentRoundNumberOfBids,
  CurrentRoundAprWallet,
  AllTimeAprWallet,
  CurrentRoundAtomLockedWallet,
  AllTimeRewardsWallet,
  CurrentRoundVotingPowerWallet,
})

export { StatCards }
