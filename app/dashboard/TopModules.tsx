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
        <div className={cn("flex h-full flex-col rounded-xl p-8", bgColor)}>
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

const skeleton = () => {
    return (
        <div className="animate-pulse pt-6">
            <div className="mb-4 h-12 w-3/4 rounded bg-gray-300"></div>
            <div className="h-6 w-1/2 rounded bg-gray-300"></div>
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
        <div className={cn("flex h-full flex-col rounded-xl p-8", bgColor)}>
            <div className="flex flex-1 flex-col justify-between text-white">
                <div className="flex flex-row justify-between">
                    <Image
                        alt="Locked ATOM"
                        src={"/images/Lock_Light.svg"}
                        width={100}
                        height={100}
                    />
                    {isLoading
                        ? skeleton()
                        : !!lockedAtom &&
                          lockedAtom > 0 && (
                              <div className="flex flex-col items-end">
                                  <p className="pt-6 text-5xl font-bold not-italic slashed-zero leading-[124.7%] tracking-[-1.296px] text-[#E4B472]">
                                      {formatAmount(lockedAtom)}
                                  </p>
                                  <p className="text-base font-medium uppercase not-italic slashed-zero leading-[130%] text-[#FFE1B8]">
                                      IN {count} Lockups
                                  </p>
                              </div>
                          )}
                </div>
                <div>
                    <h3 className="text-white">Locked ATOM</h3>
                    <p className="text-gray-400">
                        {lockedAtom === 0
                            ? "Lock ATOM to get Voting Power"
                            : "Your total locked ATOM balance"}
                    </p>
                </div>
            </div>
        </div>
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
        <div className={cn("flex h-full flex-col rounded-xl p-8", bgColor)}>
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-row justify-between">
                    <Image
                        alt="Voting Power"
                        src={"/images/Wallet_Light.svg"}
                        width={100}
                        height={100}
                    />
                    {isLoading
                        ? skeleton()
                        : !!votingPower &&
                          votingPower > 0 && (
                              <div className="flex flex-col items-end">
                                  <p className="pt-6 text-5xl font-bold not-italic slashed-zero leading-[124.7%] tracking-[-1.296px] text-[#E4B472]">
                                      {formatAmount(votingPower)}
                                  </p>
                                  {firstExpireTs && firstExpireTs > 0 && (
                                      <p className="text-base font-medium uppercase not-italic slashed-zero leading-[130%] text-[#FFE1B8]">
                                          until{" "}
                                          {new Date(
                                              firstExpireTs / 1e6
                                          ).toLocaleDateString()}
                                      </p>
                                  )}
                              </div>
                          )}
                </div>
                <div>
                    <h3 className="text-white">Voting Power</h3>
                    <p className="text-gray-400">
                        {votingPower === 0
                            ? "Lock ATOM to get Voting Power"
                            : "Your voting Power in this round"}
                    </p>
                </div>
            </div>
        </div>
    )
}
