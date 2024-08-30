'use client'
import { Button } from "@/components/ui/button";
import TopModules from "../dashboard/topModules/TopModules";
import Image from "next/image";
import { DataTable, makeProposalColumnDef, proposalColumns } from "./proposalTable";
import { Proposal, Tranche } from "../ts_types/HydroBase.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../dashboard/page";
import { GlobalState } from "../types";
import { Tribute } from "../ts_types/TributeBase.types";

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
            <TopModules isConnected={false} isProposalDetailView={false} />
            <div className="flex flex-row gap-[18px] justify-end items-center">
                <Button variant="ghost" size="icon" onClick={() => setCurrentTranche((currentTranche - 1 + globalState.tranches.length) % globalState.tranches.length)}>
                    <Image src={'/images/Vector3.svg'} alt='tranches-left' width={14} height={24} />
                </Button>
                <p className="text-[32px] not-italic font-normal leading-[120%] tracking-[-0.4px]">{`TRANCH ${currentTranche + 1}/${globalState.tranches.length}`}</p>
                <Button variant="ghost" size="icon" onClick={() => setCurrentTranche((currentTranche + 1) % globalState.tranches.length)}>
                    <Image src={'/images/Vector4.svg'} alt='tranches-right' width={14} height={24} />
                </Button>
            </div>
            {currentProposalTranches.get(currentTranche) && (
                <div>
                    <h3>Proposals in Voting</h3>
                    <p className="text-xl not-italic font-normal leading-[150%]">The winning proposals will be deployed in the next round</p>
                    <DataTable
                        columns={proposalColumns(() => { })}
                        data={(currentProposalTranches.get(currentTranche) || []).map((proposal) => makeProposalColumnDef(proposal, currentProposalTributes.get(proposal.proposal_id)!))}
                        height="h-[330px]"
                        theme="light"
                        clickable
                        onRowClick={(proposal) => handleRowClick(proposal.proposal)}
                    />
                </div>
            )}
        </div>
    )
}

export default ActiveProposals;
