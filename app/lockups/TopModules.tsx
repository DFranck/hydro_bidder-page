"use client"

import { TooltipIcon } from "@/components/TooltipIcon"
import { TopCard } from "@/components/TopCard"
import { Button } from "@/components/ui/button"
import { fetchUserVotingData, UserVotingData } from "@/hooks/hooks"
import { cn, formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import Image from "next/image"
import { useEffect, useState } from "react"

export enum TabLabel {
    VOTING = "voting",
    DEPLOYED = "deployed",
    LOCKUPS = "lockups",
    TRIBUTE = "tribute",
}

export const DashboardTopModules = () => {
    const { isWalletConnected, address } = useChain("neutron")
    const [userVotingData, setUserVotingData] = useState<UserVotingData>()

    useEffect(() => {
        const getUserVotingData = async (address: string) => {
            const data = await fetchUserVotingData(address)
            setUserVotingData(data)
        }
        if (isWalletConnected && address) {
            getUserVotingData(address)
        }
    }, [isWalletConnected, address])

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <LockedAtomCard
                isLoading={!userVotingData}
                count={userVotingData?.lockups.count}
                lockedAtom={userVotingData?.lockups.lockedAtom}
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
                    <Button className="h-10 rounded-full bg-[#00FFC2] text-center text-lg font-medium text-[#080815]">
                        Claim Rewards
                    </Button>
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

function LockedAtomCard({
    count,
    lockedAtom,
    isLoading,
}: {
    count?: number
    lockedAtom?: number
    isLoading: boolean
}) {
    return (
        <TopCard
            icon={
                <Image
                    alt="Locked ATOM"
                    className="translate-x-4"
                    src={"/images/Lock_Light.svg"}
                    fill={true}
                />
            }
            isLoading={isLoading}
            value={
                !!lockedAtom && lockedAtom > 0
                    ? formatAmount(lockedAtom)
                    : "0.00"
            }
            title={
                <div className="flex items-center gap-1">
                    Locked ATOM{" "}
                    <TooltipIcon>
                        Your staked ATOM locked in Hydro. The more ATOMs you
                        lock, the higher your voting power will be
                    </TooltipIcon>
                </div>
            }
            label={
                !!lockedAtom && lockedAtom > 0
                    ? `In ${count === 1 ? "Lockup" : "Lockups"}`
                    : undefined
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
                    <TooltipIcon>
                        Your Hydro voting power. The more power you have, the
                        larger share of tributes you will receive
                    </TooltipIcon>
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
