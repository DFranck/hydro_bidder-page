import { FullyAugmentedBid } from "@/contract-apis/fetchBackendDataWithAddress"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"

export function BidTributes({ bid }: { bid: FullyAugmentedBid }) {
  return bid.tributes.map((tribute, index) => (
    <p key={index} className="break-words text-xl font-bold not-italic">
      {tribute.isTokenBased ? (
        <span>
          {simplifyBigNumbers(tribute.amount)}&nbsp;
          {tribute.denom}
        </span>
      ) : (
        <span>
          {simplifyBigNumbers(tribute.amount)}&nbsp;
          {tribute.denom}
        </span>
      )}
    </p>
  ))
}
