"use client"

import { AugmentedLockup } from "@/contract-apis/types"
import Image from "next/image"
import { MarketplaceLockup } from "../../marketplace/types"
import { getLockupImage } from "../../utils/getLockupImg"

export function LockupImage({
  lockup,
  className,
}: {
  lockup: AugmentedLockup | MarketplaceLockup
  className?: string
}) {
  const { src, fallback } = getLockupImage(lockup)

  return (
    <Image
      src={fallback ? fallback : src}
      alt={`Hydro Lockup ${lockup.id}`}
      fill
      priority
      sizes="200px"
      className={className ?? "object-contain"}
    />
  )
}
