import { StatCards as BaseStatCards } from "./StatCards"
import { AverageAPR } from "./cards/AverageAPR"
import { DaysRemaining } from "./cards/DaysRemaining"
import { HistoricalAPR } from "./cards/HistoricalAPR"
import { PoLAvailable } from "./cards/PoLAvailable"
import { PoLDeployed } from "./cards/PoLDeployed"
import { TotalATOMLocked } from "./cards/TotalATOMLocked"
import { TotalTributes } from "./cards/TotalTributes"
import { YourAPRCurrentRound } from "./cards/YourAPRCurrentRound"
import { YourAPRHistorical } from "./cards/YourAPRHistorical"
import { YourTotalATOMLocked } from "./cards/YourTotalATOMLocked"
import { YourTotalRewardsValue } from "./cards/YourTotalRewardsValue"
import { YourVotingPower } from "./cards/YourVotingPower"

const StatCards = Object.assign(BaseStatCards, {
  AverageAPR,
  DaysRemaining,
  HistoricalAPR,
  PoLAvailable,
  PoLDeployed,
  TotalATOMLocked,
  TotalTributes,
  YourAPRCurrentRound,
  YourAPRHistorical,
  YourTotalATOMLocked,
  YourTotalRewardsValue,
  YourVotingPower,
})

export { StatCards }
