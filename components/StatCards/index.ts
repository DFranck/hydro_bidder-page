import { StatCards as BaseStatCards } from "./StatCards"
import { AllTimeAprGlobal } from "./cards/AllTimeAprGlobal"
import { AllTimeAprWallet } from "./cards/AllTimeAprWallet"
import { AllTimeAverageAtomLockedPerWallet } from "./cards/AllTimeAverageAtomLockedPerWallet"
import { AllTimeAverageRoundsPerWallet } from "./cards/AllTimeAverageRoundsPerWallet"
import { AllTimeRewardsWallet } from "./cards/AllTimeRewardsWallet"
import { CurrentRoundAprGlobal } from "./cards/CurrentRoundAprGlobal"
import { CurrentRoundAprWallet } from "./cards/CurrentRoundAprWallet"
import { CurrentRoundAtomLockedGlobal } from "./cards/CurrentRoundAtomLockedGlobal"
import { CurrentRoundAtomLockedWallet } from "./cards/CurrentRoundAtomLockedWallet"
import { CurrentRoundNumberOfBids } from "./cards/CurrentRoundNumberOfBids"
import { CurrentRoundPoLAvailable } from "./cards/CurrentRoundPoLAvailable"
import { CurrentRoundPoLDeployed } from "./cards/CurrentRoundPoLDeployed"
import { CurrentRoundPoLRevenue } from "./cards/CurrentRoundPoLRevenue"
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
  CurrentRoundPoLDeployed,
  CurrentRoundPoLRevenue,
  CurrentRoundAtomLockedGlobal,
  CurrentRoundNumberOfBids,
  CurrentRoundAprWallet,
  AllTimeAprWallet,
  CurrentRoundAtomLockedWallet,
  AllTimeRewardsWallet,
  CurrentRoundVotingPowerWallet,
})

export { StatCards }
