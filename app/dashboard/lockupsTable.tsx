"use client"

import { EditLockupDuration } from "@/components/modals/EditLockupDuration"
import { PointingInfoBox } from "@/components/PointingInfoBox"
import { PrettyTable } from "@/components/PrettyTable"
import { fetchMyAllLockups, Validator } from "@/hooks/hooks"
import { calculateTimeRemaining, formatAmount } from "@/lib/utils"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { ExtendedHttpEndpoint } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LockEntryWithPower } from "../ts_types/HydroBase.types"

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
            <div
                className="
                  -mx-3
                  mt-10
                  space-y-6
                  overflow-hidden
                  rounded-md
                  bg-palette-text/20
                  px-3
                  backdrop-blur-md
              "
            >
                <div
                    className="
                        flex
                        justify-between
                        gap-12
                        p-6
                    "
                >
                    <h3>My Lockups</h3>

                    <div className="flex w-2/3 items-center gap-12">
                        <PointingInfoBox
                            description={
                                <>
                                    Voting power is proportional to the amount
                                    of ATOM you lock, and the duration of the
                                    lockup(s). Plus, you continue to earn
                                    staking rewards on your locked ATOM!
                                </>
                            }
                            pointDirection="right"
                        />
                        <Link
                            className="
                                whitespace-nowrap
                                rounded-md
                                bg-palette-beige
                                px-6
                                py-3
                                text-palette-text
                                hover:bg-palette-beige/80
                            "
                            href="/lock-atom"
                        >
                            New Lockup
                        </Link>
                    </div>
                </div>

                <PrettyTable
                    columns={[
                        {
                            key: "lockedATOM",
                            label: "Locked ATOM",
                            isSortable: true,
                        },
                        {
                            key: "multiplier",
                            label: "Multiplier",
                            isSortable: true,
                            textAlign: "right",
                        },
                        {
                            key: "votingPower",
                            label: "Voting Power",
                            isSortable: true,
                            textAlign: "right",
                        },
                        {
                            key: "endDate",
                            label: "End Date",
                            isSortable: true,
                            textAlign: "right",
                        },
                        {
                            key: "actions",
                            label: "Actions",
                            textAlign: "right",
                        },
                    ]}
                    rows={myLockups.map((lockup, index) => {
                        return {
                            lockedATOM: (
                                <>
                                    {formatAmount(
                                        lockup.lock_entry.funds.amount
                                    )}{" "}
                                    ATOM
                                </>
                            ),
                            multiplier: (
                                <>
                                    {(
                                        Number(lockup.current_voting_power) /
                                        Number(lockup.lock_entry.funds.amount)
                                    ).toPrecision(3)}{" "}
                                    &times;
                                </>
                            ),
                            votingPower: formatAmount(
                                lockup.current_voting_power
                            ),
                            endDate: (
                                <>
                                    {formatDate(lockup.lock_entry.lock_end)} (
                                    {isExpired(lockup.lock_entry.lock_end) ? (
                                        <TriangleAlertIcon className="h-8 w-8 text-white" />
                                    ) : (
                                        calculateTimeRemaining(
                                            lockup.lock_entry.lock_end
                                        )
                                    )}
                                    )
                                </>
                            ),
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
            </div>
        </div>
    )
}
