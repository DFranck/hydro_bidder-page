"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorizontalDivider } from "../ui/HorizontalDivider"
import { useCallback, useState, useEffect, useMemo } from "react"
import {
    LockEntry,
    LockEntryWithPower,
    Proposal,
} from "../ts_types/HydroBase.types"
import { GlobalState } from "../types"
import { useChain } from "@cosmos-kit/react"
import { Tribute } from "../ts_types/TributeBase.types"
import { fetchMyAllLockups, useMyVotes } from "@/hooks/hooks"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EditLockupDuration } from "@/app/ui/modals/EditLockupDuration"
import { DashboardTopModules, TabLabel } from "./topModules/TopModules"
import { useSearchParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { LockIcon, TriangleAlertIcon } from "lucide-react"
import { WarningIcon } from "@/components/wallet/Warning"

export default function Dashboard({
    lastProposalTranches,
    currentProposalTranches,
    lastVotingPower,
    currentVotingPower,
    globalState,
    currentProposalTributes,
    lastProposalTributes,
}: {
    currentProposalTranches: Map<number, Proposal[]>
    currentVotingPower: BigInt
    currentProposalTributes: Map<number, Tribute[]>
    lastProposalTranches?: Map<number, Proposal[]>
    lastVotingPower?: BigInt
    lastProposalTributes?: Map<number, Tribute[]>
    globalState: GlobalState
}) {
    const [tab, setTab] = useState<TabLabel>(TabLabel.VOTING)

    const onEditLockup = useCallback((lockup: LockEntry) => {
        console.log({ lockup })
    }, [])

    const tabsBtnsClass =
        "inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-[#FFE1B8] text-center text-base not-italic font-normal leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8] data-[state=active]:bg-[#FFE1B8] data-[state=active]:text-foreground data-[state=active]:shadow-sm inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 border text-center text-base not-italic data-[state=active]:font-bold leading-[21px] px-5 py-0 rounded-[6px_6px_0px_0px] border-solid border-[#FFE1B8]"

    const { isWalletConnected, address: walletAddress } =
        useChain("neutrontestnet")
    const { data: myVotes = [] } = useMyVotes(
        walletAddress || "",
        globalState.currentRound,
        Array.from(currentProposalTranches.keys())
    )

    return (
        <div className="px-[90px] pb-[90px] max-w-[1440px] mx-auto">
            <DashboardTopModules onTabChange={setTab} tab={tab} />
            {/* <div className="pt-[70px]">
                <Tabs value={tab}>
                    <TabsList className="p-[unset] h-[unset] rounded-[unset] bg-transparent flex flex-row justify-start gap-[10px]">
                        {isWalletConnected && <TabsTrigger className={tabsBtnsClass} value="tribute" onClick={() => onTabChange(TabLabel.TRIBUTE)}>Earned Tribute</TabsTrigger>}
                        {isWalletConnected && <TabsTrigger className={tabsBtnsClass} value="lockups" onClick={() => onTabChange(TabLabel.LOCKUPS)}>Lockups</TabsTrigger>}
                    </TabsList>
                    <HorizontalDivider style="mt-[-21px]" />

                    {isWalletConnected && walletAddress && <>
                        <TributeTab
                            walletAddress={walletAddress}
                        />
                        <LockupsTab onEditLockup={onEditLockup} walletAddress={walletAddress} />
                    </>}
                </Tabs>
            </div> */}
            {isWalletConnected && walletAddress && (
                <div className="mt-10">
                    <Lockups
                        onEditLockup={onEditLockup}
                        walletAddress={walletAddress}
                    />
                </div>
            )}
        </div>
    )
}

function TributeTab({ walletAddress }: { walletAddress: string }) {
    return (
        <TabsContent value="tribute">
            <div className="flex flex-row gap-[60px]">
                <div className="w-[550px] h-[356px] shrink-0 bg-[linear-gradient(180deg,rgba(0,21,45,0.40)_0%,rgba(0,59,147,0.60)_100%)] rounded-[10px] p-6">
                    <h3 className="font-bold mb-[18px]">
                        Total Earned Tribute
                    </h3>
                    <table
                        style={{
                            width: "100%",
                            color: "white",
                            fontSize: "20px",
                        }}
                    >
                        <tbody>
                            {/* {totalEarnedTribute.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid white' }}>
                                    <td style={{ paddingTop: '8px', paddingBottom: '8px', paddingRight: '10px', display: 'flex', alignItems: 'start', flexDirection: 'row', WebkitAlignItems: 'center', gap: '5px' }}>{<Image src={'/images/Ellipse.svg'} alt='twitter' width={12} height={12} />}{item.tributeToken}</td>
                                    <td style={{ paddingTop: '8px', paddingBottom: '8px', textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(item.tributeAmount)}</td>
                                </tr>
                            ))} */}
                            <tr style={{ color: "#E4B472" }}>
                                <td
                                    style={{
                                        paddingTop: "10px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    TOTAL
                                </td>
                                {/* <td style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-[-webkit-fill-available] mt-6">
                    <h3 className="font-bold mb-[18px]">Tribute History</h3>
                    <div className="flex flex-col gap-[16px] h-[278px] overflow-y-auto">
                        {/* {tributeHistory.map((item, index) => {
                            return (
                                <div key={index} className="flex flex-row bg-[#303132] rounded-[10px] p-6 justify-between px-6 py-[14px]">
                                    <div className="flex flex-col">
                                        <p className="text-base not-italic font-normal leading-[150%]">{item.title}</p>
                                        <p className="text-xl not-italic font-bold leading-[150%]">{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                    </div>
                                    <p className="text-base not-italic font-normal leading-[150%]">{item.period}</p>
                                </div>
                            )
                        })} */}
                    </div>
                </div>
            </div>
        </TabsContent>
    )
}

function Lockups({
    onEditLockup,
    walletAddress,
}: {
    onEditLockup: (lockup: LockEntry) => void
    walletAddress: string
}) {
    const [myLockups, setMyLockups] = useState<LockEntryWithPower[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLockups = async () => {
            try {
                const myLockups = await fetchMyAllLockups(walletAddress)
                setMyLockups(myLockups)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLockups()
    }, [walletAddress])

    // const calculateDaysRemaining = (lockEnd: string) => {
    //     const now = new Date().getTime()
    //     const end = parseInt(lockEnd) / 1000000 // Convert nanoseconds to milliseconds
    //     const diff = end - now
    //     const daysRemaining = Math.max(
    //         0,
    //         Math.floor(diff / (1000 * 60 * 60 * 24))
    //     ) // Ensure non-negative result
    //     console.log(
    //         `Lock end: ${lockEnd}, Now: ${now}, Diff: ${diff}, Days remaining: ${daysRemaining}`
    //     )
    //     return daysRemaining
    // }

    const isExpired = (lockEnd: string) => {
        const now = new Date().getTime()
        const end = parseInt(lockEnd) / 1000000 // Convert nanoseconds to milliseconds
        const diff = end - now
        return diff < 0
    }

    const timeRemainingPercent = ({ lock_start, lock_end }: LockEntry) => {
        const lockStartMs = parseInt(lock_start) / 1e6
        const lockEndMs = parseInt(lock_end) / 1e6
        const nowMs = Date.now()
        const totalDuration = lockEndMs - lockStartMs
        const elapsedTime = nowMs - lockStartMs
        const percentagePassed = (elapsedTime / totalDuration) * 100

        return Math.floor(percentagePassed)
    }

    const formatDate = (date: string) => {
        const timestampMs = parseInt(date) / 1e6
        const dateObj = new Date(timestampMs)
        return dateObj.toISOString().split("T")[0]
    }

    return (
        <div>
            <h3>My Lockups</h3>
            <Table className="border-separate border-spacing-y-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>Lockup ID</TableHead>
                        <TableHead>Voting Power</TableHead>
                        <TableHead>ATOM</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Time Remaining</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading &&
                        [...Array(5)].map((_, index) => (
                            <TableRow
                                key={index}
                                className="h-20 border-b-0 bg-[#303132] hover:bg-[#555555]"
                            >
                                <TableCell className="rounded-l-xl">
                                    <div className="inline-flex items-center h-full">
                                        <div className="w-16 h-4 bg-[#555555] rounded animate-pulse"></div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-20 h-4 bg-[#555555] rounded animate-pulse"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-24 h-4 bg-[#555555] rounded animate-pulse"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-24 h-4 bg-[#555555] rounded animate-pulse"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-24 h-4 bg-[#555555] rounded animate-pulse"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="w-full h-4 bg-[#555555] rounded animate-pulse"></div>
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className="rounded-r-xl"
                                >
                                    <div className="w-24 h-8 bg-[#555555] rounded animate-pulse"></div>
                                </TableCell>
                            </TableRow>
                        ))}
                    {myLockups && myLockups.length > 0 ? (
                        myLockups.map((lockup, index) => (
                            <TableRow
                                key={index}
                                className="h-20 border-b-0 bg-[#303132] hover:bg-[#555555]"
                            >
                                <TableCell className="rounded-l-xl">
                                    <div className="inline-flex items-center h-full">
                                        <LockIcon className="w-4 h-4 mr-2 text-white" />
                                        {lockup.lock_entry.lock_id}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {lockup.current_voting_power}
                                </TableCell>
                                <TableCell>
                                    {(
                                        parseInt(
                                            lockup.lock_entry.funds.amount
                                        ) / 1000000
                                    ).toLocaleString("en-US", {
                                        minimumFractionDigits: 6,
                                    })}
                                </TableCell>
                                <TableCell>
                                    {formatDate(lockup.lock_entry.lock_start)}
                                </TableCell>
                                <TableCell>
                                    {formatDate(lockup.lock_entry.lock_end)}
                                </TableCell>
                                <TableCell>
                                    {isExpired(lockup.lock_entry.lock_end) ? (
                                        <div className="inline-flex items-center">
                                            <TriangleAlertIcon className="w-8 h-8 text-white" />
                                        </div>
                                    ) : (
                                        <Progress
                                            value={timeRemainingPercent(
                                                lockup.lock_entry
                                            )}
                                        />
                                    )}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className="rounded-r-xl"
                                >
                                    <EditLockupDuration
                                        lockup={lockup.lock_entry}
                                        onEditLockup={onEditLockup}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="h-20 border-b-0 bg-[#303132] hover:bg-[#303132]">
                            <TableCell colSpan={6} className="rounded-xl">
                                <div className="flex items-center justify-center h-20 ml-5 rounded-xl flex-1">
                                    <p className="text-gray-200">
                                        No lockups found
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

function RewardsSnapshot({ amount }: { amount: number }) {
    return (
        <div className="bg-[#1a1b23] rounded-lg p-4 max-w-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full p-2 mr-2">
                        <span className="text-white text-xl">$</span>
                    </div>
                    <h2 className="text-white text-lg font-semibold">
                        Rewards
                        <br />
                        Snapshot
                    </h2>
                </div>
                <button className="bg-[#4ade80] text-black px-4 py-2 rounded-md text-sm font-medium">
                    Claim Rewards
                </button>
            </div>
            <p className="text-gray-400 text-sm mb-2">
                Your ROI on your staked stATOM
            </p>
            <p className="text-[#4ade80] text-3xl font-bold">
                $
                {amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </p>
            <p className="text-gray-400 text-xs">USDC EQUIVALENT</p>
        </div>
    )
}
