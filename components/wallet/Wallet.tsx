"use client"

import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { MouseEventHandler, ReactNode, useEffect, useState } from "react"

import { StyledTextVariant } from "@/components/StyledText/StyledText"
import { toast } from "@interchain-ui/react"
import {
    WButtonConnect,
    WButtonConnected,
    WButtonConnecting,
    WButtonDisconnected,
    WButtonError,
    WButtonNotExist,
    WButtonRejected,
} from "./Connect"
import { Toasts } from "@/components/Toasts"

export type WalletProps = {
    chainName?: string
    variant?: StyledTextVariant
    notifyConnectedCB: (isConnected: boolean) => void
}

export function Wallet({ chainName, notifyConnectedCB, variant }: WalletProps) {
    const [toasts, setToasts] = useState<
        {
            variant: "working" | "success" | "error" | "info"
            message: ReactNode
        }[]
    >([])

    const { connect, openView, status, address, message } = useChain(
        chainName || "neutron"
    )

    // Events
    const onClickConnect: MouseEventHandler = async (e) => {
        e.preventDefault()
        await connect()
    }

    const onClickOpenView: MouseEventHandler = (e) => {
        e.preventDefault()
        openView()
    }

    useEffect(() => {
        if (
            message &&
            [WalletStatus.Error, WalletStatus.Rejected].includes(status)
        ) {
            setToasts((prevToasts) => [
                ...prevToasts,
                {
                    variant: "error",
                    message: (
                        <>
                            <strong>Wallet Connection Error</strong>
                            <p>{message}</p>
                        </>
                    ),
                },
            ])
        } else {
            notifyConnectedCB?.(status === WalletStatus.Connected)
        }
    }, [message, status, toast, notifyConnectedCB])

    const ConnectButton = {
        [WalletStatus.Connected]: (
            <WButtonConnected
                address={address}
                variant={variant}
                onClick={onClickOpenView}
            />
        ),
        [WalletStatus.Connecting]: <WButtonConnecting variant={variant} />,
        [WalletStatus.Disconnected]: (
            <WButtonDisconnected variant={variant} onClick={onClickConnect} />
        ),
        [WalletStatus.Error]: (
            <WButtonError variant={variant} onClick={onClickOpenView} />
        ),
        [WalletStatus.Rejected]: (
            <WButtonRejected variant={variant} onClick={onClickConnect} />
        ),
        [WalletStatus.NotExist]: (
            <WButtonNotExist variant={variant} onClick={onClickOpenView} />
        ),
    }[status] || <WButtonConnect variant={variant} onClick={onClickConnect} />

    return (
        <>
            <Toasts>
                {toasts.map((toast, index) => (
                    <Toasts.Toast key={index} variant={toast.variant}>
                        {toast.message}
                    </Toasts.Toast>
                ))}
            </Toasts>
            {ConnectButton}
        </>
    )
}
