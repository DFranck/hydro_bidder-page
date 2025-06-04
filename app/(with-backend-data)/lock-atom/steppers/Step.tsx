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
  execute,
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
  steps: LockStep | RevertFromHubStep | RevertFromNeutronStep | ClaimRewardsStep
  execute?: () => Promise<void>
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
    if (!["Init", "Success"].includes(currentStep)) {
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

    return { activeStep: 1, status: "default" }
  }

  const { activeStep, status, failedStep } = getCurrentStepInfo()

  const generateSteps = (): StakingStep[] => {
    const baseSteps = [
      { id: 1, title: "Tokenize your Staked ATOM" },
      { id: 2, title: "Transfer your Tokenized ATOM to Hydro" },
      { id: 3, title: "Lock your ATOM, get voting power" },
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
      className={`
        w-md
        mx-8
        grid
        grid-cols-1
        gap-4
        md:mx-auto
        md:grid-cols-2
      `}
    >
      <div>
        <div className="space-y-6">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full border-2 text-lg font-semibold transition-colors ${
                      step.status === "success"
                        ? "border-green-500 bg-green-500 text-white"
                        : step.status === "error"
                          ? "border-red-500 bg-red-500 text-white"
                          : step.status === "pending"
                            ? "border-purple-600 bg-purple-600 text-white"
                            : "border-gray-200 bg-white text-gray-400"
                    }`}
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
                      className={`mt-2 h-16 w-0.5 ${
                        step.status === "success"
                          ? "bg-green-500"
                          : step.status === "pending"
                            ? "bg-purple-600"
                            : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pt-3">
                  <p
                    className={`text-sm font-medium ${
                      step.status === "success"
                        ? "text-green-600"
                        : step.status === "error"
                          ? "text-red-600"
                          : step.status === "pending"
                            ? "text-purple-700"
                            : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-6">
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
