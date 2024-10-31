import { ContentContainer } from "@/components/ContentContainer"
import { LockupsTable } from "@/components/LockupsTable"
import { endpoints } from "@/config"
import { fetchAllValidators } from "@/hooks/hooks"
import { TopModulesForLockups } from "../../../components/TopModulesForLockups"

export default async function Page() {
    const validators = await fetchAllValidators(endpoints.cosmoshub.rest[0])

    const validatorMap = new Map(
        validators.map((validator) => [validator.operator_address, validator])
    )

    return (
        <ContentContainer className="gap-12 py-12">
            <TopModulesForLockups />
            <LockupsTable validatorMap={validatorMap} />
        </ContentContainer>
    )
}
