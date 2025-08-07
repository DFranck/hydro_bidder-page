import { BurgerButton } from "@/components/BurgerButton"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
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
    <div className="flex flex-col w-full">
  {/* Info box */}
  <div className="w-full bg-black/40 p-6 border border-white/20 rounded-lg mb-4">
    <div className="flex flex-col gap-3 max-w-[800px]">
      <span className="text-white/90 text-lg">
        Trade Hydro lockups as NFTs backed by dATOM or stATOM.<br></br>
        Cards show the locked amount and asking price. Click one to see the details.<br></br>
        Buy an NFT to gain its voting power and rewards; sell anytime to pass both on.
      </span>
    </div>
  </div>

  {/* Original header content */}
  <div className="flex h-[44px] items-center justify-between bg-white/10 px-4">
    <div className="flex w-full items-center justify-between gap-4 bg-transparent lg:w-fit">
      <MarketplaceSortSelect setSortBy={setSortBy} />
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
      <BurgerButton
        onClick={() => setIsAsideOpen(!isAsideOpen)}
        isOpen={isAsideOpen}
      />
    </div>
  </div>
</div>
  )
}
