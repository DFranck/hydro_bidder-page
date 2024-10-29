"use client"

import { useAppContext } from "@/app/(with-context)/context"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { TopCard } from "@/components/TopCard"
import { useUserVotingData } from "@/hooks/hooks"
import { cn, formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"

export enum TabLabel {
    VOTING = "voting",
    DEPLOYED = "deployed",
    LOCKUPS = "lockups",
    TRIBUTE = "tribute",
}

export const DashboardTopModules = () => {
    const { address } = useChain("neutron")
    const { data: userVotingData } = useUserVotingData(address ?? "")

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <TotalLockedATOMCard isLoading={!userVotingData} />
            <YourLockedATOMCard
                count={userVotingData?.lockups.count}
                lockedAtom={userVotingData?.lockups.lockedAtom}
                isLoading={!userVotingData}
            />
            <VotingPowerCard
                isLoading={!userVotingData}
                votingPower={userVotingData?.votingPower}
                firstExpireTs={userVotingData?.lockups.firstExpireTs}
            />
        </div>
    )
}

function RewardsSnapshotCard({ amount }: { amount: number }) {
    return (
        <div className={cn("flex h-full flex-col rounded-xl p-8")}>
            <div className="flex flex-1 flex-col justify-between text-white">
                <div className="flex w-full justify-between">
                    <Image
                        alt="Locked ATOM"
                        src="/images/Rewards_Light.svg"
                        width={100}
                        height={100}
                    />
                    <StyledText as="button" variant="button.primary.large">
                        Claim Rewards
                    </StyledText>
                </div>
                <h3 className="py-4 text-white">Rewards Snapshot</h3>
                <p className="text-xl font-normal">ROI on your locked ATOM</p>
                <p className="pt-[30px] text-5xl font-bold not-italic slashed-zero leading-[124.7%] tracking-[-1.296px] text-[#E4B472]">
                    {Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                        style: "currency",
                        currency: "USD",
                    }).format(amount)}
                </p>
                <p className="text-base font-medium uppercase not-italic slashed-zero leading-[130%] text-[#FFE1B8]">
                    USD EQUIVALENT
                </p>
            </div>
        </div>
    )
}

function YourLockedATOMCard({
    count,
    lockedAtom,
    isLoading,
}: {
    count?: number
    lockedAtom?: number
    isLoading: boolean
}) {
    const {
        globalState: {
            constants: { max_locked_tokens_per_address },
        },
    } = useAppContext()

    const percentLocked = max_locked_tokens_per_address
        ? ((lockedAtom ?? 0) / max_locked_tokens_per_address) * 100
        : 0

    return (
        <TopCard
            icon={
                <Image
                    alt="Your Locked ATOM"
                    className="translate-x-4"
                    src={"/images/Lock_Light.svg"}
                    fill={true}
                />
            }
            isLoading={isLoading}
            value={
                <>
                    {((lockedAtom ?? 0) / 1e6).toLocaleString("en-US", {
                        maximumFractionDigits: 4,
                    })}
                </>
            }
            title={
                <div className="flex items-center gap-1">
                    Your Locked ATOM{" "}
                    <Tooltip
                        tipContents={
                            <>
                                Your staked ATOM locked in Hydro. The more ATOMs
                                you lock, the higher your voting power will be
                            </>
                        }
                    />
                </div>
            }
            label={
                <>
                    <strong>{percentLocked.toFixed(2)}%</strong> of{" "}
                    <strong>
                        {formatAmount(max_locked_tokens_per_address ?? 0)}
                    </strong>{" "}
                    max.
                </>
            }
        />
    )
}

function VotingPowerCard({
    votingPower,
    firstExpireTs,
    isLoading,
}: {
    votingPower?: number
    firstExpireTs?: number
    isLoading: boolean
}) {
    return (
        <TopCard
            icon={
                <Image
                    alt="Voting Power"
                    className="translate-x-2"
                    src={"/images/Wallet_Light.svg"}
                    fill={true}
                />
            }
            isLoading={isLoading}
            value={
                (!!votingPower &&
                    votingPower > 0 &&
                    formatAmount(votingPower)) ||
                "0.00"
            }
            title={
                <div className="flex items-center gap-1">
                    Voting Power{" "}
                    <Tooltip
                        tipContents={
                            <>
                                Your Hydro voting power. The more power you
                                have, the larger share of tributes you will
                                receive
                            </>
                        }
                    />
                </div>
            }
            label={
                votingPower === 0 ? null : firstExpireTs &&
                  firstExpireTs > 0 ? (
                    <>
                        until{" "}
                        {new Date(firstExpireTs / 1e6).toLocaleDateString()}
                    </>
                ) : (
                    "Your current Voting Power"
                )
            }
        />
    )
}

function TotalLockedATOMCard({ isLoading }: { isLoading: boolean }) {
    const {
        globalState: {
            constants: { max_locked_tokens },
            totalLockedTokens,
        },
    } = useAppContext()

    const [totalLockedATOM, maxLockedATOM] = [
        totalLockedTokens ?? 0,
        max_locked_tokens ?? 0,
    ]

    return (
        <TopCard
            icon={
                <Image
                    alt="Total ATOM in Hydro"
                    className="translate-x-4"
                    src={"/images/Lock_Light.svg"}
                    fill={true}
                />
            }
            isLoading={isLoading}
            value={((totalLockedATOM ?? 0) / 1e6).toFixed(0)}
            title={
                <div className="flex items-center gap-1">
                    Total ATOM in Hydro
                </div>
            }
            label={
                <>
                    <strong>
                        {((totalLockedATOM / maxLockedATOM) * 100).toFixed(0)}%
                    </strong>{" "}
                    of <strong>{formatAmount(maxLockedATOM)}</strong> max.
                </>
            }
        />
    )
}
