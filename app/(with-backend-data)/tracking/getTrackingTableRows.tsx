import { BidLogoAndTitle } from "@/components/BidLogoAndTitle"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import {
  BalanceItem,
  BidRevampMetrics,
  TrackingItem,
  TrackingRow,
} from "@/contract-apis/types"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { simplifyBigNumbers } from "@/lib/simplifyBigNumbers"

export function getTrackingTableRows(
  openedRows: number[],
  onToggleRow: (bidId: number) => void,
  bids?: BidRevampMetrics[],
  trackings?: TrackingItem[],
): TrackingRow[] {
  if (!bids || !bids.length || !trackings || !trackings.length) return []

  const rows = trackings.map((tracking) => {
    const isOpened = openedRows.includes(tracking.bid_id)
    const venueTvl = (tracking.holdings || []).reduce(
      (acc, holding) => {
        if (holding.info_missing || !holding.venue_total) {
          return { ...acc, infoMissing: true }
        }
        return {
          atom: acc.atom + holding.venue_total.total_atom,
          usdc: acc.usdc + holding.venue_total.total_usdc,
          infoMissing: false,
        }
      },
      { atom: 0, usdc: 0, infoMissing: false },
    )

    const committeeHolding = (tracking.holdings || []).reduce(
      (acc, holding) => {
        if (
          holding.info_missing ||
          !holding.address_holdings ||
          !holding.address_rewards
        ) {
          return { ...acc, infoMissing: true }
        }
        return {
          atom:
            acc.atom +
            holding.address_holdings.total_atom +
            holding.address_rewards.total_atom,
          usdc:
            acc.usdc +
            holding.address_holdings.total_usdc +
            holding.address_rewards.total_usdc,
          infoMissing: false,
        }
      },
      { atom: 0, usdc: 0, infoMissing: false },
    )

    const balancesByProtocol = (tracking.holdings || []).reduce(
      (acc, holding) => {
        const protocol = holding.protocol
        if (protocol && !holding.info_missing) {
          if (!acc[protocol]) {
            acc[protocol] = {
              venueTotal: [],
              addressHoldings: [],
              addressRewards: [],
            }
          }
          if (holding.venue_total?.balances) {
            holding.venue_total.balances.forEach((balance) => {
              acc[protocol].venueTotal.push(balance)
            })
          }
          if (holding.address_holdings?.balances) {
            holding.address_holdings.balances.forEach((balance) => {
              acc[protocol].addressHoldings.push(balance)
            })
          }
          if (holding.address_rewards?.balances) {
            holding.address_rewards.balances.forEach((balance) => {
              acc[protocol].addressRewards.push(balance)
            })
          }
        }
        return acc
      },
      {} as {
        [protocol: string]: {
          venueTotal: BalanceItem[]
          addressHoldings: BalanceItem[]
          addressRewards: BalanceItem[]
        }
      },
    )

    return {
      _bid: bids[tracking.bid_id],
      _tracking: tracking,

      roundId:
        committeeHolding.infoMissing || !tracking.holdings ? (
          <StyledText>{bids[tracking.bid_id].roundId + 1}</StyledText>
        ) : (
          <StyledText as="button" onClick={() => onToggleRow(tracking.bid_id)}>
            <StyledText>{bids[tracking.bid_id].roundId + 1}</StyledText>
          </StyledText>
        ),

      logoAndTitle:
        committeeHolding.infoMissing || !tracking.holdings ? (
          <BidLogoAndTitle bidId={tracking.bid_id} />
        ) : (
          <StyledText as="button" onClick={() => onToggleRow(tracking.bid_id)}>
            <BidLogoAndTitle bidId={tracking.bid_id} />
          </StyledText>
        ),

      venueTvl:
        committeeHolding.infoMissing || !tracking.holdings ? (
          <StyledText variant="footnote">-</StyledText>
        ) : (
          <div className="flex flex-col items-end">
            <StyledText
              as="button"
              onClick={() => onToggleRow(tracking.bid_id)}
            >
              {simplifyBigNumbers(venueTvl.atom)}&nbsp;
              <StyledText variant="footnote">ATOM</StyledText>
            </StyledText>
            <StyledText
              as="button"
              variant="footnote"
              onClick={() => onToggleRow(tracking.bid_id)}
            >
              (
              {amountToUSDString(venueTvl.usdc, {
                appendUsd: false,
                numberOfDecimals: 2,
                removeTrailingZeros: true,
              })}
              )
            </StyledText>
          </div>
        ),

      committeeHolding:
        committeeHolding.infoMissing || !tracking.holdings ? (
          <StyledText variant="footnote">-</StyledText>
        ) : (
          <div className="flex flex-col items-end">
            <StyledText
              as="button"
              onClick={() => onToggleRow(tracking.bid_id)}
            >
              {simplifyBigNumbers(committeeHolding.atom)}&nbsp;
              <StyledText variant="footnote">ATOM</StyledText>
            </StyledText>

            <StyledText
              as="button"
              variant="footnote"
              onClick={() => onToggleRow(tracking.bid_id)}
            >
              (
              {amountToUSDString(committeeHolding.usdc, {
                appendUsd: false,
                numberOfDecimals: 2,
                removeTrailingZeros: true,
              })}
              )
            </StyledText>
          </div>
        ),

      actions: !committeeHolding.infoMissing && tracking.holdings && (
        <div className="flex items-center justify-end gap-3">
          <StyledText as="button" onClick={() => onToggleRow(tracking.bid_id)}>
            <Icon name={isOpened ? "chevron-up" : "chevron-down"} />
          </StyledText>
        </div>
      ),

      additional: isOpened && (
        <div className="flex flex-col gap-4">
          {Object.keys(balancesByProtocol).map((protocol, protocolIndex) => (
            <div
              key={`protocol_additional_${protocolIndex}`}
              className="flex flex-row justify-between"
            >
              <div className="flex flex-col items-end">
                <StyledText className="pb-4 font-bold">
                  Protocol: {protocol}
                </StyledText>
                {balancesByProtocol[protocol].venueTotal.length > 0 && (
                  <StyledText variant="label" className="pb-1 underline">
                    Venue Total
                  </StyledText>
                )}
                {balancesByProtocol[protocol].venueTotal.map(
                  (balance, balanceIndex) => (
                    <StyledText
                      key={`venueTotal_${protocolIndex}_${balanceIndex}`}
                    >
                      {simplifyBigNumbers(balance.amount)}&nbsp;
                      <StyledText variant="footnote">
                        {balance.display_name}&nbsp;
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
                    </StyledText>
                  ),
                )}
              </div>
              <div className="flex flex-col items-end">
                <StyledText className="pb-4 font-bold">
                  Protocol: {protocol}
                </StyledText>
                {balancesByProtocol[protocol].addressHoldings.length > 0 && (
                  <StyledText variant="label" className="pb-1 underline">
                    Address Holdings
                  </StyledText>
                )}
                {balancesByProtocol[protocol].addressHoldings.map(
                  (balance, balanceIndex) => (
                    <StyledText
                      key={`addressHoldings_${protocolIndex}_${balanceIndex}`}
                    >
                      {simplifyBigNumbers(balance.amount)}&nbsp;
                      <StyledText variant="footnote">
                        {balance.display_name}&nbsp;
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
                    </StyledText>
                  ),
                )}
                {balancesByProtocol[protocol].addressRewards.length > 0 && (
                  <StyledText variant="label" className="py-1 underline">
                    Address Rewards
                  </StyledText>
                )}
                {balancesByProtocol[protocol].addressRewards.map(
                  (balance, balanceIndex) => (
                    <StyledText
                      key={`addressRewards_${protocolIndex}_${balanceIndex}`}
                    >
                      {simplifyBigNumbers(balance.amount)}&nbsp;
                      <StyledText variant="footnote">
                        {balance.display_name}&nbsp;
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
                    </StyledText>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      ),
    }
  })

  return rows
}
