import { ContentContainer } from "@/components/ContentContainer"
import { Children, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { AverageAPR } from "./cards/AverageAPR"
import { DaysRemaining } from "./cards/DaysRemaining"
import { HistoricalAPR } from "./cards/HistoricalAPR"
import { TotalATOMLocked } from "./cards/TotalATOMLocked"
import { YourTotalATOMLocked } from "./cards/YourTotalATOMLocked"
import { YourVotingPower } from "./cards/YourVotingPower"

export function StatCards({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const childCount = Children.count(children)
  return (
    <div
      className={twMerge(
        `
          bg-gradient-to-t
          from-palette-blue/80
          to-palette-blue/20
          backdrop-blur-sm
        `,
        className
      )}
    >
      <ContentContainer
        className={twMerge(
          `
            grid
            grid-cols-1
            items-center
            justify-center
            gap-4
          `,
          childCount % 2 === 0
            ? "sm:grid-cols-2"
            : childCount > 2
              ? "md:grid-cols-3"
              : ""
        )}
      >
        {children}
      </ContentContainer>
    </div>
  )
}

StatCards.AverageAPR = AverageAPR
StatCards.DaysRemaining = DaysRemaining
StatCards.HistoricalAPR = HistoricalAPR
StatCards.TotalATOMLocked = TotalATOMLocked
StatCards.YourTotalATOMLocked = YourTotalATOMLocked
StatCards.YourVotingPower = YourVotingPower
