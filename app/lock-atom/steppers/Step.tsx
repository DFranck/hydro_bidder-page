import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader } from "lucide-react"
import { ReactNode } from "react"

export function Step({
    title,
    contents,
    buttons,
    isWorking,
}: {
    title?: ReactNode
    contents: ReactNode
    buttons?: {
        label: ReactNode
        onClick?: () => void
        className?: string
    }[]
    isWorking?: boolean
}) {
    return (
        <Card className="mx-auto max-w-screen-sm border-2 border-palette-green bg-palette-text">
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}

            <CardContent className="flex flex-col gap-3 py-6">
                <ConditionalWrapper
                    condition={!!isWorking}
                    wrapper={(children) => (
                        <div className="flex gap-6 *:shrink-0">
                            <div>
                                <Loader className="animate-spin" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {children}
                            </div>
                        </div>
                    )}
                >
                    {contents}
                </ConditionalWrapper>
            </CardContent>

            {buttons && (
                <CardFooter className="flex flex-row-reverse gap-2">
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            onClick={button.onClick}
                            className={button.className}
                            variant={index === 0 ? "primary" : "secondary"}
                        >
                            {button.label}
                        </Button>
                    ))}
                </CardFooter>
            )}
        </Card>
    )
}
