"use client"

import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { revalidateTag } from "@/lib/revalidateTag"
import { useRouter } from "next/navigation"
import { ReactNode, use, useEffect, useState } from "react"
import { LockStep } from "./LockStepper"
import { X, Check, AlertCircle, Loader2 } from "lucide-react"
import { RevertFromHubStep } from "./RevertFromHubStepper"
import { RevertFromNeutronStep } from "./RevertFromNeutronStepper"
import { ClaimRewardsStep } from "../../rewards/ClaimRewardsStepper"
import { ContinueFromNeutronStep } from "./ContinueFromNeutronStepper"
import { cn } from "@/lib/utils"

interface StakingStep {
  id: number
  title: string
  status: "default" | "pending" | "error" | "success"
}

export function Step({
  title,
  contents,
  buttons,
  isWorking,
  revalidateCache,
  steps: currentStep,
  stepLabels,
  execute,
  amount,
  modalTitle,
}: {
  title?: ReactNode
  contents: ReactNode
  buttons?: {
    label: ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
  }[]
  isWorking?: boolean
  revalidateCache?: boolean
  steps?:
    | LockStep
    | RevertFromHubStep
    | RevertFromNeutronStep
    | ClaimRewardsStep
    | ContinueFromNeutronStep
  stepLabels?: {
    labelOne: string
    labelTwo: string
    labelThree: string
  }
  execute?: () => Promise<void>
  amount?: string
  modalTitle?: string
}) {
  const { setToasts } = useToasts()
  const router = useRouter()

  const [lastActiveStep, setLastActiveStep] = useState<number>(1)

  useEffect(() => {
    if (
      currentStep !== "Error" &&
      currentStep !== "Init" &&
      currentStep !== "Success"
    ) {
      if (
        currentStep === "WaitingForTokenizeSigning" ||
        currentStep === "WaitingForTokenizeBroadcast" ||
        currentStep === "WaitingForRedeemSigning"
      ) {
        setLastActiveStep(1)
      } else if (
        currentStep === "WaitingForIBCSigning" ||
        currentStep === "WaitingForIBCBroadcastAndRelay"
      ) {
        setLastActiveStep(2)
      } else if (
        currentStep === "WaitingForLockingSigning" ||
        currentStep === "WaitingForLockingBroadcast"
      ) {
        setLastActiveStep(3)
      }
    }
  }, [currentStep])

  useEffect(() => {
    if (!!currentStep && !["Init", "Success"].includes(currentStep)) {
      if (execute) {
        execute()
      }
    }
  }, [])

  const getCurrentStepInfo = (): {
    activeStep: number
    status: "default" | "pending" | "error" | "success"
    failedStep?: number
  } => {
    if (currentStep === "Success") {
      return { activeStep: 3, status: "success" }
    }

    if (currentStep === "Init") {
      return { activeStep: 1, status: "default" }
    }

    if (
      currentStep === "WaitingForTokenizeSigning" ||
      currentStep === "WaitingForTokenizeBroadcast" ||
      currentStep === "WaitingForRedeemSigning"
    ) {
      return { activeStep: 1, status: "pending" }
    }

    if (
      currentStep === "WaitingForIBCSigning" ||
      currentStep === "WaitingForIBCBroadcastAndRelay" ||
      currentStep === "WaitingForRedeemBroadcast"
    ) {
      return { activeStep: 2, status: "pending" }
    }

    if (
      currentStep === "WaitingForLockingSigning" ||
      currentStep === "WaitingForLockingBroadcast" ||
      currentStep === "WaitingForIBCBroadcast"
    ) {
      return { activeStep: 3, status: "pending" }
    }

    if (currentStep === "Error" || currentStep === "NoHubGasError") {
      const failedAtStep = lastActiveStep

      return {
        activeStep: failedAtStep,
        status: "error",
        failedStep: failedAtStep,
      }
    }

    return { activeStep: 1, status: "default", failedStep: lastActiveStep }
  }

  const { activeStep, status, failedStep } = getCurrentStepInfo()

  const generateSteps = (): StakingStep[] => {
    const baseSteps = [
      {
        id: 1,
        title: stepLabels?.labelOne ?? "Tokenize your Staked ATOM",
      },
      {
        id: 2,
        title: stepLabels?.labelTwo ?? "Transfer your Tokenized ATOM to Hydro",
      },
      {
        id: 3,
        title: stepLabels?.labelThree ?? "Lock your ATOM, get voting power",
      },
    ]

    return baseSteps.map((step) => {
      let stepStatus: "default" | "pending" | "error" | "success" = "default"

      if (currentStep === "Success") {
        stepStatus = "success"
      } else if (currentStep === "Error" && failedStep !== undefined) {
        if (step.id === failedStep) {
          stepStatus = "error"
        } else if (step.id < failedStep) {
          stepStatus = "success"
        } else {
          stepStatus = "default"
        }
      } else if (currentStep === "Init") {
        stepStatus = "default"
      } else if (step.id === activeStep) {
        stepStatus = status
      } else if (step.id < activeStep) {
        stepStatus = "success"
      } else {
        stepStatus = "default"
      }

      return {
        ...step,
        status: stepStatus,
      }
    })
  }

  const steps = generateSteps()

  useEffect(() => {
    if (revalidateCache) {
      async function revalidateTags() {
        setToasts([toastMessages.reloadingTheWindow])

        await revalidateTag("backendData")

        setTimeout(() => {
          setToasts([])
          router.push("/lockups")
          router.refresh()
        }, 3000)
      }

      revalidateTags()
    }
  }, [revalidateCache])

  return (
    <Card
      className={cn("w-md m-6 grid  gap-4  md:m-auto", {
        "md:grid-cols-1": !currentStep,
        "md:grid-cols-12": !!currentStep,
      })}
    >
      {!!currentStep && (
        <div className="col-span-12 md:col-span-4">
          {!!amount && (
            <div className="hidden mb-4 md:flex md:flex-col">
              <StyledText className="uppercase leading-6 tracking-wide">
                {modalTitle ?? " Lock Amount"}
              </StyledText>
              <StyledText variant="h4">{amount}</StyledText>
            </div>
          )}
            <div className="flex flex-row justify-center md:justify-start md:flex-col md:space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-row items-center md:flex-col">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full border-2 text-lg font-semibold transition-colors",
                        {
                          "border-palette-green bg-palette-green text-white":
                            step.status === "success",
                          "border-red-500 bg-red-500 text-white":
                            step.status === "error",
                          "border-palette-blue/90 bg-palette-blue/90 text-white":
                            step.status === "pending",
                          "border-gray-200 bg-white text-gray-400":
                            step.status === "default",
                        }
                      )}
                    >
                      {step.status === "success" ? (
                        <Check size={20} />
                      ) : step.status === "error" ? (
                        <AlertCircle size={20} />
                      ) : step.status === "pending" ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn("mt-0 mx-2 h-0.5  w-8 bg-gray-200 md:mt-2 md:mx-0 md:w-0.5 md:h-16", {
                          "bg-palette-green": step.status === "success",
                          "bg-palette-blue/90": step.status === "pending",
                        })}
                      />
                    )}
                  </div>
                  <div className="hidden pt-2 md:block">
                    <p
                      className={cn("text-sm font-medium", {
                        success: step.status === "success",
                        "text-red-600": step.status === "error",
                        "text-palette-blue/90": step.status === "pending",
                        "text-gray-500": step.status === "default",
                      })}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}
      <div className="col-span-12 flex flex-col justify-start  gap-2 md:justify-center md:col-span-8">
        {title && (
          <Card.Header
            title={title}
            variant="h5"
            className="mt-4 pb-0 md:mt-0"
          />
        )}

        {contents && (
          <Card.Body>
            <ConditionalWrapper
              condition={!!isWorking}
              wrapper={(children) => (
                <div className="flex flex-col gap-3">{children}</div>
              )}
            >
              {contents}
            </ConditionalWrapper>
          </Card.Body>
        )}

        {buttons && (
          <Card.Footer>
            {buttons.map((button, index) => (
              <StyledText
                as="button"
                key={index}
                className={button.className}
                variant={index === 0 ? "button.primary" : "button.secondary"}
                onClick={button.onClick}
                disabled={button.disabled}
              >
                {button.label}
              </StyledText>
            ))}
          </Card.Footer>
        )}
      </div>
    </Card>
  )
}
