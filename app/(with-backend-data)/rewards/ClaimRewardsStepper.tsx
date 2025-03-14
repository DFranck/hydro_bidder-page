"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { executeWalletClaimRewards } from "@/contract-apis/executeWalletClaimRewards"
import { getEnvironmentVariable } from "@/contract-apis/getEnvironmentVariable"
import {
  AugmentedBidAfterWallet,
  SanitizedTokenBasedTribute,
} from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { getAddress, useCreateSkipClientMemo } from "@/lib/skipApi"
import { useChain } from "@cosmos-kit/react"
import { RouteResponse } from "@skip-go/client"
import {
  assets as hubAssets,
  chain as hubChain,
} from "chain-registry/mainnet/cosmoshub"
import {
  assets as neutronAssets,
  chain as neutronChain,
} from "chain-registry/mainnet/neutron"
import { ReactNode, useEffect, useState } from "react"
import { Step } from "../lock-atom/steppers/Step"

type ClaimRewardsStep = "Init" | "ConvertToAtom"

export default function ClaimRewardsStepper({
  tribute,
  bid,
  onExit,
}: {
  tribute: SanitizedTokenBasedTribute | null
  bid: AugmentedBidAfterWallet | null
  onExit: (success?: boolean) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<ClaimRewardsStep>("Init")
  const [claimType, setClaimType] = useState<"native" | "convert">("native")
  const [skipApiRoute, setSkipApiRoute] = useState<RouteResponse | null>(null)
  const { address, atomPrice } = useBackendData()
  const {
    getOfflineSigner,
    getRpcEndpoint,
    getSigningCosmWasmClient,
    chain: { chain_id: neutronChainId, pretty_name: neutronChainName },
  } = useChain("neutron")

  const {
    chain: { chain_id: cosmosHubChainId, pretty_name: cosmosChainName },
    address: cosmosHubAddress,
  } = useChain("cosmoshub")

  const { setToasts } = useToasts()

  const skipClient = useCreateSkipClientMemo(
    getOfflineSigner,
    getRpcEndpoint,
    neutronChainId
  )

  function resetStepper() {
    setClaimType("native")
    setSkipApiRoute(null)
    setStep("Init")
  }

  useEffect(() => {
    if (!bid || !tribute) {
      resetStepper()
    }
  }, [bid, tribute, resetStepper])

  if (!bid || !tribute) {
    return <></>
  }

  const { title, contents, buttons, isWorking } = getStepContents()

  const claimRewards = async (convertToAtom: boolean) => {
    if (!bid || !tribute || !address) return

    try {
      setIsLoading(true)
      setToasts([toastMessages.claimingRewards])

      await executeWalletClaimRewards({
        address,
        roundId: bid.roundId,
        trancheId: bid.trancheId,
        tributeId: tribute.id,
        getSigningCosmWasmClient,
      })

      if (convertToAtom) {
        if (!getEnvironmentVariable("NEXT_PUBLIC_ATOM_DENOM")) return
        setToasts([toastMessages.searchingConvertRoute])

        const route = await skipClient.route({
          amountIn: tribute.amount.toString(),
          sourceAssetDenom: tribute.denomOriginal,
          sourceAssetChainID: neutronChainId,
          destAssetDenom: getEnvironmentVariable("NEXT_PUBLIC_ATOM_DENOM"),
          destAssetChainID: cosmosHubChainId,
        })
        setToasts([])

        setSkipApiRoute(route)
        setStep("ConvertToAtom")
      } else {
        onExit(true)
      }

      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setToasts([toastMessages.claimingRewardsError(error as Error)])
      onExit(false)
      setIsLoading(false)
    }
  }

  async function convertToAtom() {
    if (!skipApiRoute) return

    setIsLoading(true)
    setToasts([toastMessages.convertingToAtom])

    const userAddresses = await Promise.all(
      skipApiRoute.requiredChainAddresses.map(async (chainID) => ({
        chainID,
        address: await getAddress(chainID),
      }))
    )

    try {
      await skipClient.executeRoute({
        route: skipApiRoute,
        userAddresses,
        onTransactionCompleted: async () => {
          setToasts([toastMessages.transactionCompleted])
          onExit(true)
        },
        onTransactionTracked: async ({ explorerLink }) => {
          setToasts([toastMessages.transactionTracked(explorerLink)])
        },
        onTransactionSigned: async ({ chainID }) => {
          setToasts([toastMessages.transactionSigned(chainID)])
        },
        onValidateGasBalance: async ({ status }) => {
          setToasts([toastMessages.validatingGas(status)])
        },
      })
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setToasts([toastMessages.transactionError(error as Error)])
      onExit(false)
      setIsLoading(false)
    }
  }

  function getStepContents(): {
    isWorking?: boolean
    revalidateCache?: boolean
    title?: ReactNode
    contents: ReactNode
    buttons?: {
      label: ReactNode
      onClick?: () => void
      className?: string
      disabled?: boolean
    }[]
  } {
    switch (step) {
      case "Init":
        return {
          title: "Claim Your Hydro Rewards",
          contents: (
            <>
              <StyledText>
                <Icon name="arrow-right" className="pr-2 opacity-60" />
                <StyledText>Select a token</StyledText>
              </StyledText>
              <div className="flex gap-6 px-6">
                <StyledText
                  as="label"
                  variant="label"
                  className="flex items-center gap-2"
                >
                  <StyledText
                    variant="input.radio"
                    as="input"
                    type="radio"
                    name="claimType"
                    checked={claimType === "native"}
                    onChange={() => setClaimType("native")}
                  />
                  <StyledText>
                    {formatAmount(tribute!.amount)}&nbsp;
                    <StyledText variant="footnote">{tribute!.denom}</StyledText>
                  </StyledText>
                </StyledText>
                <StyledText
                  as="label"
                  variant="label"
                  className="flex items-center gap-2"
                >
                  <StyledText
                    variant="input.radio"
                    as="input"
                    type="radio"
                    name="claimType"
                    checked={claimType === "convert"}
                    onChange={() => setClaimType("convert")}
                    disabled={!getEnvironmentVariable("NEXT_PUBLIC_ATOM_DENOM")}
                  />
                  <StyledText>
                    {formatAmount(tribute!.valueUsd / atomPrice)}
                    &nbsp;
                    <StyledText variant="footnote">ATOM</StyledText>
                  </StyledText>
                </StyledText>
              </div>
            </>
          ),
          buttons: [
            {
              label:
                claimType === "native" ? "Claim" : "Claim + Convert to ATOM",
              onClick: () => {
                claimRewards(claimType === "convert")
              },
              className: "bg-palette-green",
              disabled: isLoading,
            },
            {
              label: "Cancel",
              onClick: () => {
                onExit(false)
              },
              className: "bg-palette-text",
            },
          ],
        }
      case "ConvertToAtom":
        if (!skipApiRoute) {
          return {
            title: "Convert to ATOM",
            contents: <p>Route is not set</p>,
          }
        }

        const tributeAsset = neutronAssets.assets.find(
          (x: { base: string }) => x.base === tribute!.denomOriginal
        )
        const srcTokenImgUrl = tributeAsset?.logo_URIs?.svg

        const atomAsset = hubAssets.assets.find(
          (x: { base: string }) =>
            x.base === getEnvironmentVariable("NEXT_PUBLIC_ATOM_DENOM")
        )
        const destTokenImgUrl = atomAsset?.logo_URIs?.svg

        const srcExplorer = neutronChain?.explorers?.find(
          (x: { kind?: string }) => x.kind?.toLocaleLowerCase() === "mintscan"
        )
        const srcAddressUrl = srcExplorer?.account_page?.replace(
          "${accountAddress}",
          address
        )

        const destExplorer = hubChain?.explorers?.find(
          (x: { kind?: string }) => x.kind?.toLocaleLowerCase() === "mintscan"
        )
        const destAddressUrl = cosmosHubAddress
          ? destExplorer?.account_page?.replace(
              "${accountAddress}",
              cosmosHubAddress
            )
          : ""

        return {
          title: "Convert to ATOM",
          contents: (
            <div className="flex flex-row gap-6">
              <div className="flex flex-col items-center justify-between gap-3">
                <StyledText
                  as="img"
                  src={srcTokenImgUrl}
                  className="h-12 w-12"
                />
                <Icon name="arrow-down-long" />
                <StyledText
                  as="img"
                  src={destTokenImgUrl}
                  className="h-12 w-12"
                />
              </div>
              <div className="flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <StyledText>
                    {formatAmount(skipApiRoute.amountIn)}&nbsp;
                    <StyledText variant="footnote">{tribute!.denom}</StyledText>
                  </StyledText>
                  <StyledText>
                    on {neutronChainName}&nbsp;
                    <StyledText
                      as="a"
                      href={srcAddressUrl}
                      target="_blank"
                      variant="link"
                    >
                      {address}
                    </StyledText>
                  </StyledText>
                </div>
                <div className="flex flex-col gap-1">
                  <StyledText>
                    {formatAmount(skipApiRoute.amountOut)}&nbsp;
                    <StyledText variant="footnote">ATOM</StyledText>
                  </StyledText>
                  <StyledText>
                    on {cosmosChainName}&nbsp;
                    <StyledText
                      as="a"
                      variant="link"
                      href={destAddressUrl}
                      target="_blank"
                    >
                      {cosmosHubAddress}
                    </StyledText>
                  </StyledText>
                </div>
              </div>
            </div>
          ),
          buttons: [
            {
              label: "Convert",
              onClick: convertToAtom,
              className: "bg-palette-green",
              disabled: isLoading,
            },
          ],
        }
      default:
        return {
          contents: <></>,
        }
    }
  }

  return (
    <Step
      title={title}
      contents={contents}
      buttons={buttons}
      isWorking={isWorking}
    />
  )
}
