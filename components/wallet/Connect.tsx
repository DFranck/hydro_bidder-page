import { MouseEventHandler } from "react"
import { Button } from "../ui/button"
import { LinkIcon, LoaderCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
// import { Button as UIButton, IconName } from "@interchain-ui/react";

export type ButtonProps = {
    text?: string
    className?: string
    address?: string
    connected: boolean
    loading?: boolean
    disabled?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export type ConnectProps = Pick<
    ButtonProps,
    "text" | "loading" | "address" | "className" | "onClick"
>

function noop() {}

export function WButton({
    text,
    address,
    className,
    connected,
    loading,
    disabled,
    onClick = noop,
}: ButtonProps) {
    return (
        <Button
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "text-md bg-[#303132] w-40 text-white inline-flex items-center",
                className
            )}
        >
            {connected && <LinkIcon className="w-4 h-4 mr-2" />}
            {loading && (
                <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
            )}
            {address ? address : text}
        </Button>
    )
}

export const WButtonConnect = ({
    text = "Connect Wallet",
    onClick = noop,
}: ConnectProps) => <WButton text={text} connected={false} onClick={onClick} />

export const WButtonConnected = ({ address, onClick = noop }: ConnectProps) => (
    <WButton
        text={
            !!address && address.length > 0
                ? `${address?.slice(0, 6)}...${address?.slice(
                      address.length - 7,
                      address.length - 1
                  )}`
                : "Connecting..."
        }
        className="text-xs dark:text-white"
        connected={true}
        onClick={onClick}
    />
)

export const WButtonDisconnected = ({
    text = "Connect Wallet",
    onClick = noop,
}: ConnectProps) => <WButton text={text} connected={false} onClick={onClick} />

export const WButtonConnecting = ({
    text = "Connecting",
    loading = true,
}: ConnectProps) => <WButton text={text} connected={false} loading={loading} />

export const WButtonRejected = ({
    text = "Reconnect",
    onClick = noop,
}: ConnectProps) => <WButton text={text} connected={false} onClick={onClick} />

export const WButtonError = ({
    text = "Change",
    onClick = noop,
}: ConnectProps) => <WButton text={text} connected={false} onClick={onClick} />

export const WButtonNotExist = ({
    text = "Install Wallet",
    onClick = noop,
}: ConnectProps) => <WButton text={text} connected={false} onClick={onClick} />
