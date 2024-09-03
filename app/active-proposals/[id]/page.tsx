'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { executeVote, useMyVotes } from "@/hooks/hooks";
import { useChain } from "@cosmos-kit/react";
import { Proposal } from "@/app/ts_types/HydroBase.types";
import { GlobalState } from "@/app/types";
import { ChevronLeft } from 'lucide-react';
import TopModules from "@/app/dashboard/topModules/TopModules";
import { fetchDashboardData } from "@/app/dashboard/dashboardFetch";

const mockData = {
    tributeToVoters: [
        {
            amount: 100000,
            denom: "OSMO",
        },
        {
            amount: 90,
            denom: "USDT",
        },
        {
            amount: 500,
            denom: "USDC",
        },
        {
            amount: 2000,
            denom: "STARZ",
        },
    ],

    liquidityRequested: [
        {
            amount: 200000,
            denom: "ATOM",
        }
    ],
    currentVotePercentage: 32,
    status: 'Open',
    totalVotingPower: 100,
}


const ProposalDetail = ({ params }: { params: { id: string } }) => {
    const [currentProposalTranches, setCurrentProposalTranches] = useState<Map<number, Proposal[]>>(new Map());
    const [currentProposal, setCurrentProposal] = useState<Proposal>();
    const [globalState, setGlobalState] = useState<GlobalState | { currentRound: number }>({ currentRound: 0 });
    useEffect(() => {
        const fetchData = async () => {
            const {
                currentProposalTranches,
                globalState,
            } = await fetchDashboardData();


            const currentProposal = Array.from(currentProposalTranches.values())
                .flat()
                .find(proposal => proposal.proposal_id === Number(params.id));
            setCurrentProposal(currentProposal);
            setCurrentProposalTranches(currentProposalTranches);
            setGlobalState(globalState);
        }

        fetchData()
            .catch(console.error);;
    }, [params.id]);

    const { address, getSigningCosmWasmClient, estimateFee } = useChain('cosmoshubtestnet');
    const { data: myVotes = [] } = useMyVotes(address || '', globalState.currentRound, Array.from(currentProposalTranches.keys()));

    const hasVoted = Array.from(myVotes).length > 0;
    const hasVotedOnThisProposal = Array.from(myVotes.values()).flat().find(vote => vote.prop_id === Number(params.id));

    const [showChangeVote, setShowChangeVote] = useState(false);

    function doVote() {
        if (currentProposal) {
            executeVote(getSigningCosmWasmClient, estimateFee, address!, currentProposal.proposal_id, currentProposal.tranche_id);

        }
    }


    function handleVoteClick() {
        hasVoted ? setShowChangeVote(true) : doVote();
    }

    const ChangeVote = () => {
        return (
            <Dialog open={showChangeVote} onOpenChange={setShowChangeVote}>
                <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
                    <DialogHeader className="pb-[34px]">
                        <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px]">Change your vote?</DialogTitle>
                        <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
                            Changing your vote will reallocate your total voting power to the new project.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={doVote} type="button" variant="secondary" className="w-full hover:bg-neutral-900 hover:text-white hover:border hover:border-white rounded-[10px]">
                        Vote for this project
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full border rounded-[10px] border-solid border-white hover:bg-white hover:text-black">
                            Don’t change my vote
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>

        )
    }

    return (
        <div className="px-[90px] pb-[90px] max-w-[1440px] mx-auto">
            <ChangeVote />
            <TopModules isConnected={false} isProposalDetailView={true} />
            <div className="bg-[#303132] rounded-[10px] p-12 mt-[72px]">
                <div className="flex flex-col md:flex-row gap-[10%]">
                    <div>
                        <Link href="/active-proposals" className="opacity-80">
                            <Button variant='link' className="mb-5 text-white pl-0"><ChevronLeft size={14} />Back</Button>
                        </Link>
                        <div className="flex flex-row gap-5 items-center pb-5">
                            <Image src={'/images/icon_Boost.svg'} width={50} height={50} alt="Icon" />
                            <p className="text-2xl not-italic font-bold leading-[150%]">Super long proposal name that should wrap and then be cut off but not anymore on the detail</p>
                        </div>
                        <div className="">
                            <p className="text-sm not-italic font-normal opacity-80">Project Overview</p>
                            <div className="text-xl not-italic font-normal pb-15">
                                <p>
                                    Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation. Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation. Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation. Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation. Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation. Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation.  Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation.  Hydro provides a unique opportunity to project to access liquidity and gain exposure, while rewarding ATOM holders for their participation.                            </p>

                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-[30%] mt-6 md:mt-0 pb-10">
                        <div className="mt-auto pt-6 pb-16">
                            <Button
                                disabled={!!hasVotedOnThisProposal}
                                onClick={handleVoteClick}
                                className="w-[250px] text-[#080815] text-center text-xl not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white"
                            >
                                {!!hasVotedOnThisProposal ? 'Already Voted This' : 'Vote for Project'}
                            </Button>
                        </div>
                        <div className="pl-6">
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">Tribute to Voters</p>
                                {mockData.tributeToVoters.map((item, index) => (
                                    <p key={index} className="text-xl not-italic font-bold leading-[150%]">{item.amount.toLocaleString('en-US')} {item.denom}</p>
                                ))}
                            </div>
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">Liquidity Requested</p>
                                {mockData.liquidityRequested.map((item, index) => (
                                    <p key={index} className="text-xl not-italic font-bold leading-[150%]">{item.amount.toLocaleString('en-US')} {item.denom}</p>
                                ))}
                            </div>
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">Current Vote Percentage</p>
                                <p className="text-xl not-italic font-bold leading-[150%]">{mockData.currentVotePercentage}%</p>
                            </div>
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">Status</p>
                                <p className="text-[#00FFC2] text-xl not-italic font-bold leading-[150%]">{mockData.status}</p>
                            </div>
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">Total Voting Power</p>
                                <p className="text-xl not-italic font-bold leading-[150%]">{mockData.totalVotingPower}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ProposalDetail;
