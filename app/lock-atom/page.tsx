import LSMInteraction from "./component"
import { fetchAllValidators } from "@/hooks/hooks"
import { endpoints } from "@/config/defaults"

export default async () => {
    const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])

    const validatorMap = new Map(
        validators.map((validator) => [validator.operator_address, validator])
    )

    return (
        <div className="px-[90px] pb-[90px] max-w-[800px] mx-auto">
            <LSMInteraction validatorMap={validatorMap} />
        </div>
    )
}
