"use client"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useToasts } from "@/components/Toasts"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getParsedNftDenomsFromEnv } from "@/lib/getParsedNftDenomsFromEnv"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import SectionLabelLine from "./actions/components/SectionLabelLine"
import executeBuy from "./actions/transactions/executeBuy"
import { extractRelevantErrorMessage } from "./actions/utils/extractRelevantErrorMessage"
import { getActionToast, ToastKey } from "./actions/utils/getActionToast"
import { getLockupActionConfig } from "./actions/utils/getLockupActionConfig"
import { SupabaseHydroListingUpdate } from "./actions/utils/SupabaseHydroListingUpdate"
import { allowedListAmounts } from "./marketplace/config/allowedListAmounts"
import { useMarketplaceData } from "./marketplace/context/MarketplaceDataProvider"
import { MarketplaceLockup } from "./marketplace/types"
import { isListedMarketplaceLockup } from "./marketplace/utils/isListedMarketplaceLockup"
import { isMyLockup } from "./marketplace/utils/isMyLockup"
import { formatDenomAmount } from "./utils/formatDenomAmount"
import { getDenomExponent } from "./utils/getDenomExponent"
import { getDisplayDenom } from "./utils/getDisplayDenom"
import { getImagesWithFallback } from "./utils/getImagesForDenoms"
const BuyALockupButton = () => {
  const { setToasts } = useToasts()
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const { marketplaceLockups } = useMarketplaceData()
  const { updateLocal } = useMarketplaceData()
  const [excludeTiedToDeployment, setExcludeTiedToDeployment] = useState(false)
  const {
    marketplaceLockups: myLockups,
    refetchWalletData,
    tranches,
  } = useBackendData()
  const [isProcessing, setIsProcessing] = useState(false)
  const { getSigningCosmWasmClient, address } = useChain("neutron")
  const [selectedLockup, setSelectedLockup] =
    useState<MarketplaceLockup | null>(null)

  const config = getLockupActionConfig("buy")

  const availableLockupsToBuy = useMemo(() => {
    return marketplaceLockups.filter((l) => {
      if (
        !allowedListAmounts.includes(l.funds.amount) ||
        isMyLockup(l, myLockups) ||
        !isListedMarketplaceLockup(l)
      )
        return false

      if (excludeTiedToDeployment && tranches) {
        return tranches.every((tranche) => {
          const meta = l.metaDataByTrancheId?.[tranche.id]
          return !meta?.isTiedToDeployment
        })
      }

      return true
    })
  }, [marketplaceLockups, myLockups, excludeTiedToDeployment, tranches])

  const imageEntries = useMemo(() => {
    const allowedDenoms = getParsedNftDenomsFromEnv()
    const readableDenoms = allowedDenoms.map((denom) => getDisplayDenom(denom))
    const denomFolders = readableDenoms.map(
      (denom) => denom.split("/").at(-1) ?? "Blank",
    )
    return denomFolders.flatMap(getImagesWithFallback)
  }, [])

  const bestLockupMap = allowedListAmounts.reduce(
    (acc, amount) => {
      const matching = availableLockupsToBuy.filter(
        (l) => l.funds.amount === amount,
      )
      if (matching.length > 0) {
        const cheapest = matching.reduce((min, l) =>
          parseFloat(l.listing.price.amount) <
          parseFloat(min.listing.price.amount)
            ? l
            : min,
        )
        acc[amount] = cheapest
      }
      return acc
    },
    {} as Record<number, MarketplaceLockup>,
  )

  const handleBuy = async () => {
    setIsProcessing(true)
    setToasts([getActionToast(config.toasts.processing as ToastKey)])
    if (!selectedLockup || !address) return

    try {
      await executeBuy(
        address,
        getSigningCosmWasmClient,
        selectedLockup,
        selectedLockup.listing.price,
      )

      const updateDB = await SupabaseHydroListingUpdate(
        selectedLockup.id.toString(),
        "buy",
      )
      updateLocal(selectedLockup as MarketplaceLockup, updateDB)
      setToasts([getActionToast(config.toasts.success as ToastKey)])
    } catch (err: any) {
      const relevantMessage = extractRelevantErrorMessage(err)
      const normalizedError = new Error(relevantMessage)
      console.error("Buy failed", err)
      const updateDB = await SupabaseHydroListingUpdate(
        selectedLockup.id.toString(),
        "unlist",
      )

      updateLocal(selectedLockup as MarketplaceLockup, updateDB)
      setToasts([
        getActionToast(config.toasts.error as ToastKey, normalizedError),
      ])
    } finally {
      setIsProcessing(false)
      setIsBuyModalOpen(false)
      refetchWalletData()
    }
  }

  useEffect(() => {
    if (!isBuyModalOpen) {
      setSelectedLockup(null)
    }
  }, [isBuyModalOpen])

  return (
    <>
      <StyledText
        variant="button.secondary"
        as="button"
        onClick={() => setIsBuyModalOpen(true)}
      >
        <Icon name="solid:cart-shopping" />
        Buy a Lockup
      </StyledText>
      <ModalWindow
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        className="w-full max-w-[95%] md:max-w-[480px]"
      >
        <div className="rounded-xl border-2 border-white/20 bg-black p-0">
          <div className="h-[48px] gap-[10px] rounded-t-xl bg-[#FFE1B81A] px-6 py-3 text-lg">
            <h2 className="font-inter text-[18px] font-bold leading-6">
              Buy a Lockup
            </h2>
          </div>
          <div className="space-y-6 p-[24px]">
            <SectionLabelLine label="Select a lockup size" />

            <div className="grid max-h-72 grid-cols-2 gap-4 overflow-auto p-4 md:grid-cols-3">
              {imageEntries.map(({ src, denomKey }, i) => {
                const amount = allowedListAmounts.find((amt) =>
                  src.includes(`/${amt}_`),
                )
                const lockup = amount ? bestLockupMap[amount] : undefined
                const isAvailable = !!lockup

                return (
                  <div
                    key={i}
                    className={` relative aspect-square cursor-pointer rounded ${
                      isAvailable && "ring-palette-green hover:ring-2"
                    } ${selectedLockup?.funds.amount === amount ? "ring-2" : ""}`}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedLockup(lockup as MarketplaceLockup)
                      }
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Hydro Lockup image ${i}`}
                      fill
                      className={`aspect-square bg-white/10  object-contain ${!isAvailable && "opacity-50"}`}
                      unoptimized
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = src
                          .replace(denomKey, "Blank")
                          .replace(`_${denomKey}@`, "_Blank@")
                      }}
                    />
                    {!isAvailable && (
                      <StyledText
                        as={"div"}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[10px] font-bold text-white opacity-80"
                      >
                        NONE
                        <br />
                        AVAILABLE
                      </StyledText>
                    )}
                  </div>
                )
              })}
            </div>
            <SectionLabelLine label="Options" />
            <div className="flex items-center justify-center gap-2">
              <StyledText
                as="input"
                type="checkbox"
                variant={"input.checkbox"}
                tooltip={
                  <>
                    This will filter out lockups that are tied to a bid already
                    on <span className="font-bold">any</span> bucket, so you
                    will get a lockup that can vote on all buckets.
                  </>
                }
                checked={excludeTiedToDeployment}
                onChange={() => setExcludeTiedToDeployment((v) => !v)}
              />
              <span className="mb-[5px] text-sm text-white">
                Only lockups I can vote with
                <span className="font-bold italic"> now</span>
              </span>
            </div>
            <div className="flex justify-end">
              <StyledText
                as="button"
                variant="button.secondary"
                type="button"
                className="border-none"
                onClick={() => setIsBuyModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </StyledText>
              <StyledText
                as="button"
                variant="button.primary"
                type="button"
                onClick={handleBuy}
                disabled={!selectedLockup || isProcessing}
              >
                {isProcessing ? (
                  <div className="animate-spin text-lg">
                    <Icon name="solid:loader" />
                  </div>
                ) : !selectedLockup ? (
                  <>Select a lockup</>
                ) : (
                  <span className="flex gap-1 font-medium">
                    <Icon name="cart-shopping" /> Buy for
                    <span className="font-extrabold">
                      {formatDenomAmount(
                        selectedLockup?.listing.price?.amount ?? "",
                        getDenomExponent(
                          selectedLockup?.listing.price.denom ?? "",
                        ),
                      )}
                    </span>
                    {getDisplayDenom(selectedLockup?.listing.price.denom ?? "")}
                  </span>
                )}
              </StyledText>
            </div>
          </div>
        </div>
      </ModalWindow>
    </>
  )
}

export default BuyALockupButton
