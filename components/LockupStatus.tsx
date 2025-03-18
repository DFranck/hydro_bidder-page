import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { WordWrapper } from "@/components/WordWrapper"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUntilDate } from "@/lib/getTimeUntilDate"
import { pluralize } from "@/lib/pluralize"
import Link from "next/link"
import { twJoin, twMerge } from "tailwind-merge"

export function LockupStatus({
  lockupId,
  trancheId,
  ...otherProps
}: {
  lockupId: number
  trancheId: number
  [key: string]: any
}) {
  const { bidsById, currentRoundEndDate, lockups, tranches } = useBackendData()

  const lockup = lockups.find((lockup) => lockup.id === lockupId)
  const tranche = tranches.find((tranche) => tranche.id === Number(trancheId))

  if (!lockup || !tranche) {
    return null
  }

  const { isExpired, daysLeft, metaDataByTrancheId } = lockup

  if (isExpired) {
    return (
      <div className="flex gap-3 whitespace-nowrap">
        <Icon name="solid:triangle-exclamation" className="text-palette-red" />

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {Math.abs(daysLeft) === 0
              ? "Expired today"
              : `Expired ${pluralize({
                  count: Math.abs(daysLeft),
                  prefixCount: true,
                  singular: "day",
                })} ago`}
            <Icon name="circle-info" />
          </div>
          <StyledText variant="footnote">
            You can refresh this lockup, or unlock it
          </StyledText>
        </div>
      </div>
    )
  }

  const metadata = metaDataByTrancheId[trancheId]

  const {
    isTiedToDeployment,
    numRoundsLeftOnDeployment,
    votedOnBidId,
    isEligibleToChangeVote,
  } = metadata

  const votedOnBid = votedOnBidId ? bidsById[votedOnBidId] : null

  if (isTiedToDeployment) {
    return (
      <div className="flex gap-3 whitespace-nowrap">
        <Icon name="solid:lock" className="text-palette-beige" />

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span>Tied to Bid Deployment</span>
            <Icon name="circle-info" />
          </div>
          <StyledText variant="footnote">
            {numRoundsLeftOnDeployment === 1
              ? "Available to use next round"
              : `Available to use in ${numRoundsLeftOnDeployment} rounds`}
          </StyledText>
        </div>
      </div>
    )
  }

  const {
    statusTopline,
    statusBottomline = null,
    statusExplanation,
    statusIcon,
  } = isTiedToDeployment
    ? {
        statusIcon: <Icon name="solid:lock" className="text-palette-beige" />,
        statusTopline: "Tied to bid deployment",
        statusBottomline:
          numRoundsLeftOnDeployment === 1
            ? "Available to use next round"
            : `Available to use in ${numRoundsLeftOnDeployment} rounds`,
        statusExplanation: <>This lockup is currently tied to a deployment.</>,
      }
    : isEligibleToChangeVote
      ? {
          statusIcon: (
            <Icon name="solid:circle-check" className="text-palette-green" />
          ),
          statusTopline: "Voted for bid",
          statusBottomline: `${getTimeUntilDate(currentRoundEndDate)} left in round`,
          statusExplanation: (
            <>
              This lockup is currently tied to the bid above in the current
              round, but you can still change your vote.
            </>
          ),
        }
      : {
          statusIcon: (
            <Icon name="regular:circle-dashed" className="text-palette-green" />
          ),
          statusTopline: "Eligible to vote",
          statusExplanation: (
            <span>
              This lockup is eligible to vote in the current round.{" "}
              <StyledText variant="link" href="/bids" as={Link}>
                Browse Bids
              </StyledText>
            </span>
          ),
        }

  const statusTooltip = (
    <div className="flex flex-col gap-2">
      {!isExpired && (
        <div
          className={twJoin(
            "grid grid-cols-3",
            "-mx-4 -mt-2", // negate padding from Tooltip
            "bg-palette-green/5"
          )}
        >
          {(
            [
              ["locked", true],
              ["voted", isEligibleToChangeVote || isTiedToDeployment],
              ["deployed", isTiedToDeployment],
            ] as const
          ).map(([status, isActive]) => (
            <div
              key={status}
              className={twMerge(
                "flex items-center justify-center gap-1",
                "px-3 py-2",
                "text-xs font-bold uppercase",
                isActive
                  ? "bg-palette-green/10 text-palette-green"
                  : "text-white/30"
              )}
            >
              <Icon name={isActive ? "solid:check" : "solid:circle-dashed"} />
              {status}
            </div>
          ))}
        </div>
      )}

      {votedOnBid && (
        <div className="flex flex-col">
          <StyledText variant="label">Voted for bid:</StyledText>
          <StyledText
            as="a"
            variant="link"
            href={`/bids/${votedOnBidId}`}
            target="_blank"
          >
            <WordWrapper
              words={votedOnBid.title}
              sliceStart={-2}
              wrapper={(words) => (
                <span className="whitespace-nowrap">
                  {words}
                  <Icon name="arrow-up-right-from-square" />
                </span>
              )}
            />
          </StyledText>
        </div>
      )}

      {statusExplanation}
    </div>
  )

  return (
    <Tooltip
      className="group relative flex gap-3 whitespace-nowrap"
      classNamesForTooltip="w-80"
      tipContents={statusTooltip}
      {...otherProps}
    >
      {statusIcon}

      <div className="flex flex-col">
        <div className="border-b-2 border-dotted border-white/50 hover:border-white">
          {statusTopline}
        </div>
        {statusBottomline && (
          <StyledText variant="footnote">{statusBottomline}</StyledText>
        )}
      </div>
    </Tooltip>
  )
}
