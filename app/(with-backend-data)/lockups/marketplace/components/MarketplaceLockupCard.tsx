import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { twMerge } from "tailwind-merge"
import LockupActionCardValue from "../../actions/components/LockupActionCardValue"
import { LockupImage } from "../../actions/components/LockupImage"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { MarketplaceLockup } from "../types"
import { getLockupStatus } from "../utils/getLockupStatus"
import { isListedMarketplaceLockup } from "../utils/isListedMarketplaceLockup"
import MarketplaceLockupCardEligibility from "./MarketplaceLockupCardEligibility"
import MarketplaceLockupCardRewards from "./MarketplaceLockupCardRewards"
import { Crown } from "lucide-react"

export default function MarketplaceLockupCard({
  lockup,
  isMine,
}: {
  lockup: MarketplaceLockup
  isMine?: boolean
}) {
  const isExpired = lockup.isExpired
  const isListed = isListedMarketplaceLockup(lockup)
  return (
    <div
      className={twMerge(
        " box-border grid max-w-[358.5px] cursor-pointer grid-cols-2 rounded-2xl border-2 backdrop-blur-sm",
        isListed ? "border-palette-green" : "border-transparent"
      )}
    >
      <div
        className={twMerge(
          "relative",
          isListed ? "h-[198px] w-[198px]" : "h-[200px] w-[200px]"
        )}
      >
        <LockupImage lockup={lockup} />
        {isMine && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-palette-green/90 rounded-full px-2 py-1 text-xs text-black italic shadow-lg">
              <Crown className="size-3" />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between gap-[2px]">
        <LockupActionCardValue
          className="flex-1 rounded-tr-xl bg-gradient-to-r from-white/0 to-white/30 text-white"
          rightContent={
            <StyledText
              as="div"
              tooltip={
                <StyledText as={"h5"} className={`font-bold uppercase`}>
                  lock duration
                </StyledText>
              }
            >
              {isExpired ? "Expired" : lockup.daysLeft + " days"}
              <Icon name="clock" className="ml-2" />
            </StyledText>
          }
        />
        <MarketplaceLockupCardEligibility lockup={lockup} />
        <MarketplaceLockupCardRewards lockup={lockup} />
        <LockupActionCardValue
          className={`rounded-br-xl ${getLockupStatus(lockup) === "for-sale" && !isMine ? "from-palette-green/0 to-palette-green/20 text-palette-green" : "text-palette-beige"}   flex-1 `}
          rightContent={
            <StyledText
              as="div"
              tooltip={
                getLockupStatus(lockup) === "for-sale" ? (
                  <StyledText as={"h5"} className={`font-bold uppercase`}>
                    Sale price
                  </StyledText>
                ) : undefined
              }
            >
              <span className="font-inter space-x-1 text-[10px] font-bold uppercase">
                {getLockupStatus(lockup) === "for-sale" ? (
                  <>
                    <span className="text-base">
                      {formatDenomAmount(
                        lockup.listing.price.amount,
                        getDenomExponent(lockup.listing.price.denom)
                      )}
                    </span>{" "}
                    <span className=" opacity-60">
                      {getDisplayDenom(lockup.listing.price.denom)}
                    </span>
                  </>
                ) : (
                  "Not For Sale"
                )}
              </span>
              {isMine && isListed ? (
                <Icon
                  name="light:ellipsis-vertical"
                  className="text-palette-beige ml-1"
                />
              ) : getLockupStatus(lockup) === "for-sale" ? (
                <Icon
                  name="solid:tags"
                  className="text-palette-green ml-2 text-base"
                />
              ) : (
                <Icon
                  name="light:ban"
                  className="text-palette-beige ml-2 text-base"
                />
              )}
            </StyledText>
          }
        />
      </div>
    </div>
  )
}
