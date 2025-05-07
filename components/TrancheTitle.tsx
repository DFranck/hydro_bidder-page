import { MarkdownContainer } from "@/components/MarkdownContainer"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"

export function TrancheTitle({ trancheId }: { trancheId: number }) {
  const { tranches } = useBackendData()

  const tranche = tranches.find((t) => t.id === trancheId)

  const trancheMetadata = (() => {
    try {
      return JSON.parse(String(tranche?.metadata)) as {
        description: string
        logo: string
      }
    } catch {
      return null
    }
  })()

  return trancheMetadata ? (
    <div className="flex items-start gap-2">
      <div className="relative size-12 shrink-0">
        <Image
          src={`/images/logo-${trancheMetadata.logo}.svg`}
          alt={tranche?.name ?? ""}
          fill={true}
          className="object-contain"
        />
      </div>

      <div className="flex w-full flex-col">
        <div>{tranche?.name ?? <em>(Unnamed Tranche)</em>}</div>

        <MarkdownContainer
          content={trancheMetadata.description}
          className="max-w-none font-normal opacity-60"
        />
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {tranche?.metadata ?? <em>(Unnamed Tranche)</em>}
    </div>
  )
}
