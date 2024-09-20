import LSMInteraction from "./component"
import { fetchAllValidators } from "@/hooks/hooks"
import { endpoints } from "@/config"
import { Suspense } from "react"

export default async function LockPage() {
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
