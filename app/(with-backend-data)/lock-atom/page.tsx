"use server"

import { sharedEndpoints } from "@/config"
import { fetchValidators } from "@/contract-apis/fetchValidators"
import { LsmInteraction } from "./components/LsmInteraction"
import { fetchValidatorLiquidStakingParams } from "@/contract-apis/fetchValidatorLiquidStakingParams"

export default async function LockPage() {
  const endpoint = sharedEndpoints.cosmoshub.rest[0]
  const validators = await fetchValidators(endpoint)
  const validatorMap = new Map(
    validators.map((validator) => [validator.operator_address, validator])
  )

  const validatorLiquidStakingParams =
    await fetchValidatorLiquidStakingParams(endpoint)

  return (
    <div className="mx-auto max-w-[800px] py-12">
      <LsmInteraction
        validatorMap={validatorMap}
        validatorLiquidStakingCap={
          validatorLiquidStakingParams.validator_liquid_staking_cap
        }
      />
    </div>
  )
}
