"use client"

import { Step } from "@/app/(with-backend-data)/lock-atom/steppers/Step"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signLockTokens } from "../transactions/signLockTokens"
import { useIncompleteNotices } from "../useIncompleteNotices"
import {
  getCommonStepContents,
  StepContent,
} from "./shared/LockAtomStepperCommon"

type ContinueFromNeutronStep =
  | "Init"
  | "WaitingForLockSigning"
  | "WaitingForLockBroadcast"
  | "Success"
  | "Error"

export const ContinueFromNeutronStepper = ({
  amount,
  validator,
  denom,
  startState,
  onExit,
  validatorMap,
}: {
  amount: string
  validator: string
  denom: string
  startState?: ContinueFromNeutronStep
  onExit: () => void
  validatorMap: Map<string, Validator>
}) => {
  const { hubChain, neutronChain, deleteIncompleteNotice } =
    useIncompleteNotices()
  const { lockedAtomEpochInNanos } = useBackendData()
  const router = useRouter()
  const [step, setStep] = useState<ContinueFromNeutronStep>(
    startState || "Init"
  )
  const [errorLog, setErrorLog] = useState<string>(
    "ContinueFromNeutronStepper: "
  )
  const [showErrorLog, setShowErrorLog] = useState(false)
  const [lockDuration, setLockDuration] = useState(lockedAtomEpochInNanos)

  const executeContinueFromNeutron = async () => {
    try {
      setErrorLog(
        `Starting execution with amount: ${amount}, validator: ${validator}, denom: ${denom}, lockDuration: ${lockDuration}`
      )
      const hubSigner = await hubChain.getSigningStargateClient()
      const neutronSigner = await neutronChain.getSigningStargateClient()

      if (
        !hubChain.address ||
        !hubSigner ||
        !neutronChain.address ||
        !neutronSigner
      ) {
        throw new Error("Signing clients or addresses not available")
      }

      // Wait for the user to sign the lock tokens transaction
      setStep("WaitingForLockSigning")
      const signedLockTx = await signLockTokens(
        neutronChain,
        neutronSigner,
        lockDuration,
        denom,
        amount
      )

      // Broadcast the lock tokens transaction
      // setStep('WaitingForLockBroadcast');

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
        lockedAtomEpochInNanos,
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
      })
    }

    switch (step) {
      case "WaitingForLockSigning":
        return {
          isWorking: true,
          title: "Approve Locking",
          contents: (
            <p>
              Approve in your wallet again to lock your ATOM into the Hydro
              contract to receive voting power.
            </p>
          ),
        }
      case "WaitingForLockBroadcast":
        return {
          isWorking: true,
          title: "Locking in Progress",
          contents: (
            <>
              <p>Locking your ATOM...</p>
              <p>Just a few seconds, unless the network is congested</p>
            </>
          ),
        }
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
    />
  )
}
