import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"
import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"

export function BidLogoAndTitle({ bidId }: { bidId: number }) {
  const { bidMetaDataById, bidsInfo } = useBackendData()
  const bid = bidsInfo[bidId]

  if (!bid) return null

  const {
    projectLogoUrl,
    projectName,
    title = bid.title,
  } = bidMetaDataById[bidId] || {}

  return (
    <BidLogoAndTitleLayout
      projectLogoUrl={projectLogoUrl}
      projectName={projectName}
      title={title}
    />
  )
}

export function BidLogoAndTitleLayout({
  projectLogoUrl,
  projectName,
  title,
}: {
  projectLogoUrl?: string
  projectName: string
  title: ReactNode
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-6">
      <div
        className={twJoin(
          "relative shrink-0",
          "size-8 rounded-full border text-[0]",
          "sm:size-12"
        )}
      >
        {projectLogoUrl ? (
          <Image
            className="object-contain"
            src={projectLogoUrl}
            alt={projectName}
            fill={true}
          />
        ) : null}
      </div>

      <StyledText variant="h4" className="max-sm:text-sm">
        {title}
      </StyledText>
    </div>
  )
}
