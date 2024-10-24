"use client"

import { StyledText } from "@/components/StyledText"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface WelcomePopupProps {
    showModal?: boolean
}

export function WelcomePopup({ showModal = false }: WelcomePopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        // Only check localStorage and potentially show the modal if showModal is true
        if (showModal) {
            const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup")
            if (!hasSeenWelcome) {
                setIsOpen(true)
            }
        } else {
            setIsOpen(false)
        }
    }, [showModal])

    function closeModal() {
        setIsOpen(false)
        if (dontShowAgain) {
            localStorage.setItem("hasSeenWelcomePopup", "true")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Get started on Hydro</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <ol className="list-decimal space-y-2 pl-5">
                        <li>
                            Lock your staked ATOM to get voting power. The
                            longer you lock it, the more power you get. You
                            continue earning all of the Cosmos Hub staking
                            rewards.
                        </li>
                        <li>
                            Vote for a project. You can use your voting power to
                            vote for one project. You can change your vote as
                            many times as you want until the round ends.
                        </li>
                        <li>
                            Collect your rewards! When the round ends, a share
                            of the tributes posted by the winning projects are
                            distributed according to your voting power.
                        </li>
                    </ol>

                    <div className="flex items-center justify-start gap-3">
                        <StyledText
                            variant="button.primary"
                            as={Link}
                            href="/lock-atom"
                        >
                            Lock your ATOM to vote
                        </StyledText>
                        <StyledText
                            variant="button.secondary"
                            as="button"
                            onClick={closeModal}
                        >
                            Close
                        </StyledText>
                        <StyledText
                            className="flex items-center gap-1 whitespace-nowrap"
                            variant="link"
                            as="a"
                            href="/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Learn More</span> <ArrowUpRight />
                        </StyledText>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="dontShowAgain"
                            checked={dontShowAgain}
                            onCheckedChange={(checked: boolean) =>
                                setDontShowAgain(checked)
                            }
                        />
                        <StyledText
                            as="label"
                            htmlFor="dontShowAgain"
                            variant="label"
                        >
                            Don&rsquo;t show me this again
                        </StyledText>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
