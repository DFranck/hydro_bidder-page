import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { executeVote } from "@/hooks/hooks"
import { useChain } from "@cosmos-kit/react"
import { Proposal } from "@/app/ts_types/HydroBase.types"

const mockData = {
    tributeToVoters: [
        {
            amount: 100000,
            denom: "OSMO",
        },
    ],

    liquidityRequested: [
        {
            amount: 200000,
            denom: "ATOMS",
        },
    ],
    currentVotePercentage: 32,
    status: "Open",
    totalVotingPower: 100,
}

export const ProposalModal = ({
    proposal,
    hasVoted,
}: {
    proposal: Proposal
    hasVoted: boolean
}) => {
    const { address, getSigningCosmWasmClient, estimateFee } =
        useChain("neutrontestnet")

    const [showChangeVote, setShowChangeVote] = useState(false)

    function doVote() {
        executeVote(
            getSigningCosmWasmClient,
            address!,
            proposal.proposal_id,
            proposal.tranche_id
        )
    }

    function handleVoteClick() {
        hasVoted ? setShowChangeVote(true) : doVote()
    }

    const ChangeVote = () => {
        return (
            <Dialog open={showChangeVote} onOpenChange={setShowChangeVote}>
                <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
                    <DialogHeader className="pb-[34px]">
                        <DialogTitle>
                            <h3>Change your vote?</h3>
                        </DialogTitle>
                        <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
                            Changing your vote will reallocate your total voting
                            power to the new project.
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        onClick={doVote}
                        type="button"
                        variant="secondary"
                        className="w-full hover:bg-neutral-900 hover:text-white hover:border hover:border-white rounded-[10px]"
                    >
                        Vote for this project
                    </Button>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border rounded-[10px] border-solid border-white hover:bg-white hover:text-black"
                        >
                            Don’t change my vote
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <>
            <ChangeVote />
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-[url('/images/ProposalModal-background.png')] bg-cover bg-center bg-no-repeat rounded-md shadow-md p-4 sm:p-8 md:p-12 w-full sm:w-11/12 md:w-3/4 max-h-[90vh] overflow-auto">
                    <Link
                        className="absolute top-2.5 right-4 h-6 w-6 bg-black text-white rounded flex justify-center items-center text-3xl"
                        href="/dashboard"
                        scroll={false}
                    >
                        &times;
                        <span className="sr-only">Close Modal</span>
                    </Link>
                    {/* <p className="text-base not-italic font-medium leading-[130%] tracking-[1.28px] uppercase opacity-50 pb-[6px]">Decentralized Finance</p> */}
                    <div>
                        <h3 className="pb-5">Project Liquidity Boost</h3>
                        <div className="flex flex-col md:flex-row gap-[5%]">
                            <div className="w-full md:w-[65%]">
                                <p className="text-sm not-italic font-normal opacity-80 pb-5">
                                    Project Overview
                                </p>
                                <div className="max-h-[300px] text-xl not-italic font-normal pb-15">
                                    <p className="pb-[35px]">
                                        Our proposal aims to significantly
                                        enhance liquidity in the Cosmos
                                        ecosystem by allocating 1,000,000 ATOM
                                        to a prominent decentralized exchange
                                        (DEX). This strategic move is designed
                                        to bolster the overall health and
                                        efficiency of the Cosmos network,
                                        providing numerous benefits to users,
                                        developers, and the broader crypto
                                        community.
                                    </p>
                                    <p className="pb-[35px]">
                                        By injecting this substantial amount of
                                        ATOM into the DEX, we anticipate a
                                        dramatic increase in trading volume and
                                        depth. This enhanced liquidity will
                                        result in reduced slippage for traders,
                                        allowing for larger trades to be
                                        executed with minimal price impact. As a
                                        consequence, we expect to see increased
                                        trading activity, which will attract
                                        more users to the Cosmos ecosystem and
                                        potentially drive up the value of ATOM.
                                    </p>
                                    <p className="pb-[35px]">
                                        Furthermore, this liquidity boost will
                                        create new opportunities for yield
                                        farming and liquidity provision. Users
                                        who participate in liquidity pools
                                        containing ATOM will be able to earn
                                        rewards, incentivizing long-term holding
                                        and participation in the Cosmos network.
                                        This aligns with our goal of fostering a
                                        more engaged and committed community of
                                        ATOM holders.
                                    </p>
                                    <p className="pb-[35px]">
                                        The choice of allocating 1,000,000 ATOM
                                        is not arbitrary. This figure represents
                                        a significant portion of the circulating
                                        supply, ensuring that our impact on the
                                        market will be substantial and
                                        long-lasting. We believe that this level
                                        of commitment will send a strong signal
                                        to the crypto community about our
                                        confidence in the Cosmos ecosystem and
                                        its future growth potential.
                                    </p>
                                    <p className="pb-[35px]">
                                        Moreover, increased liquidity on DEXes
                                        will facilitate easier on-ramping for
                                        new users entering the Cosmos ecosystem.
                                        As liquidity improves, so does the ease
                                        of acquiring ATOM, which is often a
                                        gateway token for interacting with
                                        various Cosmos-based applications and
                                        services. This lowered barrier to entry
                                        could lead to increased adoption of
                                        Cosmos technology and a growth in the
                                        number of active users across the
                                        network.
                                    </p>
                                    <p className="pb-[35px]">
                                        It&apos;s important to note that this
                                        proposal is not just about short-term
                                        gains. By improving liquidity,
                                        we&apos;re laying the groundwork for
                                        future development and expansion within
                                        the Cosmos ecosystem. Improved liquidity
                                        can attract more projects to build on
                                        Cosmos, as it ensures that their tokens
                                        will have a robust trading environment.
                                        This, in turn, can lead to a virtuous
                                        cycle of growth and innovation.
                                    </p>
                                    <p className="pb-[35px]">
                                        We&apos;ve carefully considered the
                                        potential risks associated with this
                                        proposal. While allocating such a large
                                        amount of ATOM does expose us to some
                                        market volatility, we believe that the
                                        long-term benefits far outweigh the
                                        short-term risks. We will implement
                                        safeguards and monitoring systems to
                                        ensure that the liquidity is managed
                                        responsibly and in the best interests of
                                        the Cosmos community.
                                    </p>
                                    <p className="pb-[35px]">
                                        In conclusion, this proposal to provide
                                        1,000,000 ATOM as liquidity on a
                                        decentralized exchange represents a bold
                                        step towards cementing Cosmos&apos;s
                                        position as a leading blockchain
                                        ecosystem. It demonstrates our
                                        commitment to growth, user experience,
                                        and long-term sustainability. We believe
                                        that this initiative will catalyze a new
                                        phase of expansion and adoption for
                                        Cosmos, benefiting all stakeholders in
                                        our vibrant and growing community.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-[30%] mt-6 md:mt-0 pb-10">
                                <div className="pb-6">
                                    <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                        Tribute to Voters
                                    </p>
                                    {mockData.tributeToVoters.map(
                                        (item, index) => (
                                            <p
                                                key={index}
                                                className="text-xl not-italic font-bold leading-[150%]"
                                            >
                                                {item.amount.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                {item.denom}
                                            </p>
                                        )
                                    )}
                                </div>
                                <div className="pb-6">
                                    <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                        Liquidity Requested
                                    </p>
                                    {mockData.liquidityRequested.map(
                                        (item, index) => (
                                            <p
                                                key={index}
                                                className="text-xl not-italic font-bold leading-[150%]"
                                            >
                                                {item.amount.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                {item.denom}
                                            </p>
                                        )
                                    )}
                                </div>
                                <div className="pb-6">
                                    <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                        Current Vote Percentage
                                    </p>
                                    <p className="text-xl not-italic font-bold leading-[150%]">
                                        {mockData.currentVotePercentage}%
                                    </p>
                                </div>
                                <div className="pb-6">
                                    <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                        Status
                                    </p>
                                    <p className="text-[#00FFC2] text-xl not-italic font-bold leading-[150%]">
                                        {mockData.status}
                                    </p>
                                </div>
                                <div className="pb-6">
                                    <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                        Total Voting Power
                                    </p>
                                    <p className="text-xl not-italic font-bold leading-[150%]">
                                        {mockData.totalVotingPower}
                                    </p>
                                </div>
                                <div className="mt-auto pt-6">
                                    <Button
                                        onClick={handleVoteClick}
                                        className="text-[#080815] text-center text-xl not-italic font-medium leading-[21px] flex w-full h-[45px] justify-center items-center gap-2.5 shrink-0 px-6 py-0 bg-white hover:text-white"
                                    >
                                        Vote for Project
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
