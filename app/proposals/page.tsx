import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"
import { WelcomePopup } from "./welcomePopup"

export default async function ActiveProposalsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
            <ProposalListTopModules />
            <ActiveProposals searchParams={searchParams} />
        </div>
    )
}
