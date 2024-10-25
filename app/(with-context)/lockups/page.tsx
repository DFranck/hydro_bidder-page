import { ContentContainer } from "@/components/ContentContainer"
import { endpoints } from "@/config"
import { fetchAllValidators } from "@/hooks/hooks"
import { LockupsTable } from "./LockupsTable"
import { DashboardTopModules } from "./TopModules"

export default async function Page() {
    const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])

    const validatorMap = new Map(
        validators.map((validator) => [validator.operator_address, validator])
    )

    return (
        <ContentContainer className="gap-12 py-12">
            <DashboardTopModules />
            <LockupsTable validatorMap={validatorMap} />
        </ContentContainer>
    )
}
