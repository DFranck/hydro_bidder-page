import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { experimentalTableDeploymentAprTooltip } from "@/components/ToolTips"
import { ExperimentalItem, ExperimentalRow } from "@/contract-apis/types"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { calculateDurationAndUnit } from "@/lib/calculateDurationAndUnit"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import Image from "next/image"
import { twJoin } from "tailwind-merge"

export function getExperimentalTableRows(
  openedRows: number[],
  onToggleRow: (experimentalId: number) => void,
  experimentalItems?: ExperimentalItem[],
): ExperimentalRow[] {
  if (!experimentalItems || !experimentalItems.length) return []

  const rows = experimentalItems.map((item) => {
    const isOpened = openedRows.includes(item.experimental_id)
    const currentTimestamp = new Date().getTime()
    const startDate = new Date(item.start_timestamp * 1000).toLocaleDateString()
    const startTimestamp = new Date(item.start_timestamp * 1000).getTime()
    const endTimestamp =
      item.end_timestamp === 0
        ? currentTimestamp
        : new Date(item.end_timestamp * 1000).getTime()
    const status = item.end_timestamp === 0 ? "Ongoing" : "Completed"
    const durationBetween = calculateDurationAndUnit(
      endTimestamp - startTimestamp,
    )
    const daysBetween = Math.floor(Math.abs(durationBetween.duration))

    const additionalStatus =
      item.end_timestamp === 0
        ? "Pending"
        : new Date(item.end_timestamp * 1000).toLocaleDateString()

    const deploymentAPR =
      (((item.current_address_holdings.total_atom -
        item.initial_address_holdings.total_atom) /
        item.initial_address_holdings.total_atom) *
        365) /
      daysBetween

    return {
      _experimental: item,

      logoAndName: (
        <StyledText
          as="button"
          className="flex items-center gap-6"
          onClick={() => onToggleRow(item.experimental_id)}
        >
          <div className="relative size-12 shrink-0 rounded-full border text-[0]">
            <Image
              className="rounded-full object-contain"
              src={item.logo}
              alt={item.name}
              fill={true}
            />
          </div>
          <StyledText variant="h4" className="text-left">
            {item.name}
          </StyledText>
        </StyledText>
      ),

      startDate: (
        <StyledText
          as="button"
          onClick={() => onToggleRow(item.experimental_id)}
        >
          {startDate}
        </StyledText>
      ),

      status: (
        <StyledText
          as="button"
          onClick={() => onToggleRow(item.experimental_id)}
        >
          {status}
        </StyledText>
      ),

      initialAddressHoldings: (
        <div className="flex flex-col items-end">
          <StyledText
            as="button"
            onClick={() => onToggleRow(item.experimental_id)}
          >
            {formatAmount(item.initial_address_holdings.total_atom, 0, 2)}&nbsp;
            <StyledText variant="footnote">ATOM</StyledText>
          </StyledText>
          <StyledText
            as="button"
            variant="footnote"
            onClick={() => onToggleRow(item.experimental_id)}
          >
            {amountToUSDString(item.initial_address_holdings.total_usdc, {
              appendUsd: false,
              numberOfDecimals: 2,
              removeTrailingZeros: true,
            })}
          </StyledText>
        </div>
      ),

      deploymentAPR: (
        <Tooltip
          className={twJoin(
            "inline-flex items-center gap-1",
            "border-b-2 border-dotted border-white/50 hover:border-white",
          )}
          tipContents={experimentalTableDeploymentAprTooltip({
            hasEnded: item.end_timestamp !== 0,
            totalAtom: item.current_address_holdings.total_atom,
            totalUsd: item.current_address_holdings.total_usdc,
            deploymentLasted: pluralize({
              count: daysBetween,
              singular: durationBetween.unit,
              prefixCount: true,
            }),
          })}
        >
          <StyledText
            variant="mathSymbol.container"
            as="button"
            onClick={() => onToggleRow(item.experimental_id)}
          >
            {(deploymentAPR * 100).toFixed(2)}
            <StyledText variant="mathSymbol">%</StyledText>
          </StyledText>
        </Tooltip>
      ),

      actions: (
        <div className="flex items-center justify-end gap-3">
          <StyledText
            as="button"
            onClick={() => onToggleRow(item.experimental_id)}
          >
            <Icon name={isOpened ? "chevron-up" : "chevron-down"} />
          </StyledText>
        </div>
      ),

      additionalDescription: isOpened && (
        <MarkdownContainer content={item.description} />
      ),

      additionalStatus: isOpened && (
        <StyledText className="whitespace-nowrap">
          Ends:&nbsp;
          <StyledText variant="label">{additionalStatus}</StyledText>
        </StyledText>
      ),

      additionalInitialAdressHoldings: isOpened && (
        <div className="flex flex-col gap-2">
          <StyledText variant="label" className="underline">
            Initial Holdings Breakdown
          </StyledText>
          {item.initial_address_holdings.balances.map(
            (balance, balanceIndex) => (
              <div
                className="flex flex-col text-right"
                key={`initial_balance_${balanceIndex}`}
              >
                <StyledText className="text-right">
                  {formatAmount(balance.amount, 0, 2)}&nbsp;
                  <StyledText variant="footnote">
                    {balance.display_name}&nbsp;
                  </StyledText>
                </StyledText>
                <StyledText variant="footnote">
                  (
                  {amountToUSDString(balance.usd_value, {
                    appendUsd: false,
                    numberOfDecimals: 2,
                    removeTrailingZeros: true,
                  })}
                  )
                </StyledText>
              </div>
            ),
          )}
        </div>
      ),

      additionalDeploymentAPR: isOpened && (
        <div className="flex flex-col gap-2">
          <StyledText variant="label" className="underline">
            {item.end_timestamp !== 0
              ? "End Holdings Breakdown"
              : "Current Holdings Breakdown"}
          </StyledText>
          {item.current_address_holdings.balances.map(
            (balance, balanceIndex) => (
              <div
                className="flex flex-col text-right"
                key={`current_balance_${balanceIndex}`}
              >
                <StyledText className="text-right">
                  {formatAmount(balance.amount, 0, 2)}&nbsp;
                  <StyledText variant="footnote">
                    {balance.display_name}&nbsp;
                  </StyledText>
                </StyledText>
                <StyledText variant="footnote">
                  (
                  {amountToUSDString(balance.usd_value, {
                    appendUsd: false,
                    numberOfDecimals: 2,
                    removeTrailingZeros: true,
                  })}
                  )
                </StyledText>
              </div>
            ),
          )}
        </div>
      ),
    }
  })

  return rows
}
