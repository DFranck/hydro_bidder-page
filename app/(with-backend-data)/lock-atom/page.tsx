"use server"

import { getEndpoints } from "@/config"
import { fetchValidators } from "@/contract-apis/fetchValidators"
import { LsmInteraction } from "./components/LsmInteraction"

export default async function LockPage() {
  const validators = await fetchValidators(
    getEndpoints({
      numiaCosmosHydroAppApiKey: process.env.NUMIA_COSMOS_HYDRO_APP_API_KEY!,
    }).cosmoshub.rest[0]
  )
  const validatorMap = new Map(
    validators.map((validator) => [validator.operator_address, validator])
  )

  return (
    <div className="mx-auto max-w-[800px] py-12">
      <LsmInteraction validatorMap={validatorMap} />
    </div>
  )
}
