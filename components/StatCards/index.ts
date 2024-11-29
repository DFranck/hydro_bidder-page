import { StatCards as BaseStatCards } from "./StatCards"
import { AverageAtomLockedPerWallet } from "./cards/AverageAtomLockedPerWallet"
import { AverageRoundApr } from "./cards/AverageRoundApr"
import { AverageRoundsPerUser } from "./cards/AverageRoundsPerUser"
import { HistoricalApr } from "./cards/HistoricalApr"
import { NumberOfBids } from "./cards/NumberOfBids"
import { NumberOfUniqueWallets } from "./cards/NumberOfUniqueWallets"
import { PoLAvailable } from "./cards/PoLAvailable"
import { PoLDeployed } from "./cards/PoLDeployed"
import { PoLRevenue } from "./cards/PoLRevenue"
import { TimeLeft } from "./cards/TimeLeft"
import { TotalAtomLocked } from "./cards/TotalAtomLocked"
import { YourAprCurrentRound } from "./cards/YourAprCurrentRound"
import { YourAprHistorical } from "./cards/YourAprHistorical"
import { YourTotalAtomLocked } from "./cards/YourTotalAtomLocked"
import { YourTotalRewardsAllTime } from "./cards/YourTotalRewardsAllTime"
import { YourVotingPower } from "./cards/YourVotingPower"

const StatCards = Object.assign(BaseStatCards, {
  AverageRoundApr,
  AverageAtomLockedPerWallet,
  AverageRoundsPerUser,
  TimeLeft,
  HistoricalApr,
  NumberOfUniqueWallets,
  PoLAvailable,
  PoLDeployed,
  PoLRevenue,
  TotalAtomLocked: TotalAtomLocked,
  NumberOfBids,
  YourAprCurrentRound,
  YourAprHistorical,
  YourTotalAtomLocked: YourTotalAtomLocked,
  YourTotalRewardsAllTime,
  YourVotingPower,
})

export { StatCards }
