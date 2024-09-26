"use client"

import { useProposalsContext } from "@/app/proposals/context"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    ToastAborted,
    ToastError,
    ToastProcessing,
} from "@/components/ui/toast-wallet"
import { Wallet } from "@/components/wallet/Wallet"
import { executeVote, fetchMyVotes, useUserVotingData } from "@/hooks/hooks"
import { formatAmount, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { CheckCircle, ChevronLeft, ScrollText, Vote } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { twMerge } from "tailwind-merge"

const ProposalDetail = ({
    proposal,
    deployed,
}: {
    proposal: Proposal
    deployed: boolean
}) => {
    const {
        globalState,
        currentProposalTributes,
        currentProposalTranches: proposalTranches,
    } = useProposalsContext()
    const [hasVoted, setHasVoted] = useState(false)
    const [hasVotedThisProposal, setHasVotedThisProposal] = useState(false)
    const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutron")
    const tributes = currentProposalTributes.get(proposal.proposal_id)!

    useEffect(() => {
        if (!address) {
            return
        }
        const fetchVoteStatus = async () => {
            const voteMap = await fetchMyVotes(
                address || "",
                globalState.currentRound,
                Array.from(proposalTranches.keys())
            )
            if (voteMap && voteMap.size < 1) {
                setHasVoted(false)
                return
            }

            let voted = Array.from(voteMap.values())
                .flat()
                .find((vote) => vote?.prop_id === Number(proposal.proposal_id))
            setHasVoted(true)
            setHasVotedThisProposal(!!voted)
        }
        fetchVoteStatus()
    }, [address])

    const { data: userVotingData } = useUserVotingData(address || "")

    async function onVote() {
        if (!proposal) {
            return
        }
        try {
            setSubmitting(true)
            ToastProcessing()
            const res = await executeVote(
                getSigningCosmWasmClient,
                address!,
                proposal.proposal_id,
                proposal.tranche_id
            )
        } catch (err: any) {
            if (
                err &&
                err?.message &&
                err.message.includes("Request rejected")
            ) {
                ToastAborted()
                return
            }
            ToastError(err)
        } finally {
            setSubmitting(false)
            setOpenChangeVoteModal(false)
        }
    }

    function onVoteClicked() {
        if (!hasVotedThisProposal && hasVoted) {
            setOpenChangeVoteModal(true)
        } else {
            onVote()
        }
    }

    function displayButton() {
        if (deployed) {
            return null
        }

        const baseButtonClasses = twMerge(
            `
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                px-6
                py-3
                text-center
                text-lg
                font-medium
                disabled:pointer-events-none
                disabled:cursor-not-allowed
                disabled:opacity-60
            `
        )

        if (!isWalletConnected) {
            return <Wallet notifyConnectedCB={() => null} />
        }

        if (submitting) {
            return (
                <button
                    disabled
                    className={twMerge(
                        baseButtonClasses,
                        `
                            border-2
                        `
                    )}
                >
                    Submitting...
                </button>
            )
        }

        if (userVotingData?.votingPower === 0) {
            return (
                <Link href="/lock-atom">
                    <button
                        className={twMerge(
                            baseButtonClasses,
                            `
                                bg-palette-green
                                text-palette-text
                            `
                        )}
                    >
                        Lock ATOM to vote
                    </button>
                </Link>
            )
        }

        if (hasVotedThisProposal) {
            return (
                <button
                    disabled
                    className={twMerge(
                        baseButtonClasses,
                        `
                            bg-white
                            text-palette-text
                            !opacity-100
                        `
                    )}
                >
                    <CheckCircle />
                    <span>Voted!</span>
                </button>
            )
        }

        return (
            <button
                onClick={() => onVoteClicked()}
                className={twMerge(
                    baseButtonClasses,
                    `
                        bg-palette-green
                        text-palette-text
                    `
                )}
            >
                <Vote />
                <span>Vote for proposal</span>
            </button>
        )
    }

    const ChangeVote = () => {
        return (
            <Dialog
                open={openChangeVoteModal}
                onOpenChange={setOpenChangeVoteModal}
            >
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="w-[698px] rounded-[10px] border-none bg-neutral-900 p-12 text-white">
                    <DialogHeader className="pb-[34px]">
                        <DialogTitle className="text-[32px] font-bold not-italic leading-[120%] tracking-[-0.4px]">
                            Change your vote?
                        </DialogTitle>
                        <DialogDescription className="text-xl text-white/50">
                            Changing your vote will reallocate your total voting
                            power to the new project.
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        onClick={onVote}
                        type="button"
                        variant="secondary"
                        className="w-full rounded-[10px] hover:border hover:border-white hover:bg-neutral-900 hover:text-white"
                    >
                        Vote for this project
                    </Button>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-[10px] border border-solid border-white hover:bg-white hover:text-black"
                        >
                            Don&rsquo;t change my vote
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className="mx-auto max-w-7xl">
            <ChangeVote />

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[10px]
                    bg-palette-text/20
                    p-12
                    backdrop-blur-md
                "
            >
                {hasVotedThisProposal && (
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-3
                            -z-10
                            rounded-md
                            bg-gradient-to-bl
                            from-palette-green
                            via-transparent
                            to-transparent
                        "
                    />
                )}
                <div
                    className="
                        flex
                        flex-col
                        justify-between
                        gap-8
                        md:flex-row
                    "
                >
                    <div>
                        <Link
                            href="/proposals"
                            className="
                                mb-12
                                flex
                                w-min
                                items-center
                                gap-1
                                rounded-md
                                border-2
                                border-palette-beige
                                px-3
                                py-px
                                text-palette-beige
                                opacity-80
                                transition-all
                                hover:-translate-x-1
                                hover:scale-105
                                hover:bg-palette-beige
                                hover:text-palette-text
                                hover:opacity-100
                            "
                        >
                            <ChevronLeft
                                className="transition-all group-hover:-ml-1"
                                size={14}
                            />
                            Back
                        </Link>
                        <div className="flex flex-row items-center gap-4 pb-5">
                            <div
                                className="
                                    flex
                                    size-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-palette-beige/20
                                "
                            >
                                <ScrollText />
                            </div>
                            <h1 className="max-w-lg text-2xl tracking-normal">
                                {proposal.title}
                            </h1>
                        </div>
                        <div className="pl-16">
                            <p className="mb-2 mt-6 text-sm uppercase opacity-80">
                                Project Overview
                            </p>
                            <div className="pb-15 prose text-white marker:text-white prose-headings:text-white prose-h1:tracking-normal prose-strong:text-white prose-ol:text-white prose-li:text-white">
                                <Markdown>
                                    {proposal.description.replaceAll(
                                        /\\n/g,
                                        "\n"
                                    )}
                                </Markdown>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div
                        className="
                            mt-6
                            w-full
                            pb-10
                            md:mt-0
                            md:w-[30%]
                        "
                    >
                        <div className="w-[250px] pb-8 pt-6">
                            {displayButton()}
                        </div>

                        <div>
                            <div className="pb-6">
                                <p className="text-sm opacity-80">
                                    Tribute to Voters
                                </p>
                                {sumTributeAmounts(tributes).length > 0 ? (
                                    sumTributeAmounts(tributes).map(
                                        (tribute, index) => (
                                            <p
                                                key={index}
                                                className="text-xl font-bold not-italic"
                                            >
                                                {`${formatAmount(
                                                    tribute.amount
                                                )} ${
                                                    tribute.denom.length > 20
                                                        ? tribute.denom.slice(
                                                              0,
                                                              17
                                                          ) + "..."
                                                        : tribute.denom
                                                }`}
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p className="text-xl font-bold not-italic">
                                        None
                                    </p>
                                )}
                            </div>
                            <div className="pb-6">
                                <p className="text-sm opacity-80">
                                    Current Vote Percentage
                                </p>
                                <p className="text-xl font-bold not-italic">
                                    {proposal.percentage}%
                                </p>
                            </div>
                            <div className="pb-6">
                                <p className="text-sm opacity-80">Status</p>
                                <p className="text-xl font-bold not-italic text-[#00FFC2]">
                                    {deployed ? "Deployed" : "In voting"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalDetail
