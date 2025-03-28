import { EmptyBox } from "@/components/EmptyBox"
import { StyledText } from "@/components/StyledText"
import { BidMetaDataSlimmed, TokenBasedTribute } from "@/contract-apis/types"
import { twJoin } from "tailwind-merge"
import { TributesListItemPointBased } from "./TributesListItemPointBased"
import { TributesListItemTokenBased } from "./TributesListItemTokenBased"

interface TributesListProps {
  tokenBasedTributes: TokenBasedTribute[]
  pointBasedTributes: [amount: number, denom: string] | []
  bidDescription?: BidMetaDataSlimmed
}

export function TributesList({
  tokenBasedTributes,
  pointBasedTributes,
  bidDescription,
}: TributesListProps) {
  return (
    <div className={twJoin("grid grid-cols-[max-content_auto_min-content]")}>
      {tokenBasedTributes.length === 0 && pointBasedTributes.length === 0 && (
        <EmptyBox className="col-span-3">
          <StyledText variant="label">No tributes on this bid</StyledText>
        </EmptyBox>
      )}

      {tokenBasedTributes.map((tribute, index) => (
        <TributesListItemTokenBased
          key={`token_based_${index}`}
          tribute={tribute as TokenBasedTribute}
          className={twJoin(
            tokenBasedTributes.length >= 3 && [
              "odd:bg-palette-green/5",
              "odd:rounded-sm",
            ]
          )}
        />
      ))}
      {pointBasedTributes &&
        pointBasedTributes.length > 0 &&
        pointBasedTributes[0] &&
        pointBasedTributes[1] && (
          <TributesListItemPointBased
            amount={pointBasedTributes[0]}
            denom={pointBasedTributes[1]}
            description={bidDescription}
          />
        )}
    </div>
  )
}
