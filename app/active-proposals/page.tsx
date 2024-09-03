'use client'
import { Button } from "@/components/ui/button";
import { ProposalListTopModules } from "../dashboard/topModules/TopModules";
import Image from "next/image";
import { DataTable, makeProposalColumnDef, proposalColumns } from "./proposalTable";
import { Proposal, Tranche } from "../ts_types/HydroBase.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobalState } from "../types";
import { Tribute } from "../ts_types/TributeBase.types";
import { fetchDashboardData } from "../dashboard/dashboardFetch";

const ActiveProposals = () => {
    const [currentTranche, setCurrentTranche] = useState(0);
    const [currentProposalTranches, setCurrentProposalTranches] = useState<Map<number, Proposal[]>>(new Map());
    const [globalState, setGlobalState] = useState<GlobalState | { tranches: Tranche[] }>({ tranches: [] });
    const [currentProposalTributes, setCurrentProposalTributes] = useState<Map<number, Tribute[]>>(new Map());

    useEffect(() => {
        const fetchData = async () => {
            const {
                currentProposalTranches,
                globalState,
                currentProposalTributes,
            } = await fetchDashboardData();
            setCurrentProposalTranches(currentProposalTranches);
            setGlobalState(globalState);
            setCurrentProposalTributes(currentProposalTributes);
        }
        fetchData()
            .catch(console.error);;
    }, [currentTranche]);

    const router = useRouter();
    const handleRowClick = (proposal: Proposal) => {
        const url = new URL(`${window.location.href}/${proposal.proposal_id}`);
        router.push(url.toString());
    }

    return (
        <div className="px-[90px] pb-[90px] max-w-[1440px] mx-auto">
            <ProposalListTopModules />
            <div className="mt-14 relative">
                <div className="p-5 absolute flex flex-row gap-[18px] justify-between items-center w-[380px] border rounded-[40px] border-solid border-[#FFE1B8] right-0">
                    <Button variant='ghost' className="hover:bg-transparent text-[#E4B472]" size="icon" onClick={() => setCurrentTranche((currentTranche - 1 + globalState.tranches.length) % globalState.tranches.length)}>
                        <Image src={'/images/Vector3.svg'} alt='tranches-left' width={24} height={40} />
                    </Button>
                    <p className="text-[32px] not-italic font-normal leading-[120%] tracking-[-0.4px]  text-[#E4B472]">{`TRANCH ${currentTranche + 1}/${globalState.tranches.length}`}</p>
                    <Button variant="ghost" className="hover:bg-transparent  text-[#E4B472]" size="icon" onClick={() => setCurrentTranche((currentTranche + 1) % globalState.tranches.length)}>
                        <Image src={'/images/Vector4.svg'} alt='tranches-right' width={24} height={40} />
                    </Button>
                </div>
                <h3>Proposals in Voting</h3>
                <p className="text-xl not-italic font-normal leading-[150%]">The winning proposals will be deployed in the next round</p>
                {currentProposalTranches.get(currentTranche) && (
                    <DataTable
                        columns={proposalColumns(() => { })}
                        data={(currentProposalTranches.get(currentTranche) || []).map((proposal) => makeProposalColumnDef(proposal, currentProposalTributes.get(proposal.proposal_id)!))}
                        height="h-[330px]"
                        clickable={true}
                        onRowClick={(proposal) => handleRowClick(proposal.proposal)}
                    />
                )}
            </div>
        </div>
    )
}

export default ActiveProposals;
