"use client"

import { Step } from "@/app/(with-backend-data)/lock-atom/steppers/Step"
import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { getLockupPeriodMultiplier } from "@/lib/getLockupPeriodMultiplier"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"
import { revalidateTag } from "@/lib/revalidateTag"
import { scaleLockupPower } from "@/lib/scaleLockupPower"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"
import { twJoin } from "tailwind-merge"
import { minimumUATOMGas } from "../transactions/_consts"
import { broadcastAndRelayIBCGasToNeutron } from "../transactions/broadcastAndRelayIBCGasToNeutron"
import { broadcastAndRelayIBCHubToNeutron } from "../transactions/broadcastAndRelayIBCHubToNeutron"
import { broadcastTx } from "../transactions/broadcastTx"
import { checkForGasOnHub } from "../transactions/checkForGasOnHub"
import { checkForGasOnNeutron } from "../transactions/checkForGasOnNeutron"
import { extractLSMDenom } from "../transactions/extractLSMDenom"
import { signATOMGasTransferToNeutron } from "../transactions/signATOMGasTransferToNeutron"
import { signIBCTransferHubToNeutron } from "../transactions/signIBCTransferHubToNeutron"
import { signLockTokens } from "../transactions/signLockTokens"
import { signTokenizeShares } from "../transactions/signTokenizeShares"

function getValidatorMoniker(
  validator: string,
  validatorMap: Map<string, Validator>
): string {
  return validatorMap.get(validator)?.description.moniker || validator
}

type LockStep =
  | "Init"
  | "NoHubGasError"
  | "WaitingForNeutronGasSigning"
  | "WaitingForNeutronGasBroadcastAndRelay"
  | "WaitingForTokenizeSigning"
  | "WaitingForTokenizeBroadcast"
  | "Error"
  | "WaitingForIBCSigning"
  | "WaitingForIBCBroadcastAndRelay"
  | "WaitingForLockingSigning"
  | "WaitingForLockingBroadcast"
  | "Success"

