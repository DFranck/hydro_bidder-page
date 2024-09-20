import LockupsTable from "./lockupsTable"
import { DashboardTopModules } from "./TopModules"
import { fetchAllValidators } from "@/hooks/hooks"
import { endpoints } from "@/config"

export default async function Page() {
    const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])

    const validatorMap = new Map(
        validators.map((validator) => [validator.operator_address, validator])
    )
    return (
        <div className="max-w-7xl mx-auto">
            <DashboardTopModules />
            <div className="pt-10 pb-44">
                <LockupsTable validatorMap={validatorMap} />
            </div>
        </div>
    )
}
