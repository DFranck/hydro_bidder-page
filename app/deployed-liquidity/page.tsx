'use client'
import { useEffect, useState } from "react";
import { DataTable, makeProposalColumnDef, proposalColumns } from "../active-proposals/proposalTable";
import { fetchDashboardData } from "../dashboard/page";
import TopModules from "../dashboard/topModules/TopModules";
import { Proposal, Tranche } from "../ts_types/HydroBase.types";
import { Tribute } from "../ts_types/TributeBase.types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GlobalState } from "../types";

const DeployedLiquidity = () => {
    const [currentTranche, setCurrentTranche] = useState(0);
    const [lastProposalTranches, setLastProposalTranches] = useState<Map<number, Proposal[]>>();
    const [lastProposalTributes, setLastProposalTributes] = useState<Map<number, Tribute[]>>();
    const [globalState, setGlobalState] = useState<GlobalState | { tranches: Tranche[] }>({ tranches: [] });

    useEffect(() => {
        const fetchData = async () => {
            const {
                globalState,
                lastProposalTranches,
                lastProposalTributes,
            } = await fetchDashboardData();

            setLastProposalTranches(lastProposalTranches);
            setLastProposalTributes(lastProposalTributes);
            setGlobalState(globalState);
        }
        fetchData()
            .catch(console.error);;
    }, [currentTranche]);
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
            {lastProposalTranches && lastProposalTributes && lastProposalTranches.get(currentTranche) && (
                <div>
                    <h3>Actively Deployed Proposals</h3>
                    <p className="text-xl not-italic font-normal leading-[150%]">Winning proposals from previous rounds that are currently deployed</p>
                    <DataTable
                        columns={proposalColumns(() => { })}
                        data={
                            (lastProposalTranches.get(currentTranche) || [])
                                .map((proposal) => makeProposalColumnDef(proposal, lastProposalTributes.get(proposal.proposal_id)!))
                        }
                        height=" h-[330px]"
                    />
                </div>
            )}
        </div>
    )
}

export default DeployedLiquidity;
