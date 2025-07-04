import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Ubuntu_Mono } from "next/font/google"
import LockupActionCardValue from "../../actions/components/LockupActionCardValue"
import { getEligibilityIcon } from "../../actions/utils/getEligibilityIcon"
import { getDisplayRoundId } from "../../utils/getDisplayRoundId"
import { MarketplaceLockup } from "../types"

const UbuntuMonoFont = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
})

const MarketplaceLockupCardEligibility = ({
  lockup,
}: {
  lockup: MarketplaceLockup
}) => {
  const { tranches } = useBackendData()

  const statusCounts = tranches.reduce(
    (acc, tranche) => {
      const meta = lockup.metaDataByTrancheId?.[tranche.id]

      if (meta?.isTiedToDeployment) {
        acc.tied += 1
      } else if (meta?.isEligibleToChangeVote) {
        acc.hasVoted += 1
      } else {
        acc.canVote += 1
      }

      return acc
    },
    { tied: 0, hasVoted: 0, canVote: 0 },
  )
  const isSomeTied = statusCounts.tied > 0

  return (
    <LockupActionCardValue
      className="flex-1  bg-gradient-to-r from-white/0 to-white/30 text-white"
      rightContent={
        <StyledText
          as="div"
          tooltip={
            <>
              <StyledText as={"h5"} className={`font-bold uppercase`}>
                Voting Eligibility
              </StyledText>

              <ul
                className={`${UbuntuMonoFont.className} text-[16px] font-normal`}
              >
                {tranches &&
                  tranches.map((tranche) => {
                    const meta = lockup.metaDataByTrancheId[tranche.id]
                    const canVoteToday = !meta.isTiedToDeployment
                    const { icon, color } = getEligibilityIcon(meta)
                    return (
                      <li
                        key={tranche.id}
                        className={`${color} flex items-center justify-between gap-4 whitespace-nowrap`}
                      >
                        <div>
                          {icon}
                          {tranche.name}
                        </div>
                        <StyledText
                          as={"label"}
                          variant="label.meta.faded"
                          className={`line-height-0 h-full whitespace-nowrap font-inter`}
                        >
                          {canVoteToday
                            ? "Can vote today"
                            : "Can vote in round " +
                              getDisplayRoundId(
                                meta.nextRoundEligibleToVote || 0,
                              )}
                        </StyledText>
                      </li>
                    )
                  })}
              </ul>
            </>
          }
          className="flex items-center gap-2 "
        >
          {/* hasVoted */}
          <div className="flex gap-[6px] text-palette-green">
            <span
              className={` font-bold${
                isSomeTied && statusCounts.hasVoted === 0
                  ? " opacity-50"
                  : "opacity-100"
              }`}
            >
              {statusCounts.hasVoted + statusCounts.tied}
            </span>
            <Icon
              name="solid:circle-check"
              className={` ${
                isSomeTied && statusCounts.hasVoted === 0
                  ? " opacity-50"
                  : "opacity-100"
              }`}
            />
          </div>

          {/* canVote */}
          <div className="flex gap-[6px] text-palette-beige">
            <span
              className={` font-bold  ${
                statusCounts.canVote === 0 ? "opacity-50" : "opacity-100"
              }`}
            >
              {statusCounts.canVote}
            </span>
            <Icon
              name="circle-dashed"
              className={` ${
                statusCounts.canVote === 0 ? "opacity-50" : "opacity-100"
              }`}
            />
          </div>
        </StyledText>
      }
    />
  )
}

export default MarketplaceLockupCardEligibility
