import Image from "next/image"
import { mockGlobalState } from "../mockData"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    return (
        <div className="grid lg:grid-cols-3 gap-12">
            <RewardsSnapshotCard amount={12345.67} />
            <LockedAtomCard />
            <VotingPowerCard />
        </div>
    )
}

export const ProposalListTopModules = () => {
    const bgColor =
        "bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]"
    return (
        <div className="flex flex-row justify-between bg-transparent bg-[linear-gradient(180deg,rgba(0,59,147,0.30)_0%,rgba(0,97,255,0.70)_100%)]">
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

function LockedAtomCard() {
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
                <p className="text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]">
                    {mockGlobalState.totalLockedTokens}
                </p>
                <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase">
                    IN 3 Lockups
                </p>
            </div>
        </div>
    )
}

function VotingPowerCard() {
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
                <p className="text-[#E4B472] slashed-zero text-5xl not-italic font-bold leading-[124.7%] tracking-[-1.296px] pt-[30px]">
                    456
                </p>
                <p className="text-[#FFE1B8] slashed-zero text-base not-italic font-medium leading-[130%] uppercase">
                    until (pull date of soonest lockup)
                </p>
            </div>
        </div>
    )
}
