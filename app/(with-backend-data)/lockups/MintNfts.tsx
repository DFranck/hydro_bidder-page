"use client"

import { Card } from "@/components/Card"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { FormEvent, useEffect, useState } from "react"
import { revalidateTag } from "@/lib/revalidateTag"
import { pluralize } from "@/lib/pluralize"
import { formatAmount } from "@/lib/formatAmount"
import { Icon } from "@/components/Icon"
import { executeWalletMergeLockups } from "@/contract-apis/executeWalletMergeLockups"
import { useChain } from "@cosmos-kit/react"
import { useBackendData } from "@/contract-apis/useBackendData"
import { executeWalletSplitLockup } from "@/contract-apis/executeWalletSplitLockup"
import { Equal, Plus, SquaresUnite, X } from "lucide-react"
import { NFT_LIST } from "./config"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { executeWalletSimulateLockup } from "@/contract-apis/executeWalletSimulateLockup"
import { useIsMobile } from "@/hooks/use-mobile"
import { findLockupsForNFT } from "./utils"

interface MintNftsProps {
  isCreationModalOpen: boolean
  setIsCreationModalOpen: (isOpen: boolean) => void
  handleCreationModalWindowClose: () => void
  handleModalWindowCloseComplete: () => void
}

export type NFT_INFO = {
  amount: number
  image: string
  baseDenom: string
  displayDenom: string
}

type MintStep = "merge" | "split" | "init"

