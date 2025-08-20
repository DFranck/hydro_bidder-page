import { BurgerButton } from "@/components/BurgerButton"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { twMerge } from "tailwind-merge"
import { MarketplaceSortBy, MarketplaceView } from "../types"
import MarketplaceSortSelect from "./MarketplaceSortSelect"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Store } from "lucide-react"
import { isMyLockup } from "../utils/isMyLockup"
import { useMarketplaceData } from "../context/MarketplaceDataProvider"

interface MarketplaceHeaderProps {
  setView: (view: MarketplaceView) => void
  setSortBy: (sortBy: MarketplaceSortBy) => void
  isAsideOpen: boolean
  setIsAsideOpen: (isOpen: boolean) => void
  results: number
  handleNftMint: () => void
}

export default function MarketplaceHeader({
  setView,
  setSortBy,
  isAsideOpen,
  setIsAsideOpen,
  results,
  handleNftMint,
}: MarketplaceHeaderProps) {
  const {} = useBackendData()
  const { marketplaceLockups } = useMarketplaceData()
  const { lockups, isLoading , marketplaceLockups: myMarketplaceLockups } = useBackendData()

  const myLockups = marketplaceLockups.filter((lockup) =>
    isMyLockup(lockup, myMarketplaceLockups)
  )
  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 w-full rounded-lg border border-white/20 bg-black/40 p-6">
        <div className="flex flex-col gap-3">
          <span className="text-lg text-white/90">
            Hydro lockups can be minted as NFTs and transferred to other
            wallets. The NFTs carry several features, including locked tokens,
            active votes, pending rewards, and governance history, and{" "}
            <a
              href="https://x.com/hydromarkets/status/1912138750085247471"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hydro-blue underline hover:no-underline"
            >
              more coming up
            </a>
            . A 1% commission fee is applied to all NFT sales that will be
            redistributed to NFT holders. You can click on any of the cards
            below to show details.
          </span>
        </div>
      </div>
      <div className="flex h-[44px] items-center justify-between bg-white/10 px-4">
        <div className="flex items-center">
          <StyledText
            as="button"
            variant={"button.neutral.small"}
            onClick={() => setIsAsideOpen(!isAsideOpen)}
            className="mr-2 hidden md:flex "
          >
            <Icon
              name="chevron-right"
              className={twMerge(
                "transition-all duration-200 ease-in-out",
                isAsideOpen ? "rotate-180" : ""
              )}
            />
          </StyledText>
        </div>
        <div className="flex w-full items-center justify-between gap-4 bg-transparent">
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
              {results + myLockups.length}
            </StyledText>
            <StyledText
              as={"label"}
              aria-label={`${results + myLockups.length} results`}
              variant="label.meta.faded"
            >
              results
            </StyledText>

            <StyledText
              as="button"
              variant="button.primary"
              className="flex items-center gap-2 p-2 whitespace-nowrap md:ml-6"
              onClick={handleNftMint}
              disabled={lockups.length === 0 || isLoading}
            >
              <Store className="size-4 text-black" />
              Mint an NFT
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
    </div>
  )
}
