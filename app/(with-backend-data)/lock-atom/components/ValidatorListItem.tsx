import { StyledText } from "@/components/StyledText"
import { Delegation, Validator } from "@/contract-apis/fetchWalletValidators"
import { formatAmount } from "@/lib/formatAmount"
import { classNames } from "../classNames"
import { calculateLsmCapacity } from "../functions/calculateLsmCapacity"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"

export interface ValidatorListItemProps {
  validator: {
    validator: Validator
    delegation: Delegation
    delegation_balance: { denom: string; amount: string }
  }
  selectedValue: string
  onChange: (value: string) => void
  selectedAmount: number
  validatorLiquidStakingCap: string
}

export function ValidatorListItem({
  validator: v,
  selectedValue,
  onChange,
  selectedAmount,
  validatorLiquidStakingCap,
}: ValidatorListItemProps) {
  const lsmCapacity = calculateLsmCapacity(
    v.validator.delegator_shares,
    validatorLiquidStakingCap
  )
  const isDisabled = lsmCapacity <= 0 || lsmCapacity < selectedAmount

  return (
    <div className={classNames.validatorListItem}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-semibold">
            {v.validator.description.moniker || v.validator.operator_address}
          </span>
          <span className="text-sm text-gray-400">
            {isDisabled
              ? "(Insufficient validator bond)"
              : `${formatAmount(v.delegation_balance.amount, undefined, DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS)} ${process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME} staked`}
          </span>
        </div>
        <StyledText
          as="button"
          onClick={() => {
            if (!isDisabled) {
              onChange(v.validator.operator_address)
            }
          }}
          variant={
            selectedValue === v.validator.operator_address
              ? "button.primary"
              : "button.secondary"
          }
          disabled={isDisabled}
        >
          {selectedValue === v.validator.operator_address
            ? "Selected"
            : "Select"}
        </StyledText>
      </div>
    </div>
  )
}
