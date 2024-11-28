import { StatCards as BaseStatCards } from "./StatCards"
import { AverageAtomLockedPerWallet } from "./cards/AverageAtomLockedPerWallet"
import { AverageRoundApr } from "./cards/AverageRoundApr"
import { AverageRoundsPerUser } from "./cards/AverageRoundsPerUser"
import { HistoricalAPR } from "./cards/HistoricalAPR"
import { NumberOfBids } from "./cards/NumberOfBids"
import { NumberOfUniqueWallets } from "./cards/NumberOfUniqueWallets"
import { PoLAvailable } from "./cards/PoLAvailable"
import { PoLDeployed } from "./cards/PoLDeployed"
import { PoLRevenue } from "./cards/PoLRevenue"
import { TimeLeft } from "./cards/TimeLeft"
import { TotalATOMLocked } from "./cards/TotalATOMLocked"
import { YourAPRCurrentRound } from "./cards/YourAPRCurrentRound"
import { YourAPRHistorical } from "./cards/YourAPRHistorical"
import { YourTotalATOMLocked } from "./cards/YourTotalATOMLocked"
import { YourTotalRewardsValue } from "./cards/YourTotalRewardsValue"
import { YourVotingPower } from "./cards/YourVotingPower"

const StatCards = Object.assign(BaseStatCards, {
  AverageAPR: AverageRoundApr,
  AverageATOMLockedPerWallet: AverageAtomLockedPerWallet,
  AverageRoundsPerUser,
  TimeLeft,
  HistoricalAPR,
  NumberOfUniqueWallets,
  PoLAvailable,
  PoLDeployed,
  PoLRevenue,
  TotalATOMLocked,
  NumberOfBids,
  YourAPRCurrentRound,
  YourAPRHistorical,
  YourTotalATOMLocked,
  YourTotalRewardsValue,
  YourVotingPower,
})

export { StatCards }
