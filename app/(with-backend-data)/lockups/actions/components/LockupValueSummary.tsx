import type { AugmentedLockup } from "@/contract-apis/types"
import type { MarketplaceLockup } from "../../marketplace/types"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import {
  useLockupHumanAmount,
  useLockupTotals,
} from "../hooks/useLockupPricing"

type Props = { lockup: AugmentedLockup | MarketplaceLockup }

export const LockupValueSummary = ({ lockup }: Props) => {
  const denom = getDisplayDenom(lockup.funds.denom)
  const amountHuman = useLockupHumanAmount(lockup)
  const { totalAtom, totalUsd } = useLockupTotals(lockup)

  return (
    <div className="text-muted-foreground mt-2 space-y-0.5 text-center text-sm">
      <div>
        <strong>{amountHuman}</strong> {denom}
      </div>

      <div>
        worth ~
        {totalAtom !== undefined && Number.isFinite(totalAtom) ? (
          <>{totalAtom.toFixed(2)} ATOM</>
        ) : (
          <span className="text-muted-foreground/50 italic">N/A ATOM</span>
        )}{" "}
        or{" "}
        {totalUsd !== undefined && Number.isFinite(totalUsd) ? (
          <>${totalUsd.toFixed(2)}</>
        ) : (
          <span className="text-muted-foreground/50 italic">$ N/A</span>
        )}
      </div>
    </div>
  )
}
