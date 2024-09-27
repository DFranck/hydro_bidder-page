import ActiveProposals from "./component"
import { ProposalListTopModules } from "./TopModules"
import { WelcomePopup } from "./welcomePopup"

export default async function ActiveProposalsPage() {
    return (
        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
            <WelcomePopup />
            <ProposalListTopModules />
            <ActiveProposals />
        </div>
    )
}
