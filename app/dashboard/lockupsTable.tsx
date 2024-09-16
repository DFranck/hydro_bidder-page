"use client"

import { useState, useEffect } from "react"
import { LockEntryWithPower, Proposal } from "../ts_types/HydroBase.types"
import { GlobalState } from "../types"
import { useChain } from "@cosmos-kit/react"
import { fetchMyAllLockups } from "@/hooks/hooks"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EditLockupDuration } from "@/app/ui/modals/EditLockupDuration"
import { LockIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateTimeRemaining, cn } from "@/lib/utils"

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"

export default function LockupsTable({
    currentProposalTranches,
    globalState,
}: {
    currentProposalTranches: Map<number, Proposal[]>
    globalState: GlobalState
}) {
    const { isWalletConnected, address, getSigningCosmWasmClient } =
        useChain("neutrontestnet")

    return (
        <>
            {isWalletConnected && address ? (
                <div className="mt-10">
                    <Lockups
                        walletAddress={address}
                        getSigningCosmWasmClient={getSigningCosmWasmClient}
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
    walletAddress,
    getSigningCosmWasmClient,
}: {
    walletAddress: string
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
}) {
    const [myLockups, setMyLockups] = useState<LockEntryWithPower[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [refetch, setRefetch] = useState(false)

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

        if (walletAddress && refetch) {
            fetchLockups()
            setRefetch(false)
            return
        }

        if (walletAddress) {
            fetchLockups()
        }
    }, [walletAddress, refetch])

    const isExpired = (lockEnd: string) => {
        const now = new Date().getTime()
        const end = parseInt(lockEnd) / 1000000 // Convert nanoseconds to milliseconds
        const diff = end - now
        return diff < 0
    }

    const formatDate = (date: string) => {
        const timestampMs = parseInt(date) / 1e6
        const dateObj = new Date(timestampMs)
        return dateObj.toISOString().split("T")[0]
    }

    const onSuccess = () => {
        setRefetch(true)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between">
                <h3>My Lockups</h3>
                <div className="space-x-2 flex items-center justify-between">
                    <span>Lock staked ATOM to get voting power </span>
                    <Button className="bg-[#FFE1B8] text-black rounded-xl border-y-4 border-transparent hover:border-b-[#E4B472] hover:bg-[#FFE1B8]">
                        New Lockup
                    </Button>
                </div>
            </div>
            <Table
                className={cn(
                    "border-separate border-spacing-y-2",
                    submitting && "opacity-70 pointer-events-none"
                )}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead>Lockup ID</TableHead>
                        <TableHead className="text-center">
                            Voting Power
                        </TableHead>
                        <TableHead className="text-center">ATOM</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Expire in</TableHead>
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
                                <TableCell className="rounded-l-xl w-28">
                                    <div className="inline-flex items-center h-full">
                                        <LockIcon className="w-4 h-4 mr-2 text-white" />
                                        {lockup.lock_entry.lock_id}
                                    </div>
                                </TableCell>
                                <TableCell className="lg:w-36 text-center">
                                    {lockup.current_voting_power}
                                </TableCell>
                                <TableCell className="lg:w-42 text-center">
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
                                <TableCell className="text-center lg:w-24">
                                    {isExpired(lockup.lock_entry.lock_end) ? (
                                        <div className="inline-flex items-center">
                                            <TriangleAlertIcon className="w-8 h-8 text-white" />
                                        </div>
                                    ) : (
                                        <p>
                                            {calculateTimeRemaining(
                                                lockup.lock_entry.lock_end
                                            )}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className="rounded-r-xl"
                                >
                                    <EditLockupDuration
                                        onSuccess={onSuccess}
                                        lockup={lockup}
                                        walletAddress={walletAddress}
                                        getSigningCosmWasmClient={
                                            getSigningCosmWasmClient
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="h-20 border-b-0 bg-[#303132] hover:bg-[#303132] w-full">
                            <TableCell colSpan={7} className="rounded-xl">
                                <div className="flex items-center justify-center h-20 ml-5 rounded-xl">
                                    <p className="text-gray-200">
                                        No lockups found.
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
