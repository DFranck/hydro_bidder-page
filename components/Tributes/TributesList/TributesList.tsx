import {
  SanitizedPointBasedTribute,
  SanitizedTokenBasedTribute,
} from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescriptionFromGithub } from "@/contract-apis/fetchBidDescriptions"
import { TributesListItemPointBased } from "./TributesListItemPointBased"
import { TributesListItemTokenBased } from "./TributesListItemTokenBased"

interface TributesListProps {
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
  bidDescription?: BidDescriptionFromGithub
}

export function TributesList({ tributes, bidDescription }: TributesListProps) {
  return (
    <div className="flex flex-col gap-2">
      {tributes.map((tribute, index) => (
        <div key={index}>
          {tribute.isTokenBased ? (
            <TributesListItemTokenBased
              tribute={tribute as SanitizedTokenBasedTribute}
            />
          ) : (
            <TributesListItemPointBased
              tribute={tribute as SanitizedPointBasedTribute}
              description={bidDescription}
            />
          )}
        </div>
      ))}
    </div>
  )
}
