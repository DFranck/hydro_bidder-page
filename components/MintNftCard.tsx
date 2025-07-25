"use client"

import { useQuery } from "@tanstack/react-query"
import { useChain } from "@cosmos-kit/react"

import { useBackendData } from "@/contract-apis/useBackendData"
import { findLockupsForNFtSizes } from "@/hooks/use-nft"
import { NFT_LIST } from "@/app/(with-backend-data)/lockups/config"
import { cn } from "@/lib/utils"
import { AugmentedLockup } from "@/contract-apis/types"
import { NFT_INFO } from "@/app/(with-backend-data)/lockups/MintNfts"
import { Avatar } from "./Avatar"

interface Props {
  lockups: AugmentedLockup[]
  handleMintInfo: (nft: NFT_INFO) => void
}

type NFTWithLockupCount = NFT_INFO & {
  lockupCount: number
}

export function MintNftCard({ lockups, handleMintInfo }: Props) {
  const { address } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")

  const { data: nfts, isLoading } = useQuery<NFTWithLockupCount[]>({
    queryKey: ["lockup-counts", address, lockups],
    enabled: !!address && lockups.length > 0,
    queryFn: async () => {
      return Promise.all(
        NFT_LIST.map(async (nft) => {
          try {
            const result = await findLockupsForNFtSizes(
              nft.amount,
              nft.baseDenom,
              lockups,
              getSigningCosmWasmClient,
              address
            )

            return {
              ...nft,
              lockupCount: result.selectedLockupsCount,
            }
          } catch {
            return {
              ...nft,
              lockupCount: 0,
            }
          }
        })
      )
    },
  })

  // const renderedList: NFTWithLockupCount[] = isLoading
  //   ? NFT_LIST.map((nft) => ({
  //       ...nft,
  //       lockupCount: 0,
  //     }))
  //   : nfts?.filter((nft) => nft.lockupCount !== 0) || []

  const renderedList: NFTWithLockupCount[] = isLoading
    ? NFT_LIST.map((nft) => ({
        ...nft,
        lockupCount: 0,
      }))
    : nfts || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-38 w-full rounded-md bg-gray-200" />
            <div className="mt-2 ml-auto h-4 w-1/2 rounded-md bg-gray-200" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", {
        "md:grid-cols-4": renderedList.length > 3,
        "md:grid-cols-3": renderedList.length <= 3,
      })}
    >
      {renderedList.map((nft, index) => {
        const isAvailable = !isLoading && nft.lockupCount > 0
        const isDisabled = !isLoading && nft.lockupCount === 0

        return (
          <div
            key={index}
            onClick={() => isAvailable && handleMintInfo(nft)}
            className={cn(
              "flex flex-col items-end gap-2",
              isAvailable && "cursor-pointer hover:opacity-100",
              isDisabled && "cursor-not-allowed opacity-30",
              isLoading && "opacity-60"
            )}
          >
            <div className="h-fit w-full">
              <Avatar
                url={nft.image}
                alt={`${nft.displayDenom} NFT`}
                className="size-full rounded-none"
              />
            </div>
            <div className="flex flex-col items-end text-sm">
              <div className="text-palette-green space-x-1">
                <span>{nft.amount}</span>
                <span className="text-xs">{nft.displayDenom}</span>
              </div>
              <span className="text-end text-xs text-gray-400">
                {isLoading ? (
                  <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200/90" />
                ) : nft.lockupCount === 1 ? (
                  `Created from ${nft.lockupCount} lockup`
                ) : nft.lockupCount === 0 ? (
                  "Insufficient lockups"
                ) : (
                  `Merges ${nft.lockupCount} lockups`
                )}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
