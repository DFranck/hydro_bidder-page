"use client"

import { useCallback, useState, useEffect } from "react"
import {
    LockEntry,
    LockEntryWithPower,
    Proposal,
} from "../ts_types/HydroBase.types"
import { GlobalState } from "../types"
import { useChain } from "@cosmos-kit/react"
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
import { Progress } from "@/components/ui/progress"
import { LockIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LockupsTable({
    currentProposalTranches,
    globalState,
}: {
    currentProposalTranches: Map<number, Proposal[]>
    globalState: GlobalState
}) {
    const { isWalletConnected, address: walletAddress } =
        useChain("neutrontestnet")

    const { data: myVotes = [] } = useMyVotes(
        walletAddress || "",
        globalState.currentRound,
        Array.from(currentProposalTranches.keys())
    )

    const onEditLockup = useCallback((lockup: LockEntryWithPower) => {
        console.log({ lockup })
    }, [])

    return (
        <>
            {isWalletConnected && walletAddress ? (
                <div className="mt-10">
                    <Lockups
                        onEditLockup={onEditLockup}
                        walletAddress={walletAddress}
                    />
                </div>
            ) : (
                <div className="mt-10">
                    <p>Connect your wallet to view your lockups</p>
                </div>
            )}
        </>
    )
}

function Lockups({
    onEditLockup,
    walletAddress,
}: {
    onEditLockup: (lockup: LockEntryWithPower) => void
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
            <div className="flex flex-col lg:flex-row justify-between">
                <h3>My Lockups</h3>
                <div className="space-x-2   ">
                    <span>Lock staked ATOM to get voting power </span>
                    <Button className="bg-[#FFE1B8] text-black rounded-xl border-y-4 border-transparent hover:border-b-[#E4B472] hover:bg-[#FFE1B8]">New Lockup</Button>
                </div>
            </div>
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
                                        lockup={lockup}
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
