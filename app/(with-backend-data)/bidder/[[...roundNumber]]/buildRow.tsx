import {
  BidLogoAndTitle,
  BidLogoAndTitleLayout,
} from "@/components/BidLogoAndTitle"
import { BidTributeApr } from "@/components/BidTributeApr"
import { Icon } from "@/components/Icon"
import { Tooltip } from "@/components/Tooltip"
import {
  BidRevampMetrics,
  PreHydroBid,
  TokenBasedTribute,
} from "@/contract-apis/types"
import { AddTributeButton } from "./components/AddTributeButton"
import RefundTrubuteButton from "./components/RefundTrubuteButton"
import { formatTimestamp } from "./utils/formatTimestamp"
import {
  computeTributeUiStatus,
  uiStatusLabel,
  uiStatusTooltip,
} from "./utils/tributeRules"

type RowOptions = {
  onAfterSuccess?: () => void
}

export function buildRow(
  passedBid: BidRevampMetrics | PreHydroBid,
  requestedPreHydro: boolean,
  options: RowOptions = {},
  currentRoundId: number
) {
  const { onAfterSuccess } = options
  let rowURL: string, projectLogoUrl: string, projectName: string, title: string
  if (requestedPreHydro) {
    const bid = passedBid as PreHydroBid
    rowURL = `https://www.mintscan.io/cosmos/proposals/${bid.id.replace("#", "")}`
    projectLogoUrl = bid.project_logo_url
    projectName = bid.project
    title = bid.title
  } else {
    const regularBid = passedBid as BidRevampMetrics
    rowURL = `/bids/${passedBid.id}`
    projectLogoUrl = regularBid?.projectLogoUrl ?? ""
    projectName = regularBid?.projectName ?? ""
    title = regularBid?.projectTitle ?? ""
  }

  const tokenTributes = !requestedPreHydro
    ? ((passedBid as BidRevampMetrics).tokenBasedTributes ?? [])
    : []

  const hasTributes = !requestedPreHydro && tokenTributes.length > 0
  const tributeCount = tokenTributes.length
  const additionalTributes = hasTributes ? (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/70">
            <th className="py-2 pr-4">Tribute</th>
            <th className="hidden py-2 pr-4 text-right sm:table-cell">
              Created at
            </th>
            <th className="py-2 pr-0 text-right">
              <Tooltip
                tipContents={
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Voting period</strong>: The bid is still active in
                      the current round. Refunds are not available during this
                      stage.
                    </div>
                    <div>
                      <strong>Refundable</strong>: The bid’s round has ended. If
                      you are the depositor, you can refund your tribute.
                    </div>
                    <div>
                      <strong>Claimable</strong>: This tribute has already been
                      refunded. Voters may now claim the funds.
                    </div>
                    <div>
                      <strong>Not refundable</strong>: Liquidity was deployed
                      for this bid; refund is blocked by the contract.
                    </div>
                  </div>
                }
                classNamesForTooltip="-ml-12"
              >
                <div className="flex items-center gap-1">
                  Status
                  <Icon name="circle-info" />
                </div>
              </Tooltip>
            </th>
            <th className="py-2 pr-0 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {tokenTributes.map((t: TokenBasedTribute, i: number) => {
            const bid = passedBid as BidRevampMetrics
            const s = computeTributeUiStatus(bid, t, currentRoundId)
            const statusText = uiStatusLabel[s]
            const statusTip = uiStatusTooltip(s)
            const name = t.denom ?? (t as any).funds?.denom
            const amount = (t as any).funds?.amount ?? t.amount
            const original = t.denomOriginal ?? (t as any).funds?.denom
            const createdAt = formatTimestamp(t.creationTime)
            const { display, full } = createdAt
            return (
              <tr
                key={`tribute_${(passedBid as any).id}_${i}`}
                className="border-t border-white/10"
              >
                <td className="py-2 pr-4">
                  <Tooltip
                    tipContents={
                      <div className="space-y-1">
                        <div className="text-xs opacity-70">
                          Original amount & denom:
                        </div>
                        <code className="text-xs break-all select-all">
                          {(t as any).amount} {original}{" "}
                        </code>
                      </div>
                    }
                    className="inline-block max-w-fit cursor-help"
                    classNamesForTooltip="max-w-[min(90vw,28rem)] break-words sm:max-w-96"
                  >
                    <span
                      className="inline-flex items-baseline gap-2 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="tabular-nums">{amount}</span>
                      <span>{name}</span>
                    </span>
                    <Icon name="circle-info" className="ml-1" />
                  </Tooltip>
                </td>

                <td className="hidden py-2 pr-4 text-right whitespace-nowrap sm:table-cell">
                  <Tooltip tipContents={"created at: " + t.creationTime}>
                    {display}
                  </Tooltip>
                </td>
                <td className="py-2 pr-0 text-center whitespace-nowrap md:text-right">
                  <Tooltip tipContents={statusTip}>
                    <span>{statusText}</span>
                  </Tooltip>
                </td>
                <td className="py-2 pr-1 text-right whitespace-nowrap">
                  <RefundTrubuteButton
                    bid={bid}
                    tribute={t}
                    onAfterSuccess={onAfterSuccess}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  ) : null

  return {
    _bid: passedBid,
    logoAndTitle: (
      <>
        {requestedPreHydro ? (
          <BidLogoAndTitleLayout
            projectLogoUrl={projectLogoUrl}
            projectName={projectName}
            title={title}
          />
        ) : (
          <BidLogoAndTitle bidId={Number(passedBid.id)} />
        )}
      </>
    ),
    tributeApr: (
      <>
        {requestedPreHydro ? 0 : <BidTributeApr bidId={Number(passedBid.id)} />}
      </>
    ),
    status: <>{(passedBid as any).status ?? "—"}</>,
    action: (
      <>
        <AddTributeButton
          bidId={Number(passedBid.id)}
          size="small"
          onAfterSuccess={onAfterSuccess}
        />
      </>
    ),
    hasTributes,
    additionalTributes,
    tributeCount,
  }
}
