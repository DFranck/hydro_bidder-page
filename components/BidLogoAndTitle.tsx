import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"

export function BidLogoAndTitle({ bidId }: { bidId: number }) {
  const backendData = useBackendData()
  const { bidDescriptionsByBidId, bidsById, metricsForPostHydroBids } =
    backendData
  const bid = bidsById[bidId]

  if (!bid) return null

  const bidFromNumia = metricsForPostHydroBids.find(
    (metric) => Number(metric.id) === bidId
  )

  if (!bidFromNumia) return null

  const bidDescriptionFromGithub =
    bidDescriptionsByBidId[Number(bidFromNumia.id)] ?? null
  const projectLogoUrl =
    bidFromNumia.projectLogoUrl || bidDescriptionFromGithub?.projectLogoUrl
  const projectName =
    bidFromNumia.projectName || bidDescriptionFromGithub?.projectName
  const title = bidFromNumia.title || bidDescriptionFromGithub?.title

  return (
    <div className="flex items-center gap-6">
      <div className="relative size-12 shrink-0 rounded-full border text-[0]">
        {projectLogoUrl ? (
          <Image
            className="object-contain"
            src={projectLogoUrl}
            alt={projectName}
            fill={true}
          />
        ) : null}
      </div>

      <StyledText variant="h4">{title}</StyledText>
    </div>
  )
}
