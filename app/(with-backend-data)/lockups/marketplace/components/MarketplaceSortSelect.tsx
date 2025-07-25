import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { useState } from "react"
import { twJoin } from "tailwind-merge"
import { Dropdown } from "../../actions/components/Dropdown"
import { SORT_OPTIONS } from "../config/sortConfigs"
import { MarketplaceSortBy } from "../types"

interface MarketplaceSortSelectProps {
  setSortBy: (sortBy: MarketplaceSortBy) => void
}

export default function MarketplaceSortSelect({
  setSortBy,
}: MarketplaceSortSelectProps) {
  const [selectedSort, setSelectedSort] =
    useState<MarketplaceSortBy>("price-asc")

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2">
          <StyledText
            as="span"
            variant="label.meta.faded"
            className="hidden md:flex"
          >
            SORT BY
          </StyledText>
          <Icon
            name="thin:arrow-up-arrow-down"
            className="text-white md:hidden"
          />
          <span className="text-[14px] font-light text-white">
            {SORT_OPTIONS.find((o) => o.value === selectedSort)?.label}
          </span>
          <Icon name="solid:caret-down" className="text-white" />
        </div>
      }
    >
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => {
            setSelectedSort(option.value as MarketplaceSortBy)
            setSortBy(option.value as MarketplaceSortBy)
          }}
          className={twJoin(
            "px-4 py-2 text-left text-sm",
            selectedSort === option.value
              ? "bg-palette-green font-bold text-palette-text"
              : "text-white hover:bg-palette-green/20",
          )}
        >
          {option.label}
        </button>
      ))}
    </Dropdown>
  )
}
