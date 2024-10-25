"use client"
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { MouseEventHandler, useEffect } from "react"

import { StyledTextVariant } from "@/components/StyledText/StyledText"
import { useToast } from "../ui/use-toast"
import {
    WButtonConnect,
    WButtonConnected,
    WButtonConnecting,
    WButtonDisconnected,
    WButtonError,
    WButtonNotExist,
    WButtonRejected,
} from "./Connect"

export type WalletProps = {
    chainName?: string
    variant?: StyledTextVariant
    notifyConnectedCB: (isConnected: boolean) => void
}

export function Wallet({ chainName, notifyConnectedCB, variant }: WalletProps) {
    const { connect, openView, status, address, message } = useChain(
        chainName || "neutron"
    )

    const { toast } = useToast()

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
            toast({
                title: "Wallet Connection Error",
                description: message,
                variant: "destructive",
            })
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

    return <>{ConnectButton}</>
}
