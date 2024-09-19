"use client"
import { MouseEventHandler, useEffect } from "react"
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"

import {
    WButtonConnect,
    WButtonConnected,
    WButtonConnecting,
    WButtonDisconnected,
    WButtonError,
    WButtonNotExist,
    WButtonRejected,
} from "./Connect"
import { useToast } from "../ui/use-toast"

export type WalletProps = {
    chainName?: string
    notifyConnectedCB: (isConnected: boolean) => void
}

export function Wallet({ chainName, notifyConnectedCB }: WalletProps) {
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
            <WButtonConnected address={address} onClick={onClickOpenView} />
        ),
        [WalletStatus.Connecting]: <WButtonConnecting />,
        [WalletStatus.Disconnected]: (
            <WButtonDisconnected onClick={onClickConnect} />
        ),
        [WalletStatus.Error]: <WButtonError onClick={onClickOpenView} />,
        [WalletStatus.Rejected]: <WButtonRejected onClick={onClickConnect} />,
        [WalletStatus.NotExist]: <WButtonNotExist onClick={onClickOpenView} />,
    }[status] || <WButtonConnect onClick={onClickConnect} />

    return <>{ConnectButton}</>
}
