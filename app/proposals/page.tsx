import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"
import { WelcomePopup } from "./welcomePopup"

export default async function ActiveProposalsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <div className="pb-44 max-w-7xl mx-auto px-6 lg:px-12">
            <WelcomePopup />
            <ProposalListTopModules />
            <ActiveProposals searchParams={searchParams} />
        </div>
    )
}
