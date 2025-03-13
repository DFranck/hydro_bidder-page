import { EmptyBox } from "@/components/EmptyBox"
import { StyledText } from "@/components/StyledText"
import {
  SanitizedPointBasedTribute,
  SanitizedTokenBasedTribute,
} from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescriptionFromGithub } from "@/contract-apis/fetchBidDescriptions"
import { Fragment } from "react"
import { twJoin } from "tailwind-merge"
import { TributesListItemPointBased } from "./TributesListItemPointBased"
import { TributesListItemTokenBased } from "./TributesListItemTokenBased"

interface TributesListProps {
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
  bidDescription?: BidDescriptionFromGithub
}

export function TributesList({ tributes, bidDescription }: TributesListProps) {
  return (
    <div className={twJoin("grid grid-cols-[max-content_auto_min-content]")}>
      {tributes.length === 0 && (
        <EmptyBox className="col-span-3">
          <StyledText variant="label">No tributes on this bid</StyledText>
        </EmptyBox>
      )}

      {tributes.map((tribute, index) => (
        <Fragment key={index}>
          {tribute.isTokenBased ? (
            <TributesListItemTokenBased
              tribute={tribute as SanitizedTokenBasedTribute}
              className={twJoin(
                tributes.length >= 3 && [
                  "odd:bg-palette-green/5",
                  "odd:rounded-sm",
                ]
              )}
            />
          ) : (
            <TributesListItemPointBased
              tribute={tribute as SanitizedPointBasedTribute}
              description={bidDescription}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}
