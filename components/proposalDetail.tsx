"use client"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
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
import { executeVote, fetchMyVotes, useUserVotingData } from "@/hooks/hooks"
import { formatAmount, sumTributeAmounts } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Markdown from "react-markdown"

const ProposalDetail = ({
    globalState,
    proposalTranches,
    proposal,
    tributes,
    deployed,
}: {
    globalState: { currentRound: number }
    proposalTranches: Map<number, Proposal[]>
    proposal: Proposal
    tributes: Tribute[]
    deployed: boolean
}) => {
    const [hasVoted, setHasVoted] = useState(false)
    const [hasVotedThisProposal, setHasVotedThisProposal] = useState(false)
    const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutron")

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

        if (!isWalletConnected) {
            return (
                <Button
                    disabled
                    className="text-[#080815] text-center text-lg not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white w-full"
                >
                    Connect wallet to vote
                </Button>
            )
        }

        if (submitting) {
            return (
                <Button
                    disabled
                    className="text-[#080815] text-center text-lg not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white w-full"
                >
                    Submitting...
                </Button>
            )
        }

        if (userVotingData?.votingPower === 0) {
            return (
                <Link href="/lock-atom">
                    <Button className="text-[#080815] text-center text-lg not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white w-full">
                        Lock ATOM to vote
                    </Button>
                </Link>
            )
        }

        if (hasVotedThisProposal) {
            return (
                <Button
                    disabled
                    className="text-[#080815] text-center text-lg not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white w-full"
                >
                    You voted for this proposal
                </Button>
            )
        }

        return (
            <Button
                onClick={() => onVoteClicked()}
                className="text-[#080815] text-center text-lg not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white w-full"
            >
                Vote for proposal
            </Button>
        )
    }

    const ChangeVote = () => {
        return (
            <Dialog
                open={openChangeVoteModal}
                onOpenChange={setOpenChangeVoteModal}
            >
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12 text-white">
                    <DialogHeader className="pb-[34px]">
                        <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px]">
                            Change your vote?
                        </DialogTitle>
                        <DialogDescription className="text-white/50 text-xl">
                            Changing your vote will reallocate your total voting
                            power to the new project.
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        onClick={onVote}
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
                            {"Don't change my vote"}
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pb-44">
            <ChangeVote />

            <div
                className="
                    bg-palette-text/20
                    backdrop-blur-md
                    rounded-[10px]
                    p-12
                "
            >
                <div className="flex flex-col md:flex-row gap-8 justify-between">
                    <div>
                        <Link href="/proposals" className="opacity-80">
                            <Button
                                variant="link"
                                className="group mb-5 text-white pl-0 flex gap-1"
                            >
                                <ChevronLeft
                                    className="transition-all group-hover:-ml-1"
                                    size={14}
                                />
                                Back
                            </Button>
                        </Link>
                        <div className="flex flex-row gap-5 items-center pb-5">
                            <Image
                                src={"/images/icon_Boost.svg"}
                                width={50}
                                height={50}
                                alt="Icon"
                            />
                            <h1 className="text-2xl tracking-normal max-w-lg">
                                {proposal.title}
                            </h1>
                        </div>
                        <div>
                            <p className="text-sm opacity-80 mb-2 uppercase">
                                Project Overview
                            </p>
                            <div className="pb-15 prose prose-headings:text-white text-white prose-li:text-white prose-ol:text-white prose-strong:text-white marker:text-white prose-h1:tracking-normal">
                                <Markdown>
                                    {proposal.description.replaceAll(
                                        /\\n/g,
                                        "\n"
                                    )}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-[30%] mt-6 md:mt-0 pb-10">
                        <div className="pt-6 pb-8 w-[250px]">
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
                                                className="text-xl not-italic font-bold"
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
                                    <p className="text-xl not-italic font-bold">
                                        None
                                    </p>
                                )}
                            </div>
                            <div className="pb-6">
                                <p className="text-sm opacity-80">
                                    Current Vote Percentage
                                </p>
                                <p className="text-xl not-italic font-bold">
                                    {proposal.percentage}%
                                </p>
                            </div>
                            <div className="pb-6">
                                <p className="text-sm opacity-80">Status</p>
                                <p className="text-[#00FFC2] text-xl not-italic font-bold">
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
