import { FC } from "react"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { getFormatedDateFromNanos } from "@/lib/getFormatedDateFromNanos"

interface OwnProps {
  tribute: SanitizedTokenBasedTribute
}

const TributesListItemTokenBased: FC<OwnProps> = ({ tribute }) => {
  return (
    <div className="flex flex-wrap items-center">
      <StyledText className="mr-4">
        {getFormatedDateFromNanos(tribute.creationTime)}
      </StyledText>
      <StyledText as="div" className="flex-grow text-start truncate overflow-hidden max-w-[calc(100vw-10rem)] md:max-w-full whitespace-nowrap">
        {tribute.depositor}
      </StyledText>
      <div className="flex flex-row items-end gap-2 text-lg font-bold text-palette-green">
        <span>{tribute.amount}</span>
        <Tooltip tipContents={<div className="break-words">{tribute.denomOriginal}</div>}>
          <span>{tribute.denom}</span>
        </Tooltip>
        <span>(${tribute.valueUsd.toFixed(2)})</span>
      </div>
    </div>
  )
}

export default TributesListItemTokenBased
