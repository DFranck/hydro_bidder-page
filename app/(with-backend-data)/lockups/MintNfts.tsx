import { Card } from "@/components/Card"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { FormEvent, use, useEffect, useRef, useState } from "react"
import { revalidateTag } from "@/lib/revalidateTag"
import { Icon } from "@/components/Icon"
import { executeWalletMergeLockups } from "@/contract-apis/executeWalletMergeLockups"
import { useChain } from "@cosmos-kit/react"
import { useBackendData } from "@/contract-apis/useBackendData"
import { executeWalletSplitLockup } from "@/contract-apis/executeWalletSplitLockup"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  findLockupsForNFtSizes,
  LockupsResult,
  useFindLockupsForNFTQuery,
} from "@/hooks/use-nft"
import { MintNftCard } from "@/components/MintNftCard"
import { executeWalletCovertToDAtomLockups } from "@/contract-apis/executeWalletCovertToDAtomLockups"
import { AugmentedLockup } from "@/contract-apis/types"
import { useQueryClient } from "@tanstack/react-query"
import { useToasts } from "@/components/Toasts"
import { toastMessages } from "@/components/ToastMessages"
import { MintNftCardDetails } from "@/components/MintNftCardDetails"
import { executeMultipleMergeLockups } from "@/contract-apis/executeMultipleMergeLockups"
import { MintNftCardStepper } from "@/components/MintNftCardStepper"
import { logMintDebugData } from "@/lib/logMintDebugData"

export interface MintingStep {
  id: number
  title: string
  status: "default" | "pending" | "error" | "success"
}

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

type MintStep =
  | "init"
  | "selected"
  | "merge"
  | "split"
  | "convert"
  | "merge_after_convert"
  | "merge_matching_denoms"
  | "success"
  | "error"

