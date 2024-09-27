"use client"

import { EditLockupDuration } from "@/components/modals/EditLockupDuration"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchMyAllLockups, Validator } from "@/hooks/hooks"
import { calculateTimeRemaining, cn } from "@/lib/utils"
import { useChain } from "@cosmos-kit/react"
import { TriangleAlertIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { LockEntryWithPower } from "../ts_types/HydroBase.types"

import { PrettyTable } from "@/components/PrettyTable"
import { formatAmount } from "@/lib/utils"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import Link from "next/link"

export default function LockupsTable({
    validatorMap,
}: {
    validatorMap: Map<string, Validator>
}) {
    const {
        isWalletConnected,
        address,
        getSigningCosmWasmClient,
        getRestEndpoint,
    } = useChain("neutron")

    return (
        <>
            {isWalletConnected && address ? (
                <div className="mt-10">
                    <Lockups
                        walletAddress={address}
                        getSigningCosmWasmClient={getSigningCosmWasmClient}
                        validatorMap={validatorMap}
                        getRestEndpoint={getRestEndpoint}
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
    validatorMap,
    getRestEndpoint,
}: {
    walletAddress: string
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>
    validatorMap: Map<string, Validator>
    getRestEndpoint: () => Promise<string | ExtendedHttpEndpoint>
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
            <PrettyTable
                columns={[
                    { key: "lockedATOM", label: "Locked ATOM" },
                    { key: "multiplier", label: "Multiplier" },
                    { key: "votingPower", label: "Voting Power" },
                    { key: "expiresIn", label: "Expires In" },
                    { key: "endDate", label: "End Date" },
                    { key: "actions", label: "Actions" },
                ]}
                rows={myLockups.map((lockup, index) => {
                    return {
                        lockedATOM: (
                            <>
                                {formatAmount(lockup.lock_entry.funds.amount)}{" "}
                                ATOM
                            </>
                        ),
                        multiplier: (
                            <>
                                {(
                                    Number(lockup.current_voting_power) /
                                    Number(lockup.lock_entry.funds.amount)
                                ).toPrecision(3)}{" "}
                                x
                            </>
                        ),
                        votingPower: formatAmount(lockup.current_voting_power),
                        expiresIn: isExpired(lockup.lock_entry.lock_end) ? (
                            <TriangleAlertIcon className="h-8 w-8 text-white" />
                        ) : (
                            calculateTimeRemaining(lockup.lock_entry.lock_end)
                        ),
                        endDate: formatDate(lockup.lock_entry.lock_end),
                        actions: (
                            <EditLockupDuration
                                validatorMap={validatorMap}
                                onSuccess={onSuccess}
                                lockup={lockup}
                                walletAddress={walletAddress}
                                getSigningCosmWasmClient={
                                    getSigningCosmWasmClient
                                }
                                getRestEndpoint={getRestEndpoint}
                            />
                        ),
                    }
                })}
            />
            <div>
                <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3>My Lockups</h3>
                    <div className="flex items-center justify-between space-x-2">
                        <p className="sr-only">
                            Lock staked ATOM to get voting power
                        </p>
                        <Button
                            asChild
                            className="rounded-xl border-y-4 border-transparent bg-[#FFE1B8] text-black hover:border-b-[#E4B472] hover:bg-[#FFE1B8]"
                        >
                            <Link href="/lock-atom">New Lockup</Link>
                        </Button>
                    </div>
                </div>
                <p className="max-w-5xl text-sm text-neutral-400">
                    The more staked ATOM you lock, and the longer you lock it,
                    the more voting power you get. To increase your voting
                    power, you can either lock more ATOM in a new lockup, or
                    extend one of your existing lockups. Locked ATOM continues
                    earning staking rewards on the Cosmos Hub as well!
                </p>
            </div>
            <Table
                className={cn(
                    "border-separate border-spacing-y-2",
                    submitting && "pointer-events-none opacity-70"
                )}
            >
                <TableHeader>
                    <TableRow>
                        {/* <TableHead>Lockup ID</TableHead> */}
                        <TableHead className="text-center text-neutral-200">
                            Locked ATOM
                        </TableHead>
                        <TableHead className="text-center text-neutral-200">
                            Multiplier
                        </TableHead>
                        <TableHead className="text-center text-neutral-200">
                            Voting Power
                        </TableHead>
                        {/* <TableHead>Start Date</TableHead> */}
                        <TableHead className="text-center text-neutral-200">
                            Expires in
                        </TableHead>
                        <TableHead className="text-center text-neutral-200">
                            End Date
                        </TableHead>
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
                                    <div className="inline-flex h-full items-center">
                                        <div className="h-4 w-16 animate-pulse rounded bg-[#555555]"></div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-20 animate-pulse rounded bg-[#555555]"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-24 animate-pulse rounded bg-[#555555]"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-24 animate-pulse rounded bg-[#555555]"></div>
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-full animate-pulse rounded bg-[#555555]"></div>
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className="rounded-r-xl"
                                >
                                    <div className="h-8 w-24 animate-pulse rounded bg-[#555555]"></div>
                                </TableCell>
                            </TableRow>
                        ))}
                    {myLockups && myLockups.length > 0 ? (
                        myLockups.map((lockup, index) => (
                            <TableRow
                                key={index}
                                className="h-20 border-b-0 bg-[#303132]/75 backdrop-blur hover:bg-[#0061FF]"
                            >
                                {/* <TableCell className="rounded-l-xl w-28">
                                    <div className="inline-flex items-center h-full">
                                        <LockIcon className="w-4 h-4 mr-2 text-white" />
                                        {lockup.lock_entry.lock_id}
                                    </div>
                                </TableCell> */}
                                <TableCell className="rounded-l-xl text-center">
                                    {formatAmount(
                                        lockup.lock_entry.funds.amount
                                    )}
                                    <small>ATOM</small>
                                </TableCell>
                                <TableCell className="text-center">
                                    {(
                                        Number(lockup.current_voting_power) /
                                        Number(lockup.lock_entry.funds.amount)
                                    ).toPrecision(3)}
                                    x
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatAmount(lockup.current_voting_power)}
                                </TableCell>
                                {/* <TableCell>
                                    {formatDate(lockup.lock_entry.lock_start)}
                                </TableCell> */}
                                <TableCell className="text-center">
                                    {isExpired(lockup.lock_entry.lock_end) ? (
                                        <div className="inline-flex items-center">
                                            <TriangleAlertIcon className="h-8 w-8 text-white" />
                                        </div>
                                    ) : (
                                        <p>
                                            {calculateTimeRemaining(
                                                lockup.lock_entry.lock_end
                                            )}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatDate(lockup.lock_entry.lock_end)}
                                </TableCell>
                                <TableCell className="rounded-r-xl text-center">
                                    <EditLockupDuration
                                        validatorMap={validatorMap}
                                        onSuccess={onSuccess}
                                        lockup={lockup}
                                        walletAddress={walletAddress}
                                        getSigningCosmWasmClient={
                                            getSigningCosmWasmClient
                                        }
                                        getRestEndpoint={getRestEndpoint}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="h-20 w-full border-b-0 bg-[#303132] hover:bg-[#303132]">
                            <TableCell colSpan={7} className="rounded-xl">
                                <div className="ml-5 flex h-20 items-center justify-center rounded-xl">
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
