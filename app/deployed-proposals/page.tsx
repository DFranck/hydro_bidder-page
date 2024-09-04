'use client'
import { useEffect, useState } from "react";
import { DataTable, makeProposalColumnDef } from "../voting-proposals/proposalTable";
import { ProposalListTopModules } from "../dashboard/topModules/TopModules";
import { Proposal, Tranche } from "../ts_types/HydroBase.types";
import { Tribute } from "../ts_types/TributeBase.types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { GlobalState } from "../types";
import { fetchDashboardData } from "../dashboard/dashboardFetch";

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
                <h3 className="pb-5">Actively Deployed Proposals</h3>
                <p className="text-xl not-italic font-normal leading-[150%]">Winning proposals from previous rounds that are currently deployed</p>
                {lastProposalTranches && lastProposalTributes && lastProposalTranches.get(currentTranche) && (
                    <DataTable
                        columns={[
                            {
                                accessorKey: "title",
                                header: "",
                                cell: ({ row }) => {
                                    return (<div className="flex flex-col">
                                        <p className="text-xl not-italic font-bold leading-[150%]">{row.original.proposal.title}</p>
                                    </div>
                                    )
                                },
                            },
                            {
                                accessorKey: "tribute",
                                header: () => <div className="text-center">Tribute Amount</div>,
                                cell: ({ row }) => <div className="text-center">{row.original.summedTributes.map((tribute, index) =>
                                    <div key={index} className="text-center">
                                        {`${(tribute.amount / 1000000).toFixed(2)} ${tribute.denom.length > 20 ? tribute.denom.slice(0, 17) + '...' : tribute.denom}`}
                                    </div>)
                                }</div>,
                            },
                            {
                                accessorKey: "votingPowerPercent",
                                header: () => <div className="text-center">Voting Power %</div>,
                                cell: ({ row }) => <div className="text-center">{row.original.proposal.percentage}</div>,
                            },
                            {
                                accessorKey: "link",
                                header: "",
                                cell: ({ row }) => {
                                    return (<Link href={`/deployed-proposals/${row.original.proposal.proposal_id}`}><Button className="bg-[#0061FF]">View Proposal</Button></Link>)
                                }
                            }
                        ]}
                        data={
                            (lastProposalTranches.get(currentTranche) || [])
                                .map((proposal) => makeProposalColumnDef(proposal, lastProposalTributes.get(proposal.proposal_id)!))
                        }
                    />
                )}
            </div>
        </div>
    )
}

export default DeployedLiquidity;
