"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useEffect, useState } from "react"

interface WelcomePopupProps {
    showModal?: boolean
}

export function WelcomePopup({ showModal = true }: WelcomePopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        // Only check localStorage and potentially show the modal if showModal is true
        if (true || showModal) {
            const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup")
            if (!hasSeenWelcome) {
                setIsOpen(true)
            }
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
                <CardContent>
                    <ol className="list-decimal space-y-2 p-5">
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

                    <div className="mt-4 flex justify-start space-x-2">
                        <Link href="/lock-atom">
                            <Button>Lock your ATOM to vote</Button>
                        </Link>
                        <Button onClick={closeModal} variant="outline">
                            Close
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center">
                        <Checkbox
                            id="dontShowAgain"
                            checked={dontShowAgain}
                            onCheckedChange={(checked: boolean) =>
                                setDontShowAgain(checked)
                            }
                        />
                        <label
                            htmlFor="dontShowAgain"
                            className="ml-2 block text-sm text-white"
                        >
                            {"Don't show me this again"}
                        </label>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
