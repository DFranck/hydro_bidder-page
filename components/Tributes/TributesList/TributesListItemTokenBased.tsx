import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { getFormatedDateFromNanos } from "@/lib/getFormatedDateFromNanos"

export function TributesListItemTokenBased({
  tribute,
}: {
  tribute: SanitizedTokenBasedTribute
}) {
  return (
    <div className="flex flex-wrap items-center">
      <StyledText className="mr-4">
        {getFormatedDateFromNanos(tribute.creationTime)}
      </StyledText>
      <StyledText
        as="div"
        className="max-w-[calc(100vw-10rem)] flex-grow overflow-hidden truncate whitespace-nowrap text-start md:max-w-full"
      >
        {tribute.depositor}
      </StyledText>
      <div className="flex flex-row items-end gap-2 text-lg font-bold text-palette-green">
        <span>{tribute.amount}</span>
        <Tooltip
          tipContents={
            <div className="break-words">{tribute.denomOriginal}</div>
          }
        >
          <span>{tribute.denom}</span>
        </Tooltip>
        <span>(${tribute.valueUsd.toFixed(2)})</span>
      </div>
    </div>
  )
}
