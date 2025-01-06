import { Card } from "@/components/Card"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { formatAmount } from "@/lib/formatAmount"
import { getValidatorMoniker } from "../functions/getValidatorMoniker"
import { Stepper } from "../types"
import { Icon } from "@/components/Icon"

// From this notice the user can always revert the lockup.
// Finalizing the lockup is there's enough capacity available on the contract.
// If the notice amount is greater than the remaining capacity, the user can't finalize the lockup.
export function HubIncompleteNotice({
  amount,
  validator,
  denom,
  validatorMap,
  canFinalizeLockup,
  setStepper,
}: {
  amount: string
  validator: string
  validatorMap: Map<string, Validator>
  denom: string
  canFinalizeLockup: boolean
  setStepper: (stepper: Stepper) => void
}) {
  return (
    <Card>
      <Card.Header title="Incomplete ATOM Locking" />
      <Card.Body>
        <p>
          Looks like you might have been interrupted while locking your ATOM.
          You have <strong>{formatAmount(amount)}</strong> ATOM staked with{" "}
          <strong>{getValidatorMoniker(validator, validatorMap)}</strong> that
          is not fully locked.
        </p>
        {canFinalizeLockup ? (
          <p>
            Would you like to continue from where you left off, or revert to get
            back your staked ATOM?
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Icon
              name="triangle-exclamation"
              className="text-2xl text-orange-200"
            />
            <p className="text-sm">
              This lockup is larger than the remaining capacity. <br></br>You
              can revert it to get back your staked ATOM or try to continue at a
              later time.
            </p>
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        <StyledText
          as="button"
          variant="button.primary"
          disabled={!canFinalizeLockup}
          onClick={() =>
            setStepper({
              type: "continueFromHubLSM",
              validator,
              amount,
              denom,
            })
          }
        >
          Continue Locking {formatAmount(amount)} ATOM
        </StyledText>
        <StyledText
          as="button"
          variant="button.secondary"
          onClick={() =>
            setStepper({
              type: "revertFromHubLSM",
              validator,
              amount,
              denom,
            })
          }
        >
          Revert {formatAmount(amount)} ATOM
        </StyledText>
      </Card.Footer>
    </Card>
  )
}
