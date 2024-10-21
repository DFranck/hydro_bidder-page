"use client"

import { Proposal } from "@/app/ts_types/HydroBase.types"
import { useVotingContext } from "@/app/voting/context"
import { Confetti } from "@/components/Confetti"
import { MarkdownContainer } from "@/components/MarkdownContainer"
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
import kebabCase from "lodash/kebabCase"
import {
    ArrowUpRight,
    CheckCircle,
    ChevronLeft,
    LinkIcon,
    ScrollText,
    Vote,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
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
        assetListWithPrices,
    } = useVotingContext()
    const [hasVoted, setHasVoted] = useState(false)
    const [hasVotedThisProposal, setHasVotedThisProposal] = useState(false)
    const [openChangeVoteModal, setOpenChangeVoteModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutron")
    const [isLoading, setIsLoading] = useState(false)
    const tributes = currentProposalTributes.get(proposal.proposal_id)!
    const [isCelebrating, setIsCelebrating] = useState(false)

    const fetchVoteStatus = useCallback(async () => {
        if (!address) {
            return
        }

        setIsLoading(true)

        const voteMap = await fetchMyVotes(
            address || "",
            globalState.currentRound,
            Array.from(proposalTranches.keys())
        )

        setIsLoading(false)

        if (voteMap && voteMap.size < 1) {
            setHasVoted(false)
            return
        }

        let voted = Array.from(voteMap.values())
            .flat()
            .find((vote) => vote?.prop_id === Number(proposal.proposal_id))

        setHasVoted(true)
        setHasVotedThisProposal(!!voted)
    }, [
        address,
        globalState.currentRound,
        proposal.proposal_id,
        proposalTranches,
    ])

    useEffect(() => {
        fetchVoteStatus()
    }, [fetchVoteStatus])

    const { data: userVotingData } = useUserVotingData(address || "")

    async function onVote() {
        if (!proposal) {
            return
        }
        try {
            setSubmitting(true)
            ToastProcessing()

            await executeVote(
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
            setIsCelebrating(true)
            fetchVoteStatus()
        }
    }

    function PrimaryActionButton() {
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

        if (isLoading) {
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
                    Loading...
                </button>
            )
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
                <Link
                    href="/lock-atom"
                    className={twMerge(
                        baseButtonClasses,
                        `
                            bg-palette-green
                            text-palette-text
                        `
                    )}
                >
                    Lock ATOM to vote
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
                            border-2
                            border-palette-green
                            bg-transparent
                            text-palette-green
                            !opacity-100
                        `
                    )}
                >
                    <CheckCircle />
                    <span>Voted!</span>
                </button>
            )
        }

        const hasVotedElsewhere = hasVoted && !hasVotedThisProposal

        return (
            <button
                onClick={() => {
                    if (hasVotedElsewhere) {
                        setOpenChangeVoteModal(true)
                    } else {
                        onVote()
                    }
                }}
                className={twMerge(
                    baseButtonClasses,
                    `
                        bg-palette-green
                        text-palette-text
                    `
                )}
            >
                <Vote />
                <span>Vote for Proposal</span>
            </button>
        )
    }

    function ChangeVoteModal() {
        return (
            <Dialog
                open={openChangeVoteModal}
                onOpenChange={setOpenChangeVoteModal}
            >
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change your vote?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Changing your vote will reallocate your total voting
                        power to the new project.
                    </DialogDescription>
                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={onVote}
                        >
                            Change Vote to This Proposal
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Don&rsquo;t change my vote
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    const renderedProposal = {
        ...proposal,
        ...(globalState.bidDescriptions[proposal.proposal_id] ?? {}),
    }

    const summedTributes = sumTributeAmounts(tributes)

    const pricedAndNamedTributes = summedTributes.map((tribute) => {
        const assetInfo = assetListWithPrices.get(tribute.denom)
        return {
            ...tribute,
            priceUsd: assetInfo?.priceUsd,
            symbol: assetInfo?.symbol,
            decimals: assetInfo?.decimals,
        }
    })

    return (
        <>
            <ChangeVoteModal />

            <Confetti
                trigger={isCelebrating}
                onComplete={() => setIsCelebrating(false)}
            />

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
                            left-0
                            right-0
                            top-0
                            -z-10
                            h-96
                            rounded-md
                            bg-gradient-to-bl
                            from-palette-green/30
                            via-palette-green/0
                            to-palette-green/0
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
                            href="/voting"
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
                                {renderedProposal.title}
                            </h1>
                        </div>
                        <div className="js-bid-details pl-16">
                            {renderedProposal.description && (
                                <>
                                    <h2
                                        id="bid-description"
                                        className="
                                            mb-2
                                            mt-6
                                            text-sm
                                            uppercase
                                            opacity-80
                                            [body:has(a[href='#bid-description']:focus)_&]:rounded-sm
                                            [body:has(a[href='#bid-description']:focus)_&]:outline
                                            [body:has(a[href='#bid-description']:focus)_&]:outline-2
                                            [body:has(a[href='#bid-description']:focus)_&]:outline-offset-4
                                            [body:has(a[href='#bid-description']:focus)_&]:outline-palette-green
                                        "
                                    >
                                        Bid Description
                                    </h2>
                                    <MarkdownContainer
                                        content={renderedProposal.description}
                                    />
                                </>
                            )}
                            {renderedProposal.committeeComments && (
                                <>
                                    <h2
                                        id="committee-review"
                                        className="
                                            mb-2
                                            mt-6
                                            text-sm
                                            uppercase
                                            opacity-80
                                            [body:has(a[href='#committee-review']:focus)_&]:rounded-sm
                                            [body:has(a[href='#committee-review']:focus)_&]:outline
                                            [body:has(a[href='#committee-review']:focus)_&]:outline-2
                                            [body:has(a[href='#committee-review']:focus)_&]:outline-offset-4
                                            [body:has(a[href='#committee-review']:focus)_&]:outline-palette-green
                                        "
                                    >
                                        Committee Review
                                    </h2>
                                    <MarkdownContainer
                                        content={
                                            renderedProposal.committeeComments
                                        }
                                    />
                                </>
                            )}
                            {renderedProposal.appendix && (
                                <>
                                    <h2
                                        id="appendix"
                                        className="
                                            mb-2
                                            mt-6
                                            text-sm
                                            uppercase
                                            opacity-80
                                            [body:has(a[href='#appendix']:focus)_&]:rounded-sm
                                            [body:has(a[href='#appendix']:focus)_&]:outline
                                            [body:has(a[href='#appendix']:focus)_&]:outline-2
                                            [body:has(a[href='#appendix']:focus)_&]:outline-offset-4
                                            [body:has(a[href='#appendix']:focus)_&]:outline-palette-green
                                        "
                                    >
                                        Appendix
                                    </h2>
                                    <MarkdownContainer
                                        content={renderedProposal.appendix}
                                    />
                                </>
                            )}
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
                            <PrimaryActionButton />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="text-sm opacity-80">
                                    Project Name
                                </p>
                                <p className="text-xl font-bold not-italic">
                                    {renderedProposal.projectName.trim()}
                                </p>
                            </div>

                            {renderedProposal.projectType && (
                                <div>
                                    <p className="text-sm opacity-80">
                                        Project Type
                                    </p>
                                    <p className="text-xl font-bold not-italic">
                                        {renderedProposal.projectType}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm opacity-80">
                                    Tribute to Voters
                                </p>
                                {pricedAndNamedTributes.length > 0 ? (
                                    pricedAndNamedTributes.map(
                                        (tribute, index) => (
                                            <p
                                                key={index}
                                                className="break-words text-xl font-bold not-italic"
                                            >
                                                {formatAmount(tribute.amount)}{" "}
                                                {tribute.symbol ||
                                                    tribute.denom}
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p className="text-xl font-bold not-italic">
                                        None
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm opacity-80">
                                    Current Vote Percentage
                                </p>
                                <p className="text-xl font-bold not-italic">
                                    {proposal.percentage}%
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm opacity-80">Jump To</p>
                                <div className="flex flex-col gap-2">
                                    {[
                                        renderedProposal.description &&
                                            "Bid Description",
                                        renderedProposal.committeeComments &&
                                            "Committee Review",
                                        renderedProposal.appendix && "Appendix",
                                    ]
                                        .filter(Boolean)
                                        .map((section, index) => (
                                            <Link
                                                key={index}
                                                href={`#${kebabCase(section)}`}
                                                className="flex items-center gap-2 text-palette-green hover:underline"
                                            >
                                                <LinkIcon size={18} />

                                                {section}
                                            </Link>
                                        ))}
                                    <Link
                                        href={renderedProposal.projectUrl}
                                        target="_blank"
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            border-t
                                            border-white/20
                                            pt-2
                                            text-palette-green
                                            hover:underline
                                        "
                                    >
                                        <ArrowUpRight size={18} />
                                        Project Website
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProposalDetail
