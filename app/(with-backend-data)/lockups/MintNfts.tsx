import { Card } from "@/components/Card"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { FormEvent, useEffect, useRef, useState } from "react"
import { revalidateTag } from "@/lib/revalidateTag"
import { pluralize } from "@/lib/pluralize"
import { formatAmount } from "@/lib/formatAmount"
import { Icon } from "@/components/Icon"
import { executeWalletMergeLockups } from "@/contract-apis/executeWalletMergeLockups"
import { useChain } from "@cosmos-kit/react"
import { useBackendData } from "@/contract-apis/useBackendData"
import { executeWalletSplitLockup } from "@/contract-apis/executeWalletSplitLockup"
import {
  AlertCircle,
  Check,
  Equal,
  Loader2,
  Plus,
  SquaresUnite,
  X,
} from "lucide-react"
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

interface MintingStep {
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

  const { address, lockups, isLoading: isContextLoading } = useBackendData()
  // const [currentLockups, setCurrentLockups] = useState(lockups)
  const [step, setStep] = useState<MintStep>("init")
  const [lastActiveStep, setLastActiveStep] = useState<number>(1)

  const [operationContext, setOperationContext] = useState<{
    isDAtom: boolean
    eligibleLockupsSizes?: LockupsResult
    matchingLockups?: AugmentedLockup[]
  }>({ isDAtom: false })

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

