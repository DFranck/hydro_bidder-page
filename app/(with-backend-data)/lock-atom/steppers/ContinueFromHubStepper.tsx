"use client"

import { Step } from "@/app/(with-backend-data)/lock-atom/steppers/Step"
import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { EPOCH_LENGTH } from "@/config"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { broadcastAndRelayIBCHubToNeutron } from "../transactions/broadcastAndRelayIBCHubToNeutron"
import { signIBCTransferHubToNeutron } from "../transactions/signIBCTransferHubToNeutron"
import { signLockTokens } from "../transactions/signLockTokens"
import {
  getCommonStepContents,
  StepContent,
} from "./shared/LockAtomStepperCommon"

type ContinueFromHubStep =
  | "Init"
  | "WaitingForIBCSigning"
  | "WaitingForIBCBroadcastAndRelay"
  | "WaitingForLockingSigning"
  | "WaitingForLockingBroadcast"
  | "Success"
  | "Error"

export const ContinueFromHubStepper = ({
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
  startState?: ContinueFromHubStep
  onExit: () => void
  validatorMap: Map<string, Validator>
}) => {
  const { hubChain, neutronChain, deleteIncompleteNotice } =
    useIncompleteNotices()
  const { lockedAtomEpochInNanos } = useBackendData()
  const [step, setStep] = useState<ContinueFromHubStep>(startState || "Init")
  const [errorLog, setErrorLog] = useState<string>("ContinueFromHubStepper: ")
  const [showErrorLog, setShowErrorLog] = useState(false)
  const [lockDuration, setLockDuration] = useState(EPOCH_LENGTH)
  const router = useRouter()

  const execute = async () => {
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
      })
    }

    switch (step) {
      case "WaitingForIBCSigning":
        return {
          isWorking: true,
          title: "Approve IBC Transfer",
          contents: (
            <>
              <p>Approve the transaction in your wallet to continue</p>
              <p>
                This will start the transfer of your tokenized ATOM to Hydro to
                start the locking process.
              </p>
            </>
          ),
        }
      case "WaitingForIBCBroadcastAndRelay":
        return {
          isWorking: true,
          title: "Transferring to Hydro",
          contents: (
            <>
              <p>Sending your staked ATOM to Hydro...</p>
              <p>
                This could take 30 seconds or longer if the network is
                congested. If you exit Hydro, this status may not be visible
                when you return, but the transfer will continue. Once the
                transfer is complete, you will need to return to initiate the
                lockup process.
              </p>
            </>
          ),
        }
      case "WaitingForLockingSigning":
        return {
          isWorking: true,
          title: "Approve Locking",
          contents: (
            <p>
              Approve in your wallet again to lock your ATOM. This will initiate
              the locking of your staked ATOM into the Hydro contract to receive
              voting power.
            </p>
          ),
        }
      case "WaitingForLockingBroadcast":
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
