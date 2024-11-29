import { Card } from "@/components/Card"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchMyValidators"
import { formatAmount } from "@/lib/utils"
import { getValidatorMoniker } from "../functions/getValidatorMoniker"
import { Stepper } from "../types"

export function HubIncompleteNotice({
  amount,
  validator,
  denom,
  validatorMap,
  setStepper,
}: {
  amount: string
  validator: string
  validatorMap: Map<string, Validator>
  denom: string
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
        <p>
          Would you like to continue from where you left off, or revert to get
          back your staked ATOM?
        </p>
      </Card.Body>
      <Card.Footer>
        <StyledText
          as="button"
          variant="button.primary"
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