  // Main reactive handler for all blockchain operations
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
          console.log(
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
          console.error(`Error in step ${step}:`, error)
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
      } else if (step === "merge" || step === "split") {
        setLastActiveStep(2)
      } else if (step === "success") {
        setLastActiveStep(3)
      }
    }
  }, [step])

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

  // Individual operation executors
  async function executeSplit(freshLockups: AugmentedLockup[]) {
    console.log("Executing split with fresh lockups:", freshLockups.length)

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups // Use passed fresh lockups
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

    console.log("Split completed successfully")
    setIsLoading(false)
    // handleCloseModal()
    await revalidateTag("backendData")
    setStep("success")
  }

  async function executeMerge(freshLockups: AugmentedLockup[]) {
    console.log("Executing merge with fresh lockups:", freshLockups.length)

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups // Use passed fresh lockups
    )

    await executeWalletMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: freshLockupsData.selectedLockups.map((el) => el.id),
    })

    await revalidateTag("backendData")
    console.log("Merge completed, triggering split...")
    handleStepInterval("split")
  }

  async function executeConvert(freshLockups: AugmentedLockup[]) {
    console.log(
      "Executing convert to dATOM with fresh lockups:",
      freshLockups.length
    )

    if (!operationContext.eligibleLockupsSizes?.hasVirtualLockups) {
      throw new Error("No virtual lockups to convert")
    }

    await executeWalletCovertToDAtomLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: operationContext.eligibleLockupsSizes.virtualLockups.map(
        (v) => v.id
      ),
    })

    await revalidateTag("backendData")
    console.log("Convert completed, triggering merge...")
    handleStepInterval("merge_after_convert")
  }

  async function executeMergeAfterConvert(freshLockups: AugmentedLockup[]) {
    console.log(
      "Executing merge after convert with fresh lockups:",
      freshLockups.length
    )

    const freshLockupsData = await findLockupsForNFtSizes(
      nftInfo.amount,
      nftInfo.baseDenom,
      freshLockups // Use passed fresh lockups
    )

    await executeWalletMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: freshLockupsData.selectedLockups.map((el) => el.id),
    })

    await revalidateTag("backendData")
    console.log("Merge after convert completed, triggering split...")
    handleStepInterval("split")
  }

  async function executeMergeMatchingDenoms(freshLockups: AugmentedLockup[]) {
    console.log(
      "Executing merge matching denoms with fresh lockups:",
      freshLockups.length
    )

    if (!operationContext.matchingLockups) {
      throw new Error("No matching lockups to merge")
    }

    await executeWalletMergeLockups({
      getSigningCosmWasmClient,
      address,
      lockIds: operationContext.matchingLockups.map((v) => v.id),
    })

    await revalidateTag("backendData")
    console.log("Merge matching denoms completed")

    const timeOut = setTimeout(async () => {
      // After merging matching denoms, we might need to do more operations
      // Check what's needed next based on the current state
      const freshLockupsData = await findLockupsForNFtSizes(
        nftInfo.amount,
        nftInfo.baseDenom,
        freshLockups // Use passed fresh lockups
      )

      if (
        freshLockupsData.hasVirtualLockups &&
        freshLockupsData.hasMultipleDenoms
      ) {
        handleStepInterval("convert")
      } else if (freshLockupsData.selectedLockupsCount > 1) {
        handleStepInterval("merge")
      } else {
        handleStepInterval("split")
      }
    }, 10000)

    return () => clearTimeout(timeOut)
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
      let eligibleLockupsSizes = await findLockupsForNFtSizes(
        nftInfo.amount,
        nftInfo.baseDenom,
        lockups
      )

      const isDAtom = nftInfo.displayDenom === "dATOM"

      // Store context for the reactive handlers
      setOperationContext({
        isDAtom,
        eligibleLockupsSizes,
      })

      console.log("Starting mint process:", {
        isDAtom,
        selectedLockupsCount: eligibleLockupsSizes.selectedLockupsCount,
        hasVirtualLockups: eligibleLockupsSizes.hasVirtualLockups,
        hasMatchingDenoms: eligibleLockupsSizes.hasMatchingDenoms,
        hasMultipleDenoms: eligibleLockupsSizes.hasMultipleDenoms,
      })

      // STEP 1: Non-dATOM, 1 lockup => Split
      if (!isDAtom && eligibleLockupsSizes.selectedLockupsCount === 1) {
        console.log("Non-dATOM: Single lockup, triggering split")
        setStep("split")
        return
      }

      // STEP 2: Non-dATOM, >1 lockups => Merge -> Split
      if (!isDAtom && eligibleLockupsSizes.selectedLockupsCount > 1) {
        console.log("Non-dATOM: Multiple lockups, triggering merge")
        setStep("merge")
        return
      }

      // STEP 3: dATOM with no virtuals => use step 1 or 2 logic
      if (isDAtom && !eligibleLockupsSizes.hasVirtualLockups) {
        console.log("dATOM: No virtual lockups")

        if (eligibleLockupsSizes.selectedLockupsCount > 1) {
          console.log("dATOM: Multiple lockups, triggering merge")
          setStep("merge")
        } else {
          console.log("dATOM: Single lockup, triggering split")
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
        console.log(
          "dATOM: Virtual lockups with matching denoms, triggering merge matching denoms"
        )

        const matchingDenom = eligibleLockupsSizes.virtualLockups[0].funds.denom
        const matchingLockups = eligibleLockupsSizes.virtualLockups.filter(
          (v) => v.funds.denom === matchingDenom
        )

        setOperationContext((prev) => ({
          ...prev,
          matchingLockups,
        }))

        setStep("merge_matching_denoms")
        return
      }

      // STEP 5-6-8-9: dATOM → Convert virtuals → Merge → Split
      if (
        isDAtom &&
        eligibleLockupsSizes.hasVirtualLockups &&
        eligibleLockupsSizes.hasMultipleDenoms
      ) {
        console.log(
          "dATOM: Virtual lockups with multiple denoms, triggering convert"
        )
        setStep("convert")
        return
      }

      // If we get here, something unexpected happened
      console.warn("Unexpected state in handleSubmitCreationForm", {
        isDAtom,
        eligibleLockupsSizes,
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Error in handleSubmitCreationForm:", error)
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
      return { activeStep: 3, status: "success" }
    }

    if (step === "init") {
      return { activeStep: 1, status: "default" }
    }

    if (step === "selected") {
      return { activeStep: 1, status: "success" }
    }

    if (step === "merge" || step === "split" || step === "convert") {
      return { activeStep: 2, status: "pending" }
    }

    if (step === "error") {
      const failedAtStep = lastActiveStep
      return {
        activeStep: 1,
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
        title: "Mint",
      },
      {
        id: 2,
        title:
          step === "split"
            ? "Splitting"
            : step === "merge"
              ? "Merging"
              : "Merge/Split",
      },
      {
        id: 3,
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
                "pr-6": isMobile && !nftDetails,
              })}
            >
              <div className=" mx-auto mb-4 flex flex-row justify-center ">
                {steps.map((el, index) => (
                  <div key={el.id} className="flex items-center">
                    <div className="flex w-10 flex-1 flex-col items-center gap-3 md:w-24">
                      <div className="flex flex-row items-center justify-center">
                        <div
                          className={cn(
                            "flex size-10 flex-col items-center justify-center rounded-full border-2 text-lg font-semibold transition-colors",
                            {
                              "border-palette-green/70 bg-palette-green/70 text-white":
                                el.status === "success",
                              "border-red-500 bg-red-500 text-white":
                                el.status === "error",
                              "border-palette-blue/90 bg-palette-blue/90 text-white":
                                el.status === "pending",
                              "border-gray-200 bg-white text-gray-400":
                                el.status === "default",
                            }
                          )}
                        >
                          {el.status === "success" ? (
                            <Check size={20} />
                          ) : el.status === "error" ? (
                            <AlertCircle size={20} />
                          ) : el.status === "pending" ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            el.id
                          )}
                        </div>
                      </div>
                      <div className="pt-2 ">
                        <p
                          className={cn("text-sm font-medium", {
                            "text-palette-green/90": el.status === "success",
                            "text-red-600": el.status === "error",
                            "text-palette-blue/90": el.status === "pending",
                            "text-gray-500": el.status === "default",
                          })}
                        >
                          {el.title}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn("-mt-10  h-0.5 w-16 bg-gray-200", {
                          "bg-palette-green/90": el.status === "success",
                          "bg-palette-blue/90": el.status === "pending",
                        })}
                      />
                    )}
                  </div>
                ))}
              </div>
              {nftDetails ? (
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={nftInfo.image}
                      alt={"nft.denom"}
                      className="size-60"
                    />
                  </div>
                  {isNFTLoading ? (
                    <div className="h-auto flex-1 animate-pulse rounded-md bg-gray-200/10" />
                  ) : (
                    <div className="from-palette-green/0 to-palette-green/20 h-fit flex-1 bg-gradient-to-r p-3 pl-6">
                      <div className="flex items-center justify-between">
                        <span className="text-palette-beige flex items-center gap-2 text-sm uppercase">
                          <SquaresUnite className="fill-palette-beige size-4" />
                          {pluralize({
                            count: eligibleLockupsSizes?.selectedLockupsCount,
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
                              {formatAmount(
                                eligibleLockupsSizes.remainder,
                                0,
                                3
                              )}
                            </strong>{" "}
                            {nftInfo.displayDenom} will be created
                          </span>
                        ) : null}
                      </div>

                      {/* Debug info */}
                      {step !== "init" && (
                        <div className="mt-4 text-xs text-white/60">
                          Current step: {step}
                          {isContextLoading && " (waiting for context...)"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <MintNftCard
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
