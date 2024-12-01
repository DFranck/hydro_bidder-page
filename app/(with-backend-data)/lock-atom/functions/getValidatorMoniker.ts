import { Validator } from "@/contract-apis/fetchWalletValidators"

export function getValidatorMoniker(
  validator: string,
  validatorMap: Map<string, Validator>
): string {
  return validatorMap.get(validator)?.description.moniker || validator
}
