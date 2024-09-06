import { fetchDashboardData } from "../dashboard/dashboardFetch";
import DeployedLiquidity from "./component";

const Page = async () => {
    const {
        globalState,
        lastProposalTranches,
        lastProposalTributes,
    } = await fetchDashboardData();

    return (
        <DeployedLiquidity
            lastProposalTranches={lastProposalTranches}
            lastProposalTributes={lastProposalTributes}
            globalState={globalState}
        />
    )
}
export default Page;