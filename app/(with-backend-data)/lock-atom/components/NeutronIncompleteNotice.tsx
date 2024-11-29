import { Card } from "@/components/Card"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchMyValidators"
import { formatAmount } from "@/lib/utils"
import { getValidatorMoniker } from "../functions/getValidatorMoniker"
import { Stepper } from "../types"

export function NeutronIncompleteNotice({
  amount,
  validator,
  validatorMap,
  denom,
  baseDenom,
  setStepper,
}: {
  amount: string
  validator: string
  validatorMap: Map<string, Validator>
  denom: string
  baseDenom: string
  setStepper: (stepper: Stepper) => void
}) {
  return (
    <Card>
      <Card.Header title="Incomplete ATOM Locking" />
      <Card.Body>
        <p>
          Looks like you might have been interrupted while locking your ATOM.
          You have <strong>{formatAmount(amount)}</strong> ATOM with validator{" "}
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
              type: "continueFromNeutronLSM",
              validator,
              amount,
              denom,
              baseDenom,
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
              type: "revertFromNeutronLSM",
              validator,
              amount,
              denom,
              baseDenom,
            })
          }
        >
          Revert {formatAmount(amount)} ATOM
        </StyledText>
      </Card.Footer>
    </Card>
  )
}
