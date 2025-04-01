import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { TokenBasedTribute } from "@/contract-apis/types"
import { getFormatedDateFromNanos } from "@/lib/getFormatedDateFromNanos"
import { twJoin, twMerge } from "tailwind-merge"

export function TributesListItemTokenBased({
  tribute,
  className,
}: {
  tribute: TokenBasedTribute
  className?: string
}) {
  return (
    <div
      className={twMerge(
        "col-span-3 grid grid-cols-subgrid items-center gap-6",
        "px-6 py-3",
        "rounded-sm",
        className
      )}
    >
      <StyledText variant="label">
        {getFormatedDateFromNanos(tribute.creationTime)}
      </StyledText>

      <code className="break-all">{tribute.depositor}</code>

      <StyledText
        variant="h4"
        className={twJoin("flex items-center gap-1", "text-palette-green")}
      >
        <span>{tribute.amount}</span>

        <Tooltip
          tipContents={
            <div className="break-words">{tribute.denomOriginal}</div>
          }
        >
          <span className="border-b-2 border-dotted border-palette-green">
            {tribute.denom}
          </span>
        </Tooltip>

        <span>(${tribute.valueUsd.toFixed(2)})</span>
      </StyledText>
    </div>
  )
}
