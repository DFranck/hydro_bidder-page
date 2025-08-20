"use client"
import { StyledText } from "@/components/StyledText"
import { useMarketplaceFilters } from "../context/MarketplaceFiltersContext"

import { useBackendData } from "@/contract-apis/useBackendData"
import { twMerge } from "tailwind-merge"
import { getAllowedPaymentDenoms } from "../../utils/getAllowedPaymentDenoms"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { filterSections } from "../config/filtersConfig"
import { MarketplaceLockup } from "../types"
import { getLockupStatus } from "../utils/getLockupStatus"
import { isMyLockup } from "../utils/isMyLockup"
import { CheckboxWithCustomCheck } from "./CheckboxWithCustomCheck"
import { DenomFilterItem } from "./DenomFilterItem"
import { InputWithCustomUnit } from "./InputWithCustomUnit"

export default function MarketplaceFilters({
  lockups,
}: {
  lockups: MarketplaceLockup[]
}) {
  const {
    filters,
    setMinScore,
    setMinPrice,
    setMaxPrice,
    setUseMinScore,
    setUseMinPrice,
    setUseMaxPrice,
    toggleStatus,
    toggleDenom,
  } = useMarketplaceFilters()
  const { collections, marketplaceLockups } = useBackendData()

  // Aggregate counts by status (for badge display)
  const lockupCountsByStatus = lockups.reduce<Record<string, number>>(
    (acc, lockup) => {
      const status = getLockupStatus(lockup)
      const isMine = isMyLockup(lockup, marketplaceLockups)

      // Only count non-user lockups for the status filters
      if (!isMine) {
        if (status === "for-sale") {
          acc["for-sale"] = (acc["for-sale"] || 0) + 1
        }

        if (status === "not-for-sale") {
          acc["not-for-sale"] = (acc["not-for-sale"] || 0) + 1
        }
      }

      return acc
    },
    {},
  )

  // Aggregate counts by denom (for badge display)
  const lockupCountsByDenom = lockups.reduce<Record<string, number>>(
    (acc, lockup) => {
      const denom = getDisplayDenom(lockup.funds.denom)
      acc[denom] = (acc[denom] || 0) + 1
      return acc
    },
    {},
  )

  return (
    <div className="sticky top-20 flex flex-col gap-6 text-sm">
      <div className="flex flex-col">
        <StyledText as="h4" variant={"label.meta.faded"} className="mb-4">
          STATUS
        </StyledText>
        <div className="flex flex-col gap-3">
          {filterSections.status.options.map((status) => (
            <div key={status} className="flex items-center justify-between">
              <StyledText
                as="label"
                htmlFor={status}
                variant="label"
                className={twMerge(
                  "rounded border-2 px-3 py-1",
                  status === "for-sale" &&
                    "border-palette-green bg-palette-green/20",
                  status === "not-for-sale" &&
                    "border-transparent bg-palette-beige/20",
                )}
              >
                {status === "for-sale"
                  ? "For Sale"
                  : "Not For Sale"}
              </StyledText>
              <div className="flex gap-2">
                {filters.status.includes(status) && (
                  <StyledText
                    as="output"
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-black"
                  >
                    {lockupCountsByStatus[status] || 0}
                  </StyledText>
                )}
                <CheckboxWithCustomCheck
                  id={status}
                  checked={filters.status.includes(status)}
                  onChange={() => toggleStatus(status)}
                  disabled={lockupCountsByStatus[status] === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <StyledText as="h4" variant={"label.meta.faded"} className="mb-4">
          DENOM
        </StyledText>
        <div className="flex flex-col gap-3">
          {filterSections.denoms.options.map((denom) => (
            <DenomFilterItem
              key={denom}
              denom={denom}
              count={lockupCountsByDenom[denom] || 0}
              checked={filters.denoms.includes(denom)}
              onToggle={() => toggleDenom(denom)}
            />
          ))}
        </div>
      </div>
      <div>
        <StyledText as="h4" variant={"label.meta.faded"} className="mb-4">
          Price
        </StyledText>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <StyledText as="label" htmlFor={"minimum-price"} variant="label">
              Minimum
            </StyledText>
            <div className="flex items-center gap-2">
              {filters.useMinPrice && (
                <InputWithCustomUnit
                  value={filters.minPrice}
                  onChange={setMinPrice}
                  unit={getDisplayDenom(
                    getAllowedPaymentDenoms(collections)[0],
                  )}
                  min={1}
                />
              )}
              <CheckboxWithCustomCheck
                id="minimum-price"
                checked={filters.useMinPrice}
                onChange={(e) => setUseMinPrice(e.target.checked)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <StyledText as="label" htmlFor={"maximum-price"} variant="label">
              Maximum
            </StyledText>
            <div className="flex items-center gap-2">
              {filters.useMaxPrice && (
                <InputWithCustomUnit
                  value={filters.maxPrice}
                  onChange={setMaxPrice}
                  unit={getDisplayDenom(
                    getAllowedPaymentDenoms(collections)[0],
                  )}
                  min={1}
                />
              )}
              <CheckboxWithCustomCheck
                id="maximum-price"
                checked={filters.useMaxPrice}
                onChange={(e) => setUseMaxPrice(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}