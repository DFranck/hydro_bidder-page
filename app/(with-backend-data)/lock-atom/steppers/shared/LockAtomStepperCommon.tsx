import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { formatAmount } from "@/lib/formatAmount"
import { scaleLockupPower } from "@/lib/scaleLockupPower"
import { ReactNode } from "react"
import { ContinueLockForm } from "../../components/ContinueLockForm"
import { EPOCH_LENGTH } from "@/config"

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
    disabled?: boolean
  }[]
}

export function getCommonStepContents({
  step,
  amount,
  validator,
  validatorMap,
  lockDuration,
  lockedTokenEpochInNanos,
  errorLog,
  showErrorLog,
  setShowErrorLog,
  onExecute,
  onCancel,
  setLockDuration,
  numApprovals,
  maxAmount,
  setNewAmount,
}: {
  step: "Init" | "Success" | "Error"
  amount: string
  validator: string
  validatorMap: Map<string, Validator>
  lockDuration: number
  lockedTokenEpochInNanos: number
  errorLog: string
  showErrorLog: boolean
  setShowErrorLog: (show: boolean) => void
  onExecute: () => void
  onCancel: () => void
  setLockDuration: (duration: number) => void
  maxAmount: string
  setNewAmount: (amount: string) => void
  numApprovals: number
}): StepContent {
  switch (step) {
    case "Init":
      return {
        title: `Continue Locking ${formatAmount(amount)} ${process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}`,
        contents: (
          <>
            <p>
              Nice! You&rsquo;re about to lock{" "}
              <strong>
                {formatAmount(amount)}{" "}
                {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}
              </strong>{" "}
              staked to{" "}
              <strong>{getValidatorMoniker(validator, validatorMap)}</strong> in
              Hydro to get{" "}
              <strong>
                {formatAmount(
                  scaleLockupPower({
                    lockedTokenEpochInNanos,
                    lockupTime: lockDuration,
                    rawPower: BigInt(amount),
                  })
                )}{" "}
                voting power.
              </strong>
            </p>
            <ContinueLockForm
              selectedDuration={lockDuration}
              onChange={setLockDuration}
              validator={validator}
              amount={amount}
              maxAmount={maxAmount}
              handleNewAmount={setNewAmount}
            />
            <p>
              This will require {numApprovals} wallet approval
              {numApprovals > 1 ? "s" : ""}.
            </p>
          </>
        ),
        buttons: [
          {
            label: "Lock",
            onClick: onExecute,
            disabled:
              Number(amount) > Number(maxAmount) ||
              amount === "0" ||
              EPOCH_LENGTH === lockDuration,
          },
          { label: "Cancel", onClick: onCancel },
        ],
      }

    case "Success":
      return {
        revalidateCache: true,
        title: "Success!",
        contents: (
          <p>
            You locked{" "}
            <strong>
              {formatAmount(amount)} {process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME}
            </strong>{" "}
            in Hydro and received{" "}
            <strong>
              {formatAmount(
                scaleLockupPower({
                  lockedTokenEpochInNanos,
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
              This transaction could not be completed. Your{" "}
              {process.env.NEXT_PUBLIC_STAKED_TOKEN_NAME} has not been locked in
              Hydro.
            </p>
            <p>
              Refresh the page to try again or recover your{" "}
              {process.env.NEXT_PUBLIC_STAKED_TOKEN_NAME}.
            </p>
            <div className="mt-4">
              {!showErrorLog ? (
                <>
                  <p>
                    This transaction could not be completed. Your staked ATOM
                    has not been locked in Hydro.
                  </p>
                  <p>
                    Refresh the page to try again or recover your staked ATOM.
                  </p>
                  <StyledText
                    as="button"
                    variant="link.subtle"
                    onClick={() => setShowErrorLog(true)}
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
