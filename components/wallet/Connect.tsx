import { cn } from "@/lib/utils"
import { LinkIcon, LoaderCircleIcon } from "lucide-react"
import { MouseEventHandler } from "react"
import { Button } from "../ui/button"

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
                "text-md inline-flex items-center bg-palette-blue text-white hover:bg-palette-blue/80",
                className
            )}
        >
            {connected && <LinkIcon className="mr-2 h-4 w-4" />}
            {loading && (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
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
        text={!!address && address.length > 0 ? `Connected` : "Connecting..."}
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
