"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { executeVote, fetchMyVotes } from "@/hooks/hooks"
import { useChain } from "@cosmos-kit/react"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { AlertTriangleIcon, ChevronLeft, Loader2Icon } from "lucide-react"
import Markdown from "react-markdown"
import { sumTributeAmounts } from "./proposalTable"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ProposalListTopModules } from "../dashboard/TopModules"
import {
    ToastAborted,
    ToastError,
    ToastProcessing,
} from "@/components/ui/toast-wallet"

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
        useChain("neutrontestnet")

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
            console.log("## Vote response", res)
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
        }
    }

    function onVoteClicked() {
        if (!hasVotedThisProposal && hasVoted) {
            setOpenChangeVoteModal(true)
        } else {
            onVote()
        }
    }

    function displayBtnText() {
        if (!isWalletConnected) {
            return "Connect wallet to vote"
        }
        if (submitting) {
            return "Submitting..."
        }

        return hasVotedThisProposal ? "Already Voted This" : "Vote for Project"
    }

    const ChangeVote = () => {
        return (
            <Dialog
                open={openChangeVoteModal}
                onOpenChange={setOpenChangeVoteModal}
            >
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
                    <DialogHeader className="pb-[34px]">
                        <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px]">
                            Change your vote?
                        </DialogTitle>
                        <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
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
        <div className="px-[90px] pb-[90px] max-w-[1440px] mx-auto">
            <ChangeVote />
            <ProposalListTopModules />
            <div className="bg-[#303132] rounded-[10px] p-12 mt-[72px]">
                <div className="flex flex-col md:flex-row gap-[10%] justify-between">
                    <div>
                        <Link href="/voting-proposals" className="opacity-80">
                            <Button
                                variant="link"
                                className="mb-5 text-white pl-0"
                            >
                                <ChevronLeft size={14} />
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
                            <p className="text-2xl not-italic font-bold leading-[150%]">
                                {proposal.title}
                            </p>
                        </div>
                        <div className="">
                            <p className="text-sm not-italic font-normal opacity-80">
                                Project Overview
                            </p>
                            <div className="not-italic font-normal pb-15 prose prose-headings:text-white text-white prose-li:text-white prose-ol:text-white prose-strong:text-white marker:text-white prose-h2:tracking-normal">
                                <Markdown>
                                    {proposal.description.replaceAll(
                                        /\\n/g,
                                        "\n"
                                    )}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-[30%] mt-6 md:mt-0 pb-10 ">
                        <div className="mt-auto pt-6 pb-16 w-[250px]">
                            {!deployed && (
                                <Button
                                    disabled={
                                        !isWalletConnected ||
                                        hasVotedThisProposal ||
                                        submitting
                                    }
                                    onClick={() => onVoteClicked()}
                                    className="w-[250px] text-[#080815] text-center text-xl not-italic font-medium leading-[21px] flex h-[45px] justify-center items-center gap-2.5 shrink-0 py-0 bg-white hover:text-white"
                                >
                                    {displayBtnText()}
                                </Button>
                            )}
                        </div>

                        <div className="pl-6">
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                    Tribute to Voters
                                </p>
                                {sumTributeAmounts(tributes).length > 0 ? (
                                    sumTributeAmounts(tributes).map(
                                        (tribute, index) => (
                                            <p
                                                key={index}
                                                className="text-xl not-italic font-bold leading-[150%]"
                                            >
                                                {`${(
                                                    tribute.amount / 1000000
                                                ).toFixed(2)} ${
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
                                    <p className="text-xl not-italic font-bold leading-[150%]">
                                        None
                                    </p>
                                )}
                            </div>
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                    Current Vote Percentage
                                </p>
                                <p className="text-xl not-italic font-bold leading-[150%]">
                                    {proposal.percentage}%
                                </p>
                            </div>
                            <div className="pb-6">
                                <p className="text-sm not-italic font-normal leading-[150%] opacity-80">
                                    Status
                                </p>
                                <p className="text-[#00FFC2] text-xl not-italic font-bold leading-[150%]">
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
