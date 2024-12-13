import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { formatAmount } from "@/lib/formatAmount"
import { scaleLockupPower } from "@/lib/scaleLockupPower"
import { ReactNode } from "react"

export function getValidatorMoniker(
  validator: string,
  validatorMap: Map<string, Validator>
): string {
  return validatorMap.get(validator)?.description.moniker || validator
}

export type StepContent = {
  isWorking?: boolean
  revalidateCache?: boolean
  title?: ReactNode
  contents: ReactNode
  buttons?: {
    label: ReactNode
    onClick?: () => void
    className?: string
  }[]
}

export function getCommonStepContents({
  step,
  amount,
  validator,
  validatorMap,
  lockDuration,
  lockedAtomEpochInNanos,
  errorLog,
  showErrorLog,
  setShowErrorLog,
  onExecute,
  onCancel,
  setLockDuration,
  numApprovals,
}: {
  step: "Init" | "Success" | "Error"
  amount: string
  validator: string
  validatorMap: Map<string, Validator>
  lockDuration: number
  lockedAtomEpochInNanos: number
  errorLog: string
  showErrorLog: boolean
  setShowErrorLog: (show: boolean) => void
  onExecute: () => void
  onCancel: () => void
  setLockDuration: (duration: number) => void
  numApprovals: number
}): StepContent {
  switch (step) {
    case "Init":
      return {
        title: `Continue Locking ${formatAmount(amount)} ATOM`,
        contents: (
          <>
            <p>
              Nice! You&rsquo;re about to lock{" "}
              <strong>{formatAmount(amount)} ATOM</strong> staked to{" "}
              <strong>{getValidatorMoniker(validator, validatorMap)}</strong> in
              Hydro to get{" "}
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
              className="mt-12"
              onSubmit={(e) => {
                e.preventDefault()
                onExecute()
              }}
            >
              <div className="mb-4">
                <label className="mb-2 block">Select Lock Duration:</label>
                <InputForLockupPeriod
                  selectedDuration={lockDuration}
                  onChange={setLockDuration}
                />
              </div>
              <p>
                This will require {numApprovals} wallet approval
                {numApprovals > 1 ? "s" : ""}.
              </p>
            </form>
          </>
        ),
        buttons: [
          { label: "Lock", onClick: onExecute },
          { label: "Cancel", onClick: onCancel },
        ],
      }

    case "Success":
      return {
        revalidateCache: true,
        title: "Success!",
        contents: (
          <p>
            You locked <strong>{formatAmount(amount)} ATOM</strong> in Hydro and
            received{" "}
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
        buttons: [{ label: "Start Voting", onClick: onCancel }],
      }

    case "Error":
      return {
        title: "Transaction Error",
        contents: (
          <>
            <p>
              This transaction could not be completed. Your staked ATOM has not
              been locked in Hydro.
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
      return { contents: null }
  }
}
