"use client"

import { Step } from "@/app/(with-backend-data)/lock-atom/steppers/Step"
import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { scaleLockupPower } from "@/lib/scaleLockupPower"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { signLockTokens } from "../transactions/signLockTokens"
import { useIncompleteNotices } from "../useIncompleteNotices"

type ContinueFromNeutronStep =
  | "Init"
  | "WaitingForLockSigning"
  | "WaitingForLockBroadcast"
  | "Success"
  | "Error"

function getValidatorMoniker(
  validator: string,
  validatorMap: Map<string, Validator>
): string {
  return validatorMap.get(validator)?.description.moniker || validator
}

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

  function getStepContents(): {
    isWorking?: boolean
    revalidateCache?: boolean
    title?: ReactNode
    contents: ReactNode
    buttons?: {
      label: ReactNode
      onClick?: () => void
      className?: string
    }[]
  } {
    switch (step) {
      case "Init":
        return {
          title: `Continue Locking ${formatAmount(amount)} ATOM`,
          contents: (
            <>
              <p>
                Nice! You&rsquo;re about to lock{" "}
                <strong>{formatAmount(amount)} ATOM</strong> staked to{" "}
                <strong>{getValidatorMoniker(validator, validatorMap)}</strong>{" "}
                in Hydro to get{" "}
                <strong>
                  {formatAmount(
                    scaleLockupPower({
                      lockedAtomEpochInNanos,
                      lockupTime: lockDuration,
                      rawPower: BigInt(amount),
                    })
                  )}{" "}
                  voting power.
                </strong>
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  executeContinueFromNeutron()
                }}
              >
                <div className="mb-4">
                  <label className="mb-2 block">Select Lock Duration:</label>
                  <InputForLockupPeriod
                    selectedDuration={lockDuration}
                    onChange={(value) => setLockDuration(value)}
                  />
                </div>
                <p>This will require one wallet approval.</p>
              </form>
            </>
          ),
          buttons: [
            {
              label: "Lock",
              onClick: executeContinueFromNeutron,
            },
            {
              label: "Cancel",
              onClick: () => {
                router.push("/lock-atom")
                onExit()
              },
            },
          ],
        }
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
      case "Success":
        return {
          revalidateCache: true,
          title: "Success!",
          contents: (
            <p>
              You locked <strong>{formatAmount(amount)} ATOM</strong> in Hydro
              and received{" "}
              <strong>
                {formatAmount(
                  scaleLockupPower({
                    lockedAtomEpochInNanos,
                    lockupTime: lockDuration,
                    rawPower: BigInt(amount),
                  })
                )}{" "}
                voting power.
              </strong>
            </p>
          ),
          buttons: [
            {
              label: "Start Voting",
              onClick: () => {
                router.push("/bids")
                onExit()
              },
            },
          ],
        }
      case "Error":
        return {
          title: "Transaction Error",
          contents: (
            <>
              <p>
                This transaction could not be completed. Your staked ATOM has
                not been locked in Hydro.
              </p>
              <p>Refresh the page to try again or recover your staked ATOM.</p>
              <div className="mt-4">
                {!showErrorLog ? (
                  <StyledText
                    as="button"
                    variant="link.subtle"
                    onClick={() => setShowErrorLog(true)}
                  >
                    Show Error Log
                    <Icon name="solid:chevron-down" />
                  </StyledText>
                ) : (
                  <pre className="mt-2 whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs text-black">
                    {errorLog}
                  </pre>
                )}
              </div>
            </>
          ),
          buttons: [
            {
              label: "Refresh page",
              onClick: () => window.location.reload(),
            },
          ],
        }
      default:
        return {
          contents: null,
        }
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