export function MintNfts({
  isCreationModalOpen,
  setIsCreationModalOpen,
  handleCreationModalWindowClose,
  handleModalWindowCloseComplete,
}: MintNftsProps) {
  const queryClient = useQueryClient()
  const { setToasts } = useToasts()
  const [nftDetails, setNftDetails] = useState(false)
  const { getSigningCosmWasmClient } = useChain("neutron")
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useIsMobile()
  const {
    address,
    lockups,
    isLoading: isContextLoading,
    isWalletConnected,
  } = useBackendData()
  const [nftInfo, setNftInfo] = useState<NFT_INFO>({
    amount: 0,
    baseDenom: "",
    image: "",
    displayDenom: "",
  })
  const [step, setStep] = useState<MintStep>("init")
  const [lastActiveStep, setLastActiveStep] = useState<number>(1)

  const { data, isLoading: isNFTLoading } = useFindLockupsForNFTQuery(
    nftInfo.amount,
    nftInfo.baseDenom,
    lockups
  )

  const executingStepRef = useRef<MintStep | null>(null)

  function handleInvalidateNFTQuery() {
    queryClient.invalidateQueries({
      queryKey: ["findLockupsForNFtSizes"],
      refetchType: "active", // only refetch active (mounted) queries
    })
  }

  const eligibleLockupsSizes = data
    ? data
    : {
        selectedLockups: [],
        selectedLockupsCount: 0,
        totalAmount: 0,
        remainder: 0,
        totalLockupSelected: 0,
        denom: "",
        hasVirtualLockups: false,
        hasMultipleDenoms: false,
        sharedDenomCount: false,
        virtualLockupsCount: 0,
        virtualLockups: [],
        hasMatchingDenoms: false,
        hasDenomCombination: false,
      }

  function handleStepInterval(step: MintStep) {
    const interval = setInterval(() => {
      if (!isContextLoading) {
        clearInterval(interval)
        setStep(step)
      }
    }, 10000)

    return () => clearInterval(interval)
  }

  async function executeSplit(freshLockups: AugmentedLockup[]) {
    logMintDebugData("Executing split with fresh lockups:", freshLockups.length)

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups
    )

    if (freshLockupsData.selectedLockups.length !== 1) {
      throw new Error(
        `Expected 1 lockup for split, got ${freshLockupsData.selectedLockups.length}`
      )
    }

    await executeWalletSplitLockup({
      getSigningCosmWasmClient,
      address,
      amount: String(nftInfo.amount * 1e6),
      lockId: freshLockupsData.selectedLockups[0].id,
    })

    logMintDebugData("Split completed successfully")
    setIsLoading(false)
    await revalidateTag("backendData")
    setStep("success")
  }

  async function executeMerge(freshLockups: AugmentedLockup[]) {
    logMintDebugData("Executing merge with fresh lockups:", freshLockups.length)

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups,
      getSigningCosmWasmClient,
      address
    )

    await executeWalletMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: freshLockupsData.selectedLockups.map((el) => el.id),
    })

    await revalidateTag("backendData")
    logMintDebugData("Merge completed, triggering split...")
    handleStepInterval("split")
  }

  async function executeConvert(freshLockups: AugmentedLockup[]) {
    logMintDebugData(
      "Executing convert to dATOM with fresh lockups:",
      freshLockups.length
    )

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups,
      getSigningCosmWasmClient,
      address
    )

    logMintDebugData({ freshLockupsData })

    if (!freshLockupsData?.hasVirtualLockups) {
      throw new Error("No virtual lockups to convert")
    }

    await executeWalletCovertToDAtomLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: freshLockupsData.virtualLockups.map((v) => v.id),
    })

    await revalidateTag("backendData")
    logMintDebugData("Convert completed, triggering merge...")
    handleStepInterval("merge_after_convert")
  }

  async function executeMergeAfterConvert(freshLockups: AugmentedLockup[]) {
    logMintDebugData(
      "Executing merge after convert with fresh lockups:",
      freshLockups.length
    )

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups,
      getSigningCosmWasmClient,
      address
    )

    await executeWalletMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: freshLockupsData.selectedLockups.map((el) => el.id),
    })

    await revalidateTag("backendData")
    logMintDebugData("Merge after convert completed, triggering split...")
    handleStepInterval("split")
  }

  async function executeMergeMatchingDenoms(freshLockups: AugmentedLockup[]) {
    logMintDebugData(
      "Executing merge matching denoms with fresh lockups:",
      freshLockups.length
    )

    const matchingLockups = eligibleLockupsSizes.virtualLockups

    if (!matchingLockups) {
      throw new Error("No matching lockups to merge")
    }

    await executeMultipleMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockups: eligibleLockupsSizes.virtualLockups,
    })

    await revalidateTag("backendData")
    logMintDebugData("Merge matching denoms completed")
    handleStepInterval("convert")
  }

  function handleCloseModal() {
    handleCreationModalWindowClose()
    setIsCreationModalOpen(false)
    handleInvalidateNFTQuery()
    setIsLoading(false)
    setStep("init")
    const timeOut = setTimeout(() => {
      setNftDetails(false)
    }, 100)
    return () => clearTimeout(timeOut)
  }

  function handleMintInfo(nft: NFT_INFO) {
    setStep("selected")
    handleInvalidateNFTQuery()
    setNftInfo(nft)
    setNftDetails(true)
  }

  async function handleSubmitCreationForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const isDAtom = nftInfo.displayDenom === "dATOM"

      // STEP 1: Non-dATOM, 1 lockup => Split
      if (!isDAtom && eligibleLockupsSizes.selectedLockupsCount === 1) {
        logMintDebugData("Non-dATOM: Single lockup, triggering split")
        setStep("split")
        return
      }

      // STEP 2: Non-dATOM, >1 lockups => Merge -> Split
      if (!isDAtom && eligibleLockupsSizes.selectedLockupsCount > 1) {
        logMintDebugData("Non-dATOM: Multiple lockups, triggering merge")
        setStep("merge")
        return
      }

      // STEP 3: dATOM with no virtuals => use step 1 or 2 logic
      if (isDAtom && !eligibleLockupsSizes.hasVirtualLockups) {
        logMintDebugData("dATOM: No virtual lockups")

        if (eligibleLockupsSizes.selectedLockupsCount > 1) {
          logMintDebugData("dATOM: Multiple lockups, triggering merge")
          setStep("merge")
        } else {
          logMintDebugData("dATOM: Single lockup, triggering split")
          setStep("split")
        }
        return
      }

      // STEP 4 & 7: dATOM with virtuals + hasMatchingDenoms => merge matching
      if (
        isDAtom &&
        eligibleLockupsSizes.hasVirtualLockups &&
        eligibleLockupsSizes.hasMatchingDenoms
      ) {
        logMintDebugData(
          "dATOM: Virtual lockups with matching denoms, triggering merge matching denoms"
        )

        setStep("merge_matching_denoms")
        return
      }

      // STEP 5-6-8-9: dATOM → Convert virtuals → Merge → Split
      if (
        isDAtom &&
        eligibleLockupsSizes.hasVirtualLockups &&
        eligibleLockupsSizes.hasMultipleDenoms
      ) {
        logMintDebugData(
          "dATOM: Virtual lockups with multiple denoms, triggering convert"
        )
        setStep("convert")
        return
      }

      // If we get here, something unexpected happened
      logMintDebugData("Unexpected state in handleSubmitCreationForm", {
        isDAtom,
        eligibleLockupsSizes,
      })
      setIsLoading(false)
    } catch (error) {
      logMintDebugData("Error in handleSubmitCreationForm:", error)
      setIsLoading(false)
      setStep("init")
    }
  }

  const getCurrentStepInfo = (): {
    activeStep: number
    status: "default" | "pending" | "error" | "success"
    failedStep?: number
  } => {
    if (step === "success") {
      return { activeStep: 5, status: "success" }
    }

    if (step === "init") {
      return { activeStep: 1, status: "default" }
    }

    if (step === "selected") {
      return { activeStep: 1, status: "success" }
    }

    if (
      step === "merge" ||
      step === "merge_after_convert" ||
      step === "merge_matching_denoms"
    ) {
      return { activeStep: 2, status: "pending" }
    }

    if (step === "convert") {
      return { activeStep: 3, status: "pending" }
    }

    if (step === "split") {
      return { activeStep: 4, status: "pending" }
    }

    if (step === "error") {
      const failedAtStep = lastActiveStep
      return {
        activeStep: lastActiveStep,
        status: "error",
        failedStep: failedAtStep,
      }
    }

    return { activeStep: 1, status: "default", failedStep: lastActiveStep }
  }

  const { activeStep, status, failedStep } = getCurrentStepInfo()

  const generateSteps = (): MintingStep[] => {
    const baseSteps = [
      {
        id: 1,
        title: "Choose NFT",
      },
      {
        id: 2,
        title: step === "merge" ? "Merging" : "Merge",
      },
      {
        id: 3,
        title: step === "convert" ? "Converting" : "Convert",
      },
      {
        id: 4,
        title: step === "split" ? "Splitting" : "Split",
      },
      {
        id: 5,
        title: "Success",
      },
    ]

    return baseSteps.map((stepState) => {
      let stepStatus: "default" | "pending" | "error" | "success" = "default"

      if (step === "success") {
        stepStatus = "success"
      } else if (step === "error" && failedStep !== undefined) {
        if (stepState.id === failedStep) {
          stepStatus = "error"
        } else if (stepState.id < failedStep) {
          stepStatus = "success"
        } else {
          stepStatus = "default"
        }
      } else if (step === "init") {
        stepStatus = "default"
      } else if (stepState.id === activeStep) {
        stepStatus = status
      } else if (stepState.id < activeStep) {
        stepStatus = "success"
      } else {
        stepStatus = "default"
      }

      return {
        ...stepState,
        status: stepStatus,
      }
    })
  }

  const steps = generateSteps()

  useEffect(() => {
    async function handleStepChange() {
      if (
        !isContextLoading &&
        lockups.length > 0 &&
        step !== "init" &&
        step !== "selected"
      ) {
        if (executingStepRef.current === step) {
          return
        }

        executingStepRef.current = step
        try {
          logMintDebugData(
            `Executing step: ${step} with ${lockups.length} fresh lockups`
          )

          switch (step) {
            case "split":
              await executeSplit(lockups)
              break

            case "merge":
              await executeMerge(lockups)
              break

            case "convert":
              await executeConvert(lockups)
              break

            case "merge_after_convert":
              await executeMergeAfterConvert(lockups)
              break

            case "merge_matching_denoms":
              await executeMergeMatchingDenoms(lockups)
              break
          }
        } catch (error) {
          setToasts([toastMessages.mintNftLockupsError(error as Error)])
          setIsLoading(false)
          setStep("error")
        }
      }
    }

    handleStepChange()
  }, [step, lockups, isContextLoading])

  useEffect(() => {
    if (step !== "error") {
      if (step === "init") {
        setLastActiveStep(1)
      } else if (
        step === "merge" ||
        step === "merge_after_convert" ||
        step === "merge_matching_denoms"
      ) {
        setLastActiveStep(2)
      } else if (step === "convert") {
        setLastActiveStep(3)
      } else if (step === "split") {
        setLastActiveStep(4)
      } else if (step === "success") {
        setLastActiveStep(5)
      }
    } else {
      setLastActiveStep((prev) => prev)
    }
  }, [step])

  useEffect(() => {
    if (!isWalletConnected) {
      handleCloseModal()
    }
  }, [isWalletConnected])

  return (
    <ModalWindow
      isOpen={isCreationModalOpen}
      onClose={() => {
        handleCreationModalWindowClose()
      }}
      onCloseComplete={() => {
        handleModalWindowCloseComplete()
      }}
      className="w-full px-2 md:w-[650px] md:px-8"
    >
      <div>
        <form onSubmit={handleSubmitCreationForm}>
          <Card className="overflow-hidden bg-black">
            <div className="flex items-center justify-between gap-2">
              <Card.Header
                title={"Mint an NFT from Lockups"}
                variant={isMobile ? "h4" : "h3"}
              />
              <X
                className="mb-6 inline-block size-6 cursor-pointer text-gray-300"
                onClick={handleCloseModal}
              />
            </div>

            <Card.Body
              className={cn("hide-scrollbar h-96 overflow-auto md:h-5/12", {
                "pr-0": nftDetails,
                "pr-6": isMobile && !nftDetails,
              })}
            >
              {nftDetails ? (
                <div>
                  <MintNftCardStepper steps={steps} />
                  <MintNftCardDetails
                    nftInfo={nftInfo}
                    eligibleLockupsSizes={eligibleLockupsSizes as LockupsResult}
                    isNFTLoading={isNFTLoading}
                  />
                </div>
              ) : (
                <MintNftCard
                  steps={steps}
                  lockups={lockups}
                  handleMintInfo={handleMintInfo}
                />
              )}
            </Card.Body>
            {!nftDetails ? null : (
              <Card.Footer className="mt-auto">
                {step === "success" ? (
                  <StyledText
                    variant="button.primary"
                    as="button"
                    type="button"
                    onClick={() => {
                      setIsLoading(false)
                      setNftDetails(false)
                      setStep("init")
                    }}
                  >
                    Done
                  </StyledText>
                ) : (
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
                )}
                <StyledText
                  variant="button.secondary"
                  as="button"
                  type="button"
                  onClick={() => {
                    setIsLoading(false)
                    setNftDetails(false)
                    setStep("init")
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
