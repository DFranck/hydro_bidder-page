import { endpoints } from "@/config"
import LSMInteraction from "./component"
import { fetchAllValidators } from "@/contract-apis/fetchAllValidators"

export default async function LockPage() {
  const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])

  const validatorMap = new Map(
    validators.map((validator) => [validator.operator_address, validator])
  )

  return (
    <div className="mx-auto max-w-[800px] py-12">
      <LSMInteraction validatorMap={validatorMap} />
    </div>
  )
}
