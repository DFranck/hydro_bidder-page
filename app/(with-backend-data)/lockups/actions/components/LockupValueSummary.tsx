
import type { AugmentedLockup } from "@/contract-apis/types";
import type { MarketplaceLockup } from "../../marketplace/types";
import { getDisplayDenom } from "../../utils/getDisplayDenom";
import { useLockupHumanAmount, useLockupTotals } from "../hooks/useLockupPricing";

type Props = { lockup: AugmentedLockup | MarketplaceLockup };

export const LockupValueSummary = ({ lockup }: Props) => {

  const denom = getDisplayDenom(lockup.funds.denom);
  const amountHuman = useLockupHumanAmount(lockup);
  const { totalAtom, totalUsd } = useLockupTotals(lockup);
  
  return (
    <div className="text-center text-sm mt-2 space-y-0.5 text-muted-foreground">
      <div>
        <strong>{amountHuman}</strong> {denom}
      </div>

      <div>
        (~
        {totalAtom !== undefined && Number.isFinite(totalAtom) ? (
          <>{totalAtom.toFixed(2)} ATOM</>
        ) : (
          <span className="italic text-muted-foreground/50">N/A ATOM</span>
        )}
        )
      </div>

      <div>
        (~
        {totalUsd !== undefined && Number.isFinite(totalUsd) ? (
          <>${totalUsd.toFixed(2)}</>
        ) : (
          <span className="italic text-muted-foreground/50">$ N/A</span>
        )}
        )
      </div>
    </div>
  );
};
