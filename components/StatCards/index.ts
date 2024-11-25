import { StatCards as BaseStatCards } from "./StatCards"
import { AverageAPR } from "./cards/AverageAPR"
import { AverageATOMLockedPerWallet } from "./cards/AverageATOMLockedPerWallet"
import { AverageRoundsPerUser } from "./cards/AverageRoundsPerUser"
import { DaysRemaining } from "./cards/DaysRemaining"
import { HistoricalAPR } from "./cards/HistoricalAPR"
import { NumberOfUniqueWallets } from "./cards/NumberOfUniqueWallets"
import { PoLAvailable } from "./cards/PoLAvailable"
import { PoLDeployed } from "./cards/PoLDeployed"
import { PoLRevenue } from "./cards/PoLRevenue"
import { TotalATOMLocked } from "./cards/TotalATOMLocked"
import { TotalTributes } from "./cards/TotalTributes"
import { YourAPRCurrentRound } from "./cards/YourAPRCurrentRound"
import { YourAPRHistorical } from "./cards/YourAPRHistorical"
import { YourTotalATOMLocked } from "./cards/YourTotalATOMLocked"
import { YourTotalRewardsValue } from "./cards/YourTotalRewardsValue"
import { YourVotingPower } from "./cards/YourVotingPower"

const StatCards = Object.assign(BaseStatCards, {
  AverageAPR,
  AverageATOMLockedPerWallet,
  AverageRoundsPerUser,
  DaysRemaining,
  HistoricalAPR,
  NumberOfUniqueWallets,
  PoLAvailable,
  PoLDeployed,
  PoLRevenue,
  TotalATOMLocked,
  TotalTributes,
  YourAPRCurrentRound,
  YourAPRHistorical,
  YourTotalATOMLocked,
  YourTotalRewardsValue,
  YourVotingPower,
})

export { StatCards }
