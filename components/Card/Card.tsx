import { StyledText } from "@/components/StyledText"
import { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface CardProps extends ComponentProps<"div"> {}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export function Card({ children, className, ...otherProps }: CardProps) {
    return (
        <div
            className={twMerge(
                `
                    rounded-xl
                    bg-slate-700/70
                    p-6
                    backdrop-blur-md
                `,
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    )
}

interface CardHeaderProps extends Omit<CardProps, "title"> {
    title?: ReactNode
}

function CardHeader({
    title,
    children,
    className,
    ...otherProps
}: CardHeaderProps) {
    return (
        <div
            className={twMerge(
                `
                    pb-6
                `,
                className
            )}
            {...otherProps}
        >
            {(title || (!title && children)) && (
                <StyledText as="h2" variant="h3">
                    {title ?? children}
                </StyledText>
            )}
            {title && children ? children : null}
        </div>
    )
}

function CardBody({ children, className, ...otherProps }: CardProps) {
    return (
        <div
            className={twMerge(
                `
                    flex
                    flex-col
                    gap-3
                `,
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    )
}

function CardFooter({ children, className, ...otherProps }: CardProps) {
    return (
        <div
            className={twMerge(
                `
                    flex
                    flex-row-reverse
                    gap-3
                    pt-6
                `,
                className
            )}
            {...otherProps}
        >
            {children}
        </div>
    )
}
