"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn, formatAmount } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { fetchUserVotingData, UserVotingData } from "@/hooks/hooks"
import { useEffect, useState } from "react"

export enum TabLabel {
    VOTING = "voting",
    DEPLOYED = "deployed",
    LOCKUPS = "lockups",
    TRIBUTE = "tribute",
}

const bgColor =
    "bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]"
const activeBgColor =
    "bg-white bg-[linear-gradient(180deg,rgba(255,255,255,1)_64%,rgba(0,35,255,1)_64%)]"

export const DashboardTopModules = () => {
    const { isWalletConnected, address } = useChain("neutron")
    const [userVotingData, setUserVotingData] = useState<UserVotingData | null>(
        {
            votingPower: 0,
            lockups: {
                count: 0,
                lockedAtom: 0,
                firstExpireTs: 0,
            },
        }
    )

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
        <div className="grid lg:grid-cols-2 gap-6">
            <LockedAtomCard
                count={userVotingData?.lockups.count || 0}
                lockedAtom={userVotingData?.lockups.lockedAtom || 0}
            />
            <VotingPowerCard
                votingPower={userVotingData?.votingPower || 0}
                firstExpireTs={userVotingData?.lockups.firstExpireTs || 0}
            />
        </div>
    )
}

export const ProposalListTopModules = () => {
    const bgColor =
        "bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]"
    return (
        <div className="flex flex-row justify-between bg-transparent">
            <div
                className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}
            >
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>
                    Current Round <br />
                    Tribute Value
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {(12345.67).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "USD",
                    })}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    USDC EQUIVALENT
                </p>
            </div>
            <div
                className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}
            >
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>
                    Current Round <br />
                    Time Remaining
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {"00:10"}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    DAYS: HOURS
                </p>
            </div>
            <div
                className={`flex w-[380px] h-[206px] flex-col shrink-0 p-6 rounded-[10px] ${bgColor}`}
            >
                <h3 className={`pb-4 text-white whitespace-pre-wrap`}>
                    Total Locked
                    <br />
                    ATOM
                </h3>
                <p
                    className={`text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px]`}
                >
                    {(12345.0).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                    })}
                </p>
                <p
                    className={`text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase`}
                >
                    $1,200,534 USDC Equivalent
                </p>
            </div>
        </div>
    )
}

function RewardsSnapshotCard({ amount }: { amount: number }) {
    return (
        <div className={cn("h-full flex flex-col p-8 rounded-xl", bgColor)}>
            <div className="flex flex-col flex-1 justify-between text-white">
                <div className="flex w-full justify-between">
                    <Image
                        alt="Locked ATOM"
                        src="/images/Rewards_Light.svg"
                        width={100}
                        height={100}
                    />
                    <Button className="h-10 rounded-full bg-[#00FFC2] text-[#080815] text-center text-lg font-medium">
                        Claim Rewards
                    </Button>
                </div>
                <h3 className="py-4 text-white">Rewards Snapshot</h3>
                <p className="text-xl font-normal">ROI on your locked ATOM</p>
                <p className="text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]">
                    {Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                        style: "currency",
                        currency: "USD",
                    }).format(amount)}
                </p>
                <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase">
                    USDC EQUIVALENT
                </p>
            </div>
        </div>
    )
}

function LockedAtomCard({
    count,
    lockedAtom,
}: {
    count: number
    lockedAtom: number
}) {
    return (
        <div className={cn("h-full flex flex-col p-8 rounded-xl", bgColor)}>
            <div className="flex flex-col flex-1 justify-between text-white">
                <Image
                    alt="Locked ATOM"
                    src={"/images/Lock_Light.svg"}
                    width={100}
                    height={100}
                />
                <h3 className="py-4 text-white">Locked ATOM</h3>
                <p className="text-xl font-normal">Your locked ATOM balance</p>
                {lockedAtom === 0 ? (
                    <div className="animate-pulse pt-6">
                        <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-6">
                            {formatAmount(lockedAtom)}
                        </p>
                        <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase">
                            IN {count} Lockups
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

function VotingPowerCard({
    votingPower,
    firstExpireTs,
}: {
    votingPower: number
    firstExpireTs: number
}) {
    return (
        <div className={cn("h-full flex flex-col p-8 rounded-xl", bgColor)}>
            <div className="flex flex-col flex-1 justify-between">
                <Image
                    alt="Voting Power"
                    src={"/images/Wallet_Light.svg"}
                    width={100}
                    height={100}
                />
                <h3 className="py-4 text-white">Voting Power</h3>
                <p className="text-xl font-normal">Your current Voting Power</p>
                {votingPower === 0 ? (
                    <div className="animate-pulse pt-6">
                        <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ) : (
                    <>
                        <p className="text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-6">
                            {votingPower.toLocaleString()}
                        </p>
                        {firstExpireTs > 0 && (
                            <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase">
                                until{" "}
                                {new Date(firstExpireTs / 1e6).toLocaleDateString()}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
