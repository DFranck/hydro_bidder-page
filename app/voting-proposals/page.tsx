import { fetchDashboardData } from '../dashboard/dashboardFetch'
import ActiveProposals from './component'

const Page = async () => {
    const { currentProposalTranches, globalState, currentProposalTributes } =
        await fetchDashboardData()

    return (
        <ActiveProposals
            currentProposalTranches={currentProposalTranches}
            currentProposalTributes={currentProposalTributes}
            globalState={globalState}
        />
    )
}

export default Page