export const LockStepper = ({
  amount,
  validator,
  lockDuration,
  startState,
  onExit,
}: {
  amount: string
  validator: string
  lockDuration: number
  startState?: LockStep
  onExit: () => void
}) => {
  const { hubChain, neutronChain, hubSigner, neutronSigner } =
    useIncompleteNotices()
  const { lockedAtomEpochInNanos } = useBackendData()
  const [step, setStep] = useState<LockStep>(startState || "Init")
  const [errorLog, setErrorLog] = useState<string>("LockStepper: ")
  const [showErrorLog, setShowErrorLog] = useState(false)
  const router = useRouter()

  const execute = async () => {
    try {
      setErrorLog(
        `Starting execution with amount: ${amount}, validator: ${validator}, lockDuration: ${lockDuration}`
      )
      if (
        !hubChain.address ||
        !hubSigner ||
        !neutronChain.address ||
        !neutronSigner
      ) {
        throw new Error("Signing clients or addresses not available")
      }

      const hubGasCheck = await checkForGasOnHub(hubChain)

      if (!hubGasCheck.hasEnoughUatom) {
        setStep("NoHubGasError")
        return
      }

      const neutronGasCheck = await checkForGasOnNeutron(neutronChain)

      if (!neutronGasCheck.hasEnoughUntrn && !neutronGasCheck.hasEnoughUatom) {
        setStep("WaitingForNeutronGasSigning")
        const signedTx = await signATOMGasTransferToNeutron(
          hubChain,
          hubSigner,
          neutronChain
        )

        setStep("WaitingForNeutronGasBroadcastAndRelay")
        await broadcastAndRelayIBCGasToNeutron(
          hubSigner,
          neutronChain,
          signedTx
        )
      }

      // Sign the tokenize shares transaction
      setStep("WaitingForTokenizeSigning")
      const signedTokenizeTx = await signTokenizeShares(
        hubChain,
        hubSigner,
        amount,
        validator
      )

      // Broadcast the transaction
      setStep("WaitingForTokenizeBroadcast")
      const broadcastResult = await broadcastTx(
        hubSigner,
        neutronSigner,
        signedTokenizeTx
      )

      // Extract the LSM denom
      const lsm = extractLSMDenom(broadcastResult)

      // Wait for the user to sign the IBC transfer transaction
      setStep("WaitingForIBCSigning")
      const signedIBCTx = await signIBCTransferHubToNeutron(
        hubChain,
        hubSigner,
        neutronChain,
        lsm.amount,
        lsm.denom
      )

      // Wait for the IBC transfer to be broadcast and relayed
      setStep("WaitingForIBCBroadcastAndRelay")
      const ibcBroadcastResult = await broadcastAndRelayIBCHubToNeutron(
        hubSigner,
        hubChain,
        neutronSigner,
        neutronChain,
        lsm.denom,
        signedIBCTx
      )

      // Wait for the user to sign the lock tokens transaction
      setStep("WaitingForLockingSigning")
      const signedLockTx = await signLockTokens(
        neutronChain,
        neutronSigner,
        lockDuration,
        ibcBroadcastResult.denom,
        lsm.amount
      )

      // Broadcast the lock tokens transaction
      setStep("WaitingForLockingBroadcast")
      // const lockBroadcastResult = await broadcastTx(neutronSigner, hubSigner, signedLockTx);

      setStep("Success")
    } catch (error: any) {
      console.error("Error during process:", error)
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
        const { value, unit } = getTimeUnitFromNanos(lockDuration)

        return {
          contents: (
            <div className="flex flex-col items-center gap-6">
              <p className="text-balance text-center">
                Next, you&rsquo;ll be asked to do three wallet approvals. This
                takes a minute or two, tops.
              </p>

              <div className="grid grid-cols-3 items-center gap-10">
                <div className="flex flex-col-reverse items-center justify-center gap-1">
                  <div className="text-xs text-palette-beige">ATOM Amount</div>
                  <div className="text-2xl font-bold">
                    {formatAmount(amount)}
                  </div>
                </div>

                <div className="flex flex-col-reverse items-center justify-center gap-1">
                  <div className="text-xs text-palette-beige">
                    Lock Duration
                  </div>
                  <div className="text-2xl font-bold">
                    {pluralize({
                      count: value,
                      prefixCount: true,
                      singular: unit,
                    })}
                  </div>
                </div>

                <div
                  className={twJoin(
                    "flex flex-col-reverse items-center justify-center gap-1",
                    "rounded-md bg-palette-green/10 px-6 py-3"
                  )}
                >
                  <div className="text-xs text-palette-beige">
                    Voting Power (
                    {getLockupPeriodMultiplier({
                      lockupTime: lockDuration,
                      lockedAtomEpochInNanos,
                    })}
                    &thinsp;&times;)
                  </div>
                  <div className="text-2xl font-bold">
                    {formatAmount(
                      scaleLockupPower({
                        lockedAtomEpochInNanos,
                        lockupTime: lockDuration,
                        rawPower: BigInt(amount),
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
          buttons: [
            {
              label: (
                <div className="flex items-center gap-1">
                  <span>Start Locking</span>
                  <Icon name="solid:arrow-right-long" />
                </div>
              ),
              onClick: execute,
              className: "bg-palette-green",
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
      case "NoHubGasError":
        return {
          contents: (
            <p>
              You do not have enough gas to complete the transaction. Please
              transfer more ATOM to your wallet and try again.
            </p>
          ),
          buttons: [
            {
              label: "OK",
              onClick: () => {
                router.push("/lock-atom")
                onExit()
              },
            },
          ],
        }
      case "WaitingForNeutronGasSigning":
        return {
          isWorking: true,
          contents: (
            <p>
              You do not have enough gas on Neutron (Hydro&rsquo;s host chain).
              Approve the transaction in your wallet to transfer.{" "}
              <strong>{formatAmount(minimumUATOMGas)} ATOM</strong> to your
              Neutron wallet to continue.
            </p>
          ),
        }
      case "WaitingForNeutronGasBroadcastAndRelay":
        return {
          isWorking: true,
          contents: (
            <p>
              Transferring your ATOM to your Neutron wallet. This may take a
              minute or two, depending on network congestion. If you exit Hydro
              now, this status may not be visible when you return, but the
              transfer will continue. Once the transfer is complete, you will
              need to return to initiate the staking process.
            </p>
          ),
        }
      case "WaitingForTokenizeSigning":
        return {
          isWorking: true,
          contents: (
            <p>
              Approve the transaction in your wallet to continue. This will
              start the tokenization of your staked ATOM.
            </p>
          ),
        }
      case "WaitingForTokenizeBroadcast":
        return {
          isWorking: true,
          contents: (
            <p>
              Tokenizing your staked ATOM. This should only take a few seconds
              (unless the network is congested)
            </p>
          ),
        }
      case "Error":
        return {
          contents: (
            <>
              <p>
                This transaction could not be completed. Your staked ATOM has
                not been locked in Hydro. Refresh the page to try again.
              </p>
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
      case "WaitingForIBCSigning":
        return {
          isWorking: true,
          contents: (
            <p>
              Approve the transaction in your wallet to continue. This will
              start the transfer of your tokenized ATOM to Hydro.
            </p>
          ),
        }
      case "WaitingForIBCBroadcastAndRelay":
        return {
          isWorking: true,
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
          contents: (
            <p>
              Locking your ATOM. This should only take a few seconds, unless the
              network is congested.
            </p>
          ),
        }
      case "Success":
        return {
          revalidateCache: true,
          title: "Success!",
          contents: (
            <>
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
              <p>You can now start voting with your Hydro tokens.</p>
            </>
          ),
          buttons: [
            {
              label: "Start Voting",
              onClick: async () => {
                onExit()

                await revalidateTag("backendData")

                router.push("/bids")
                router.refresh()
              },
            },
          ],
        }
      default:
        return {
          contents: <></>,
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
