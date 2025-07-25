"use client"

import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signLockTokens } from "../transactions/signLockTokens"
import { CommonSteps } from "./CommonSteps"
import {
  getCommonStepContents,
  StepContent,
} from "./shared/LockAtomStepperCommon"
import { Step } from "./Step"
import { formatAmount } from "@/lib/formatAmount"
import { useChainsAndSigners } from "@/components/ChainsAndSignersProvider"
import { useIncompleteNotices } from "@/components/IncompleteNoticesProvider"

export type ContinueFromNeutronStep =
  | "Init"
  | "WaitingForLockingSigning"
  | "WaitingForLockingBroadcast"
  | "Success"
  | "Error"

export const ContinueFromNeutronStepper = ({
  amount: lockedAmount,
  validator,
  denom,
  onExit,
  validatorMap,
}: {
  amount: string
  validator: string
  denom: string
  onExit: () => void
  validatorMap: Map<string, Validator>
}) => {
  const { deleteIncompleteNotice } = useIncompleteNotices()
  const { hubChain, neutronChain, hubSigner, neutronSigner } =
    useChainsAndSigners()
  const { lockedTokenEpochInNanos, hasGatekeeper } = useBackendData()
  const router = useRouter()
  const [step, setStep] = useState<ContinueFromNeutronStep>("Init")
  const [errorLog, setErrorLog] = useState<string>(
    "ContinueFromNeutronStepper: ",
  )
  const [showErrorLog, setShowErrorLog] = useState(false)
  const [lockDuration, setLockDuration] = useState(lockedTokenEpochInNanos)
  const [amount, setNewAmount] = useState(lockedAmount)

  const executeContinueFromNeutron = async () => {
    try {
      setErrorLog(
        `Starting execution with amount: ${amount}, validator: ${validator}, denom: ${denom}, lockDuration: ${lockDuration}`,
      )

      if (
        !hubChain.address ||
        !hubSigner ||
        !neutronChain.address ||
        !neutronSigner
      ) {
        throw new Error("Signing clients or addresses not available")
      }

      // Wait for the user to sign the lock tokens transaction
      setStep("WaitingForLockingSigning")
      const signedLockTx = await signLockTokens(
        neutronChain,
        neutronSigner,
        lockDuration,
        denom,
        amount,
        hasGatekeeper
      )

      // Broadcast the lock tokens transaction
      // setStep('WaitingForLockingBroadcast');

      setStep("Success")
      deleteIncompleteNotice(denom, amount)
    } catch (error: any) {
      console.error("Error in executeContinueFromNeutron:", error)
      setStep("Error")
      setErrorLog((prevLog) => `${prevLog}\nError: ${error.message}`)
    }
  }

  function getStepContents(): StepContent {
    if (["Init", "Success", "Error"].includes(step)) {
      return getCommonStepContents({
        step: step as "Init" | "Success" | "Error",
        amount,
        validator,
        validatorMap,
        lockDuration,
        lockedTokenEpochInNanos,
        errorLog,
        showErrorLog,
        setShowErrorLog,
        onExecute: executeContinueFromNeutron,
        onCancel: () => {
          router.push("/lock-atom")
          onExit()
        },
        setLockDuration,
        numApprovals: 1,
        maxAmount: lockedAmount,
        setNewAmount,
      })
    }

    switch (step) {
      case "WaitingForLockingSigning":
        return CommonSteps("WaitingForLockingSigning")
      case "WaitingForLockingBroadcast":
        return CommonSteps("WaitingForLockingBroadcast")
      default:
        return { contents: null }
    }
  }

  const { title, contents, buttons, isWorking } = getStepContents()

  return (
    <Step
      title={title}
      contents={contents}
      buttons={buttons}
      isWorking={isWorking}
      steps={step}
      execute={executeContinueFromNeutron}
      amount={`${formatAmount(amount)} ATOM`}
    />
  )
}
