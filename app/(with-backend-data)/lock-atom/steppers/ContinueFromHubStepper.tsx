"use client"

import { EPOCH_LENGTH } from "@/config"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { broadcastAndRelayIBCHubToNeutron } from "../transactions/broadcastAndRelayIBCHubToNeutron"
import { signIBCTransferHubToNeutron } from "../transactions/signIBCTransferHubToNeutron"
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

type ContinueFromHubStep =
  | "Init"
  | "WaitingForIBCSigning"
  | "WaitingForIBCBroadcastAndRelay"
  | "WaitingForLockingSigning"
  | "WaitingForLockingBroadcast"
  | "Success"
  | "Error"

export const ContinueFromHubStepper = ({
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
  const { lockedAtomEpochInNanos } = useBackendData()
  const [step, setStep] = useState<ContinueFromHubStep>("Init")
  const [errorLog, setErrorLog] = useState<string>("ContinueFromHubStepper: ")
  const [showErrorLog, setShowErrorLog] = useState(false)
  const [lockDuration, setLockDuration] = useState(EPOCH_LENGTH)
  const [amount, setNewAmount] = useState(lockedAmount)
  const router = useRouter()

  const execute = async () => {
    try {
      setErrorLog(
        `Starting execution with amount: ${amount}, validator: ${validator}, denom: ${denom}, lockDuration: ${lockDuration}`
      )

      if (
        !hubChain.address ||
        !hubSigner ||
        !neutronChain.address ||
        !neutronSigner
      ) {
        throw new Error("Signing clients or addresses not available")
      }

      // Wait for the user to sign the IBC transfer transaction
      setStep("WaitingForIBCSigning")
      const signedIBCTx = await signIBCTransferHubToNeutron(
        hubChain,
        hubSigner,
        neutronChain,
        amount,
        denom
      )

      // Broadcast the IBC transfer transaction
      setStep("WaitingForIBCBroadcastAndRelay")
      const ibcBroadcastResult = await broadcastAndRelayIBCHubToNeutron(
        hubSigner,
        hubChain,
        neutronSigner,
        neutronChain,
        denom,
        signedIBCTx
      )

      // Wait for the user to sign the lock tokens transaction
      setStep("WaitingForLockingSigning")
      const signedLockTx = await signLockTokens(
        neutronChain,
        neutronSigner,
        lockDuration,
        ibcBroadcastResult.denom,
        amount
      )

      // Broadcast the lock tokens transaction
      setStep("WaitingForLockingBroadcast")
      // await broadcastTx(neutronSigner, hubSigner, signedLockTx);

      setStep("Success")
      deleteIncompleteNotice(denom, amount)
    } catch (error: any) {
      console.error("Error during process:", error)
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
        onExecute: execute,
        onCancel: () => {
          router.push("/lock-atom")
          onExit()
        },
        setLockDuration,
        numApprovals: 2,
        maxAmount: lockedAmount,
        setNewAmount,
      })
    }

    switch (step) {
      case "WaitingForIBCSigning":
        return CommonSteps("WaitingForIBCSigning")
      case "WaitingForIBCBroadcastAndRelay":
        return CommonSteps("WaitingForIBCBroadcastAndRelay")
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
      execute={execute}
      amount={`${formatAmount(amount)} ATOM`}
    />
  )
}
