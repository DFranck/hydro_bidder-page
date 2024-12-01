import { StyledText } from "@/components/StyledText"
import { Delegation, Validator } from "@/contract-apis/fetchWalletValidators"
import { formatAmount } from "@/lib/utils"
import { classNames } from "../classNames"
import { calculateLsmCapacity } from "../functions/calculateLsmCapacity"

export interface ValidatorListItemProps {
  validator: {
    validator: Validator
    delegation: Delegation
    delegation_balance: { denom: string; amount: string }
  }
  selectedValue: string
  onChange: (value: string) => void
  selectedAmount: number
}

export function ValidatorListItem({
  validator: v,
  selectedValue,
  onChange,
  selectedAmount,
}: ValidatorListItemProps) {
  const lsmCapacity = calculateLsmCapacity(
    v.validator.validator_bond_shares,
    v.validator.liquid_shares
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
              : `${formatAmount(v.delegation_balance.amount)} ATOM staked`}
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
