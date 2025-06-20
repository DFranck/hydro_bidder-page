import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"
import { twJoin } from "tailwind-merge"

export function BidLogoAndTitle({ bidId }: { bidId: number }) {
  const { bidsInfo } = useBackendData()
  const bid = bidsInfo[bidId]

  if (!bid) return null

  const { projectLogoUrl, projectName, projectTitle, title } = bid

  return (
    <BidLogoAndTitleLayout
      projectLogoUrl={projectLogoUrl}
      projectName={projectName}
      title={projectTitle || title}
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
  title: string
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
            alt={projectName || title}
            fill={true}
            sizes="(max-width: 639px) 32px, 48px"
          />
        ) : null}
      </div>

      <StyledText variant="h4" className="max-sm:text-sm">
        {title}
      </StyledText>
    </div>
  )
}
