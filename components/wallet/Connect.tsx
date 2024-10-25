import { StyledText } from "@/components/StyledText"
import { StyledTextVariant } from "@/components/StyledText/StyledText"
import { LinkIcon, LoaderCircleIcon } from "lucide-react"
import { MouseEventHandler } from "react"

export type ButtonProps = {
    text?: string
    className?: string
    address?: string
    connected: boolean
    loading?: boolean
    disabled?: boolean
    variant?: StyledTextVariant
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
    connected,
    loading,
    disabled,
    variant = "button.neutral.small",
    onClick = noop,
}: ButtonProps) {
    return (
        <StyledText
            as="button"
            variant={variant}
            disabled={disabled}
            onClick={onClick}
        >
            {connected && <LinkIcon className="mr-2 h-4 w-4" />}
            {loading && (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{address ? address : text}</span>
        </StyledText>
    )
}

export const WButtonConnect = ({
    text = "Connect Wallet",
    variant,
    onClick = noop,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={text}
        connected={false}
        onClick={onClick}
        variant={variant}
    />
)

export const WButtonConnected = ({
    address,
    variant,
    onClick = noop,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={!!address && address.length > 0 ? `Connected` : "Connecting..."}
        connected={true}
        onClick={onClick}
        variant={variant}
    />
)

export const WButtonDisconnected = ({
    text = "Connect Wallet",
    variant,
    onClick = noop,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={text}
        connected={false}
        onClick={onClick}
        variant={variant}
    />
)

export const WButtonConnecting = ({
    text = "Connecting",
    loading = true,
    variant,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={text}
        connected={false}
        loading={loading}
        variant={variant}
    />
)

export const WButtonRejected = ({
    text = "Reconnect",
    variant,
    onClick = noop,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={text}
        connected={false}
        onClick={onClick}
        variant={variant}
    />
)

export const WButtonError = ({
    text = "Change",
    variant,
    onClick = noop,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={text}
        connected={false}
        onClick={onClick}
        variant={variant}
    />
)

export const WButtonNotExist = ({
    text = "Install Wallet",
    variant,
    onClick = noop,
}: ConnectProps & { variant?: StyledTextVariant }) => (
    <WButton
        text={text}
        connected={false}
        onClick={onClick}
        variant={variant}
    />
)
