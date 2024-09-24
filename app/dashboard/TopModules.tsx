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
        <div className="grid lg:grid-cols-2 gap-6">
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

const skeleton = () => {
    return (
        <div className="animate-pulse pt-6">
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
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
        <div className={cn("h-full flex flex-col p-8 rounded-xl", bgColor)}>
            <div className="flex flex-col flex-1 justify-between text-white">
                <Image
                    alt="Locked ATOM"
                    src={"/images/Lock_Light.svg"}
                    width={100}
                    height={100}
                />
                <h3 className="py-4 text-white">Locked ATOM</h3>
                <p className="text-xl font-normal">
                    {lockedAtom === 0
                        ? "Lock ATOM to get Voting Power"
                        : "Your locked ATOM balance"}
                </p>
                {isLoading
                    ? skeleton()
                    : !!lockedAtom &&
                      lockedAtom > 0 && (
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
    isLoading,
}: {
    votingPower?: number
    firstExpireTs?: number
    isLoading: boolean
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
                <p className="text-xl font-normal">
                    {votingPower === 0
                        ? "Lock ATOM to get Voting Power"
                        : "Your current Voting Power"}
                </p>
                {isLoading
                    ? skeleton()
                    : !!votingPower &&
                      votingPower > 0 && (
                          <>
                              <p className="text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-6">
                                  {formatAmount(votingPower)}a
                              </p>
                              {firstExpireTs && firstExpireTs > 0 && (
                                  <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase">
                                      until{" "}
                                      {new Date(
                                          firstExpireTs / 1e6
                                      ).toLocaleDateString()}{" "}
                                      aa
                                  </p>
                              )}
                          </>
                      )}
            </div>
        </div>
    )
}
