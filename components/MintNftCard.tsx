"use client"

import { useQuery } from "@tanstack/react-query"
import { useChain } from "@cosmos-kit/react"

import { useBackendData } from "@/contract-apis/useBackendData"
import { findLockupsForNFtSizes } from "@/hooks/use-nft"
import { NFT_LIST } from "@/app/(with-backend-data)/lockups/config"
import { cn } from "@/lib/utils"
import { AugmentedLockup } from "@/contract-apis/types"
import {
  MintingStep,
  NFT_INFO,
} from "@/app/(with-backend-data)/lockups/MintNfts"
import { Avatar } from "./Avatar"
import { MintNftCardStepper } from "./MintNftCardStepper"
import { StyledText } from "./StyledText"
import Link from "next/link"
import { Icon } from "./Icon"
import { Tooltip } from "./Tooltip"
import { includeNftSizesTooltip } from "./ToolTips"
import { Switch } from "./ui/switch"

interface Props {
  lockups: AugmentedLockup[]
  steps: MintingStep[]
  handleMintInfo: (nft: NFT_INFO) => void
  includeNftSizes: boolean
  handleIncludeNftSizes: () => void
}

type NFTWithLockupCount = NFT_INFO & {
  lockupCount: number
}

export function MintNftCard({
  lockups,
  steps,
  handleMintInfo,
  includeNftSizes,
  handleIncludeNftSizes,
}: Props) {
  const { address } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")

  const { data: nfts, isLoading } = useQuery<NFTWithLockupCount[]>({
    queryKey: ["lockup-counts", address, lockups, includeNftSizes],
    enabled: !!address && lockups.length > 0,
    queryFn: async () => {
      return Promise.all(
        NFT_LIST.map(async (nft) => {
          try {
            const result = await findLockupsForNFtSizes(
              nft.amount,
              nft.baseDenom,
              lockups,
              includeNftSizes,
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

  const renderedList: NFTWithLockupCount[] = isLoading
    ? NFT_LIST.map((nft) => ({
        ...nft,
        lockupCount: 0,
      }))
    : nfts?.filter((nft) => nft.lockupCount !== 0) || []

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
    <div>
      {renderedList.length === 0 ? (
        <div className="flex flex-col  items-center justify-center p-28">
          <div>
            <span className=" text-gray-400">
              You need more lockups to mint an NFT. You can also visit the
              <StyledText
                variant="link"
                href="/lockups/marketplace"
                as={Link}
                className="mx-1.5 inline-block whitespace-nowrap"
              >
                <span>marketplace</span>
                <Icon name="arrow-up-right-from-square" />
              </StyledText>{" "}
              to buy a lockup.
            </span>
          </div>
        </div>
      ) : (
        <MintNftCardStepper steps={steps} />
      )}
      {renderedList.length !== 0 ? (
        <div className="mb-4 flex items-center justify-end">
          <Switch
            checked={includeNftSizes}
            onCheckedChange={handleIncludeNftSizes}
            className="mx-2"
          />
          <StyledText
            className={cn("w-fit text-sm", {
              "text-gray-400": !includeNftSizes,
            })}
          >
            Include existing NFTs
            <Tooltip
              classNamesForTooltip="w-80  -translate-x-12/12 md:w-5/12"
              tipContents={includeNftSizesTooltip}
            >
              <Icon name="circle-info" className="mx-1" />
            </Tooltip>
          </StyledText>
        </div>
      ) : null}
      <div
        className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", {
          "md:grid-cols-4": renderedList.length > 3,
          "md:grid-cols-3": renderedList.length <= 3,
        })}
      >
        {renderedList.length > 0 &&
          renderedList.map((nft, index) => {
            const isAvailable = !isLoading && nft.lockupCount > 0
            const isDisabled =
              !isLoading && nft.lockupCount === 0 && !nft.amount

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
                <div className="h-fit w-full ">
                  <div className={cn("h-6/6 w-full rounded-2xl bg-gray-400/30 md:h-[130px]", {
                    "md:h-[160px]": renderedList.length <= 3
                  })}>
                    <Avatar
                      url={nft.image}
                      alt={`${nft.displayDenom} NFT`}
                      className="size-full rounded-none"
                    />
                  </div>
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
    </div>
  )
}
