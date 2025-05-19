import { MarkdownContainer } from "@/components/MarkdownContainer"
import { useBackendData } from "@/contract-apis/useBackendData"
import Image from "next/image"
import { Tooltip } from "./Tooltip"
import { twJoin } from "tailwind-merge"
import { StyledText } from "./StyledText"
import { bucketTotalLiquidityTooltip } from "./ToolTips"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"
import { Icon } from "./Icon"

export function TrancheTitle({
  trancheId,
  roundId,
}: {
  trancheId: number
  roundId: number
}) {
  const { tranches } = useBackendData()
  const tranche = tranches.find((t) => t.id === trancheId)
  const trancheMetadata = (() => {
    try {
      return JSON.parse(String(tranche?.metadata)) as {
        description: string
        logo: string
        pool_sizes: { round_id: number; amount: number; denom: string }[]
      }
    } catch {
      return null
    }
  })()

  const requestedRoundPoolSize = trancheMetadata
    ? trancheMetadata.pool_sizes?.find((x) => x.round_id === roundId)
    : undefined

  return trancheMetadata ? (
    <div className="flex items-start gap-2">
      <div className="relative size-12 shrink-0">
        <Image
          src={`/images/logo-${trancheMetadata.logo}.svg`}
          alt={tranche?.name ?? ""}
          fill={true}
          className="object-contain"
          sizes="48px"
        />
      </div>

      <div className="flex w-full flex-col">
        <div>{tranche?.name ?? <em>(Unnamed Tranche)</em>}</div>
        {requestedRoundPoolSize && (
          <StyledText className="font-normal">
            <Tooltip
              className={twJoin("inline-flex items-center gap-1")}
              tipContents={bucketTotalLiquidityTooltip}
            >
              <div className="flex items-center gap-1">
                <StyledText variant="mathSymbol.container">
                  <StyledText>
                    {simplifyBigNumbers(requestedRoundPoolSize.amount)}
                    &nbsp;
                    <StyledText variant="footnote">
                      {requestedRoundPoolSize.denom}
                    </StyledText>
                  </StyledText>
                </StyledText>
                <Icon name="circle-info" className="text-xs" />
              </div>
            </Tooltip>
          </StyledText>
        )}

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
