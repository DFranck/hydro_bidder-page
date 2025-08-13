"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { formatAmount } from "@/lib/formatAmount"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { broadcastTx } from "../transactions/broadcastTx"
import { signRedeemTokensForShares } from "../transactions/signRedeemTokensForShares"
import { Step } from "./Step"
import { stepLabels } from "@/constants/lock-atom"
import { ContinueLockForm } from "../components/ContinueLockForm"
import { useChainsAndSigners } from "@/components/ChainsAndSignersProvider"
import { useIncompleteNotices } from "@/components/IncompleteNoticesProvider"

function getValidatorMoniker(
  validator: string,
  validatorMap: Map<string, Validator>
): string {
  return validatorMap.get(validator)?.description.moniker || validator
}

export type RevertFromHubStep =
  | "Init"
  | "WaitingForRedeemSigning"
  | "WaitingForRedeemBroadcast"
  | "Success"
  | "Error"

export const RevertFromHubStepper = ({
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
  const [step, setStep] = useState<RevertFromHubStep>("Init")
  const [errorLog, setErrorLog] = useState<string>("RevertFromHubStepper: ")
  const [showErrorLog, setShowErrorLog] = useState(false)
  const [amount, setNewAmount] = useState(lockedAmount)

  const router = useRouter()

  const execute = async () => {
    try {
      setErrorLog(
        `Starting execution with amount: ${amount}, validator: ${validator}, denom: ${denom}`
      )

      if (
        !hubChain.address ||
        !hubSigner ||
        !neutronChain.address ||
        !neutronSigner
      ) {
        throw new Error("Signing clients or addresses not available")
      }

      // Wait for the user to sign the redeem transaction
      setStep("WaitingForRedeemSigning")
      const signedRedeemTx = await signRedeemTokensForShares(
        hubChain,
        hubSigner,
        amount,
        denom
      )

      // Broadcast the redeem transaction
      setStep("WaitingForRedeemBroadcast")
      const redeemBroadcastResult = await broadcastTx(
        hubSigner,
        neutronSigner,
        signedRedeemTx
      )

      setStep("Success")
      deleteIncompleteNotice(denom, amount)
    } catch (error: any) {
      console.error("Error during revert process:", error)
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
      disabled?: boolean
    }[]
  } {
    switch (step) {
      case "Init":
        return {
          title: `Revert ${formatAmount(amount)} ${process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}`,
          contents: (
            <>
              <p>
                You&rsquo;re about to revert{" "}
                <strong className="text-white">
                  {formatAmount(amount)}{" "}
                  {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}
                </strong>{" "}
                back to its original state, staked with{" "}
                <strong className="break-all text-white">
                  {getValidatorMoniker(validator, validatorMap)}
                </strong>
                .
              </p>
              <ContinueLockForm
                validator={validator}
                amount={amount}
                maxAmount={lockedAmount}
                handleNewAmount={setNewAmount}
              />
              <p>
                This should take about a minute and will require 1 wallet
                approval.
              </p>
            </>
          ),
          buttons: [
            {
              label: "Revert",
              onClick: execute,
              disabled: Number(amount) > Number(lockedAmount) || amount === "0",
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
      case "WaitingForRedeemSigning":
        return {
          isWorking: true,
          title: "Approve Redemption",
          contents: (
            <>
              <p>Approve the transaction in your wallet to continue</p>
              <p>
                This will restore your previous staked position with the amount
                of{" "}
                <strong className="text-white">
                  {formatAmount(amount)}{" "}
                  {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}
                </strong>{" "}
                staked to{" "}
                <strong className="break-all text-white">
                  {getValidatorMoniker(validator, validatorMap)}
                </strong>
                .
              </p>
            </>
          ),
        }
      case "WaitingForRedeemBroadcast":
        return {
          isWorking: true,
          title: `Redeeming ${process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}`,
          contents: (
            <>
              <p>Redeeming {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}...</p>
              <p>
                Hang tight, we&rsquo;re restoring your previous staked position.
              </p>
            </>
          ),
        }
      case "Success":
        return {
          revalidateCache: true,
          title: "Success!",
          contents: (
            <>
              <p>
                Your{" "}
                <strong className="text-white">
                  {formatAmount(amount)}{" "}
                  {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}
                </strong>{" "}
                has been restored to your previous staked position.
              </p>
            </>
          ),
          buttons: [
            {
              label: "Done",
              onClick: () => {
                router.push("/lock-atom")
                onExit()
              },
            },
          ],
        }
      case "Error":
        return {
          title: "Transaction Error",
          contents: (
            <div className="mt-4 overflow-hidden">
              {!showErrorLog ? (
                <>
                  <p>
                    This transaction could not be completed. Your staked{" "}
                    {process.env.NEXT_PUBLIC_STAKED_TOKEN_NAME}
                    has not been reverted.
                  </p>
                  <p>
                    Refresh the page to try again or recover your staked{" "}
                    {process.env.NEXT_PUBLIC_STAKED_TOKEN_NAME}.
                  </p>

                  <StyledText
                    as="button"
                    variant="link.subtle"
                    onClick={() => setShowErrorLog(true)}
                    className="mt-4"
                  >
                    Show Error Log
                    <Icon name="solid:chevron-down" />
                  </StyledText>
                </>
              ) : (
                <pre className="max-h-40 overflow-scroll whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs text-black">
                  {errorLog}
                </pre>
              )}
            </div>
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
      steps={step}
      stepLabels={stepLabels}
      modalTitle="Revert Back"
      amount={`${formatAmount(amount)} ATOM`}
    />
  )
}
