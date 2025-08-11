
import type { AugmentedLockup } from "@/contract-apis/types";
import { useBackendData } from "@/contract-apis/useBackendData";
import { useMemo } from "react";
import type { MarketplaceLockup } from "../../marketplace/types";
import { formatDenomAmount } from "../../utils/formatDenomAmount";
import { getDenomExponent } from "../../utils/getDenomExponent";
import { getPriceMetaForDenom } from "../../utils/getPriceMetaForDenom";

type LockupLike = AugmentedLockup | MarketplaceLockup;

const MockedDatomPrice = 5.48;
const MockedAtomPrice  = 4.74;
const MockedStAtomPrice = 7.67;

function fallbackUsdForDenom(denom: string | undefined): number | undefined {
  if (!denom) return undefined;
  const d = denom.toLowerCase();

  if (d.includes("datom")) return MockedDatomPrice;

  if (d.includes("statom") || d.includes("stuatom") || d.includes("st-atom")) {
    return MockedStAtomPrice;
  }

  if (d === "atom" || d.endsWith("uatom")) return MockedAtomPrice;

  return undefined;
}

export function useLockupHumanAmount(lockup: LockupLike): number {
  return useMemo(() => {
    const amt = lockup.funds.amount as unknown;
    if (typeof amt === "number" && Number.isFinite(amt)) return amt;

    const raw = (lockup as any)?.funds?.denomInfo?.amount;
    if (raw != null) {
      const exp = getDenomExponent(lockup.funds.denom) ?? 6;
      return Number(formatDenomAmount(String(raw), exp));
    }
    return Number(amt);
  }, [lockup]);
}

export function useLockupTokenUsdPrice(lockup: LockupLike): number | undefined {
  const { currentRoundPrices = {} } = useBackendData();

  return useMemo(() => {
    const { price } = getPriceMetaForDenom(currentRoundPrices, lockup.funds.denom);
  
    if (price && price > 0) return price;

    if (process.env.NODE_ENV === "development") {
      return fallbackUsdForDenom(lockup.funds.denom);
    }
    return undefined;
  }, [currentRoundPrices, lockup.funds.denom]);
}

export function useLockupPerTokenInAtom(lockup: LockupLike): number | undefined {
  const { currentRoundPrices = {}, atomPrice } = useBackendData();

  return useMemo(() => {
    const { price: tokenUsd } = getPriceMetaForDenom(currentRoundPrices, lockup.funds.denom);
    const tokenUsdEff =
      tokenUsd && tokenUsd > 0
        ? tokenUsd
        : process.env.NODE_ENV === "development"
        ? fallbackUsdForDenom(lockup.funds.denom)
        : undefined;

    const atomUsdEff =
      atomPrice && atomPrice > 0
        ? atomPrice
        : process.env.NODE_ENV === "development"
        ? MockedAtomPrice
        : undefined;

    if (!tokenUsdEff || !atomUsdEff) return undefined;
    return tokenUsdEff / atomUsdEff;
  }, [currentRoundPrices, lockup.funds.denom, atomPrice]);
}

export function useLockupTotals(lockup: LockupLike): {
  totalAtom?: number;
  totalUsd?: number;
} {
  const human = useLockupHumanAmount(lockup);
  const tokenUsd = useLockupTokenUsdPrice(lockup);
  const perTokenInAtom = useLockupPerTokenInAtom(lockup);

  return useMemo(() => {
    const totalUsd =
      tokenUsd !== undefined && Number.isFinite(human) ? human * tokenUsd : undefined;

    const totalAtom =
      perTokenInAtom !== undefined && Number.isFinite(human)
        ? human * perTokenInAtom
        : undefined;

    return { totalAtom, totalUsd };
  }, [human, tokenUsd, perTokenInAtom]);
}
