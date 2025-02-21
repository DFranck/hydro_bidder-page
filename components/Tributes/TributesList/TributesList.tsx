import { SanitizedPointBasedTribute, SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BidDescription } from "@/contract-apis/fetchBidDescriptions"
import TributesListItemTokenBased from "@/components/Tributes/TributesList/TributesListItemTokenBased"
import TributesListItemPointBased from "@/components/Tributes/TributesList/TributesListItemPointBased"

interface TributesListProps {
  tributes: (SanitizedTokenBasedTribute | SanitizedPointBasedTribute)[]
  bidDescription?: BidDescription
}

export function TributesList({ tributes, bidDescription }: TributesListProps) {
  return (
    <div className="flex flex-col gap-2">
      {tributes.map((tribute, index) => (
        <div key={index}>
          {tribute.isTokenBased
            ? <TributesListItemTokenBased tribute={tribute as SanitizedTokenBasedTribute} />
            : <TributesListItemPointBased
                tribute={tribute as SanitizedPointBasedTribute}
                description={bidDescription}
              />
          }
        </div>
      ))}
    </div>
  )
}