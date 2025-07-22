import { useQueries } from "@tanstack/react-query"
import { findLockupsForNFT } from "@/hooks/use-nft"
import { NFT_LIST } from "@/app/(with-backend-data)/lockups/config"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AugmentedLockup } from "@/contract-apis/types"
import { NFT_INFO } from "@/app/(with-backend-data)/lockups/MintNfts"

export function MintNftCard({
  lockups,
  handleMintInfo,
}: {
  lockups: AugmentedLockup[]
  handleMintInfo: (nft: NFT_INFO) => void
}) {
  const nftQueries = useQueries({
    queries: NFT_LIST.map((nft) => ({
      queryKey: ["nft-size-query", nft.baseDenom, nft.amount, lockups.length],
      queryFn: () => findLockupsForNFT(nft.amount, nft.baseDenom, lockups),
      enabled: !!lockups && lockups.length > 0,
    })),
  })

  // Check loading state
  const isLoading = nftQueries.some((query) => query.isLoading)

  const handleNftClick = (nft: NFT_INFO, lockupCount: number) => {
    if (lockupCount > 0) {
      handleMintInfo(nft)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {NFT_LIST.map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse flex-col items-end gap-2"
          >
            <div className="aspect-square size-full rounded bg-gray-200" />
            <div className="flex flex-col items-end gap-1">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {NFT_LIST.map((nft, index) => {
        const query = nftQueries[index]
        const nftSizeData = query.data
        const lockupCount = nftSizeData?.selectedLockupsCount ?? 0
        const isAvailable = lockupCount > 0

        return (
          <div
            key={index}
            className={cn("flex flex-col items-end gap-2", {
              "cursor-pointer hover:opacity-100": isAvailable,
              "cursor-not-allowed opacity-30": !isAvailable,
            })}
            onClick={() => handleNftClick(nft, lockupCount)}
          >
            <Image
              src={nft.image}
              alt={`${nft.displayDenom} NFT`}
              width={100}
              height={100}
              className="size-full"
            />
            <div className="flex flex-col items-end">
              <div className="text-palette-green space-x-0.5 text-sm">
                <span>{nft.amount}</span>
                <span className="text-xs">{nft.displayDenom}</span>
              </div>
              <span className="text-left text-sm text-gray-400">
                {lockupCount === 0
                  ? "Insufficient lockups"
                  : lockupCount === 1
                    ? "Created from 1 lockup"
                    : `Merges ${lockupCount} lockups`}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
