import { BurgerButton } from "@/components/BurgerButton"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { twMerge } from "tailwind-merge"
import { MarketplaceSortBy, MarketplaceView } from "../types"
import MarketplaceSortSelect from "./MarketplaceSortSelect"

interface MarketplaceHeaderProps {
  setView: (view: MarketplaceView) => void
  setSortBy: (sortBy: MarketplaceSortBy) => void
  isAsideOpen: boolean
  setIsAsideOpen: (isOpen: boolean) => void
  results: number
}

export default function MarketplaceHeader({
  setView,
  setSortBy,
  isAsideOpen,
  setIsAsideOpen,
  results,
}: MarketplaceHeaderProps) {
  return (
    <div className="flex h-[44px] items-center justify-between bg-white/10 px-4">
      <div className="flex items-center">
        <StyledText
          as="button"
          variant={"button.neutral.small"}
          onClick={() => setIsAsideOpen(!isAsideOpen)}
      className="hidden md:flex mr-2 "
        >
          <Icon name="chevron-right"  className={twMerge("transition-all duration-200 ease-in-out",isAsideOpen ? "rotate-180" : "")}/>
        </StyledText>
      <h1 className="hidden items-center gap-2 whitespace-nowrap text-[18px] font-bold lg:flex">
        <Icon name="light:bag-shopping" />
        Hydro Lockup NFT Store
      </h1>
          </div>
      <div className="flex w-full items-center justify-between gap-4 bg-transparent md:w-fit">
        <div className="flex items-center gap-2">
          <StyledText
            as={"label"}
            variant="label.meta.faded"
            className="hidden md:flex"
          >
            showing
          </StyledText>
          <StyledText
            as="output"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-black"
          >
            {results}
          </StyledText>
          <StyledText
            as={"label"}
            aria-label={`${results} results`}
            variant="label.meta.faded"
          >
            results
          </StyledText>
        </div>
        <MarketplaceSortSelect setSortBy={setSortBy} />
        <BurgerButton
          onClick={() => setIsAsideOpen(!isAsideOpen)}
          isOpen={isAsideOpen}
        />
        {/* Add when you have more views */}
        {/* <div className="flex gap-2">
          <button onClick={() => setView("grid")}>Card</button>
        </div> */}
      </div>
    </div>
  )
}
