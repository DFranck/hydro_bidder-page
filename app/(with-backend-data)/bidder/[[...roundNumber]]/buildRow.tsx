

import { BidLogoAndTitle, BidLogoAndTitleLayout } from "@/components/BidLogoAndTitle"
import { Tooltip } from "@/components/Tooltip"
import { BidRevampMetrics, PreHydroBid } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getFormatedDateFromNanos } from "@/lib/getFormatedDateFromNanos"
import { AddTributeButton } from "./components/AddTributeButton"
import RefundTrubuteButton from "./components/RefundTrubuteButton"


export function buildRow(
  passedBid: BidRevampMetrics | PreHydroBid,
  requestedPreHydro: boolean
) {
  let rowURL: string, projectLogoUrl: string, projectName: string, title: string
const {address}=useBackendData()
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

  // === Expansion content (post-hydro only) ===
  const tokenTributes = !requestedPreHydro
    ? (passedBid as BidRevampMetrics).tokenBasedTributes ?? []
    : []

  const hasTributes = !requestedPreHydro && tokenTributes.length > 0
  const tributeCount = tokenTributes.length;
  const additionalTributes = hasTributes ? (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/70">
            <th className="py-2 pr-4">Token</th>
            <th className="py-2 pr-4 text-right">created at</th>
            <th className="py-2 pr-0 text-right">status</th>
            <th className="py-2 pr-0 text-right">action</th>
          </tr>
        </thead>
        <tbody>
       {tokenTributes.map((t: any, i: number) => {
        // for disabling
        const connectedAddress = (address ?? "").trim().toLowerCase()
        console.log("connectedAddress", connectedAddress)
        const depositor = String(t.depositor ?? "").trim().toLowerCase()
        console.log("depositor", depositor)
        const isDepositor = connectedAddress === depositor
        console.log("isDepositor", isDepositor)
        const isRefunded = !!t.refunded
        // TODO find the real status
        const isActionableStatus = (passedBid as any).status === "Approved"

        const disabled = !isDepositor || isRefunded || !isActionableStatus

          let reason: string | undefined
          if (!isDepositor) reason = "Only the depositor can refund this tribute."
          else if (isRefunded) reason = "This tribute has already been refunded."
          else if (!isActionableStatus) reason = "Refunds are only available while the proposal is Approved."

        // pour l’id du tribute : selon tes données tu as parfois t.id et parfois t.tributeId
        const tributeId = Number(t.tributeId ?? t.id)
        // for rendering
          const name = t.denom ?? t.funds?.denom;
          const amount = t.funds?.amount;
          const originalName = t.denomOriginal ?? t.funds?.denom;
          const createdAt = getFormatedDateFromNanos(t.creationTime);
          
          return (
            <tr
              key={`tribute_${(passedBid as any).id}_${i}`}
              className="border-t border-white/10"
            >
              <td className="py-2 pr-4">
               
                  <Tooltip

                  tipContents={
                <div>
                  <div className="text-xs opacity-70">Original denom:</div>
                  <code className="text-xs break-all select-all">{originalName}</code>
                </div>
              }
                    className="inline-block cursor-help max-w-fit"
                     classNamesForTooltip="max-w-[min(90vw,28rem)] break-words sm:max-w-96"
                  > <span
                  className="inline-flex items-baseline gap-2 whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="tabular-nums">{amount}</span>
                      <span>
                        {name}
                        </span>
           
                </span>
                  </Tooltip>
              </td>

              <td className="py-2 pr-4 text-right whitespace-nowrap">{createdAt}</td>
              <td className="py-2 pr-0 text-right whitespace-nowrap">
                {isRefunded ? "refunded" : "active"}
              </td>
               <td className="py-2 pr-1 text-right whitespace-nowrap">
                <RefundTrubuteButton
                disabled={disabled}
                reason={reason}
                tributeId={tributeId}
                proposalId={Number((passedBid as any).id)}
                roundId={Number((passedBid as any).roundId)}
                trancheId={Number((passedBid as any).trancheId)}
              />              
              </td>
            </tr>
          );
        }
        )}
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
    status: <>{(passedBid as any).status ?? "—"}</>,
    action:<><AddTributeButton bidId={Number(passedBid.id)} size="small"/></>,
    hasTributes,
    additionalTributes,
     tributeCount,
  }
}
