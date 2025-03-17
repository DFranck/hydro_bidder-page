"use server"

import { sharedEndpoints } from "@/config"
import { fetchValidators } from "@/contract-apis/fetchValidators"
import { LsmInteraction } from "./components/LsmInteraction"

export default async function LockPage() {
  const endpoint = sharedEndpoints.cosmoshub.rest[0]
  const validators = await fetchValidators(endpoint)
  const validatorMap = new Map(
    validators.map((validator) => [validator.operator_address, validator])
  )

  return (
    <div className="mx-auto max-w-[800px] py-12">
      <LsmInteraction validatorMap={validatorMap} />
    </div>
  )
}