export function MintNfts({
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
}: MintNftsProps) {
  const { address, lockups, isLoading: contextLoading } = useBackendData()
  const [step, setStep] = useState<MintStep>("init")

  const [nftInfo, setNftInfo] = useState<NFT_INFO>({
    amount: 0,
    baseDenom: "",
    image: "",
    displayDenom: "",
  })

  const [nftDetails, setNftDetails] = useState(false)

  const { getSigningCosmWasmClient } = useChain("neutron")

  const [isLoading, setIsLoading] = useState(false)

  const isMobile = useIsMobile()

  const allActiveLockups = lockups.filter((lockup) => !lockup.isExpired)

  const eligibleLockupsSizes = findLockupsForNFT(
    nftInfo.amount,
    nftInfo.baseDenom,
    allActiveLockups
  )

  function handleCloseModal() {
    handleCreationModalWindowClose()
    setIsCreationModalOpen(false)
    setTimeout(() => {
      setNftDetails(false)
    }, 100)
  }

  function handleMintInfo(nft: NFT_INFO) {
    setNftInfo(nft)
    setNftDetails(true)
  }

  async function handleSplit() {
    await executeWalletSplitLockup({
      getSigningCosmWasmClient,
      address,
      amount: String(nftInfo.amount * 1e6),
      lockId: eligibleLockupsSizes.selectedLockups[0].id,
    })
    setIsLoading(false)
    handleCloseModal()
    await revalidateTag("backendData")
  }

  async function handleMerge() {
    await executeWalletMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: eligibleLockupsSizes.selectedLockups.map((el) => el.id),
    })
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)

    try {
      if (eligibleLockupsSizes.selectedLockupsCount > 1) {
        await handleMerge()

        await revalidateTag("backendData")
        setStep("split")
      }

      const newLockUpData = findLockupsForNFT(
        nftInfo.amount,
        nftInfo.baseDenom,
        allActiveLockups
      )

      if (newLockUpData.selectedLockupsCount === 1 && step === "init") {
        await handleSplit()
      }

      // await executeWalletSimulateLockup({
      //   getSigningCosmWasmClient,
      //   address,
      //   lockIds: lockups
      // .filter((lockup) => !lockup.isExpired)
      //     .filter((els) => els.funds.denomInfo?.humanReadableDenom === "ATOM")
      // .filter((els) => els.funds.amount < 0.001)
      //     .map((el) => el.id),
      // })
    } catch (error) {
      console.error("Error in handleSubmitCreationForm:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function handleStepChange() {
      if (step === "split" && !contextLoading && lockups.length > 0) {
        await handleSplit()
      }
    }
    handleStepChange().then(() => {})
  }, [step, lockups])

  return (
    <ModalWindow
      isOpen={isCreationModalOpen}
      onClose={() => {
        handleCreationModalWindowClose()
      }}
      onCloseComplete={() => {
        handleModalWindowCloseComplete()
      }}
      className="w-full px-8 md:w-[650px]"
    >
      <div>
        <form onSubmit={handleSubmitCreationForm}>
          <Card className="overflow-hidden bg-black">
            <div className="flex items-center justify-between gap-2">
              <Card.Header
                title={"Mint an NFT from Lockups"}
                className="text-sm md:text-3xl"
              />
              <X
                className="mb-6 inline-block size-6 cursor-pointer text-gray-300"
                onClick={handleCloseModal}
              />
            </div>

            <Card.Body
              className={cn("h-96 overflow-scroll md:h-5/12", {
                "pr-0": nftDetails,
                "pr-6": isMobile,
              })}
            >
              {nftDetails ? (
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={nftInfo.image}
                      alt={"nft.denom"}
                      className="size-60"
                    />
                  </div>
                  <div className="from-palette-green/0 to-palette-green/20 h-fit flex-1 bg-gradient-to-r p-3 pl-6">
                    <div className="flex items-center justify-between">
                      <span className="text-palette-beige flex items-center gap-2 text-sm uppercase">
                        <SquaresUnite className="fill-palette-beige size-4" />
                        {pluralize({
                          count: eligibleLockupsSizes.selectedLockupsCount,
                          singular: "Lockup",
                          plural: "Lockups",
                        })}{" "}
                        to convert
                      </span>
                      <span>{eligibleLockupsSizes.selectedLockupsCount}</span>
                    </div>
                    <div className="mt-2 flex flex-col items-end gap-3">
                      <div className="flex flex-wrap gap-2">
                        {eligibleLockupsSizes.selectedLockups.map(
                          (el, index) => (
                            <div
                              className="border-palette-beige space-x-1 rounded-md border p-1.5 text-xs text-white"
                              key={index}
                            >
                              <span>
                                {" "}
                                {formatAmount(el.funds.amount, 0, 3)}
                              </span>
                              <span>{nftInfo.displayDenom}</span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                          <Equal className="size-4 text-white" />
                          <span className="border-palette-beige bg-palette-beige rounded-md border p-1.5 text-xs text-black">
                            {nftInfo.amount} {nftInfo.displayDenom}
                          </span>
                        </div>
                        {eligibleLockupsSizes.remainder ? (
                          <div className="flex items-center gap-2">
                            <Plus className="size-4 text-white" />
                            <span className="border-palette-beige  rounded-md border border-dashed p-1.5 text-xs">
                              {formatAmount(
                                eligibleLockupsSizes.remainder,
                                0,
                                3
                              )}{" "}
                              {nftInfo.displayDenom}
                            </span>
                          </div>
                        ) : null}
                      </div>
                      {eligibleLockupsSizes.remainder ? (
                        <span className="mt-3 text-xs text-white/80">
                          One remainder lockup of{" "}
                          <strong className="text-white">
                            {formatAmount(eligibleLockupsSizes.remainder, 0, 3)}
                          </strong>{" "}
                          {nftInfo.displayDenom} will be created
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {NFT_LIST.map((nft, index) => (
                    <div
                      key={index}
                      className={cn("flex flex-col items-end gap-2", {
                        "cursor-pointer hover:opacity-100":
                          findLockupsForNFT(
                            nft.amount,
                            nft.baseDenom,
                            allActiveLockups
                          ).selectedLockupsCount > 0,
                        "cursor-not-allowed opacity-30":
                          findLockupsForNFT(
                            nft.amount,
                            nft.baseDenom,
                            allActiveLockups
                          ).selectedLockupsCount === 0,
                      })}
                      onClick={() =>
                        findLockupsForNFT(
                          nft.amount,
                          nft.baseDenom,
                          allActiveLockups
                        ).selectedLockupsCount === 0
                          ? {}
                          : handleMintInfo(nft)
                      }
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
                          <span> {nft.amount}</span>
                          <span className="text-xs"> {nft.displayDenom}</span>
                        </div>
                        <span className="text-left text-sm text-gray-400">
                          {findLockupsForNFT(
                            nft.amount,
                            nft.baseDenom,
                            allActiveLockups
                          ).selectedLockupsCount === 1
                            ? "Created from "
                            : findLockupsForNFT(
                                  nft.amount,
                                  nft.baseDenom,
                                  allActiveLockups
                                ).selectedLockupsCount > 1
                              ? "Merges"
                              : null}{" "}
                          {
                            findLockupsForNFT(
                              nft.amount,
                              nft.baseDenom,
                              allActiveLockups
                            ).selectedLockupsCount
                          }{" "}
                          lockups
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>

            {!nftDetails ? null : (
              <Card.Footer className="mt-auto">
                <StyledText
                  variant="button.primary"
                  as="button"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin text-lg">
                      <Icon name="solid:loader" />
                    </div>
                  ) : (
                    "Mint"
                  )}
                </StyledText>
                <StyledText
                  variant="button.secondary"
                  as="button"
                  type="button"
                  onClick={() => {
                    setIsLoading(false)
                    setNftDetails(false)
                  }}
                >
                  Back
                </StyledText>
              </Card.Footer>
            )}
          </Card>
        </form>
      </div>
    </ModalWindow>
  )
}
