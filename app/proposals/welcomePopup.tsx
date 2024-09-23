"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

export function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [dontShowAgain, setDontShowAgain] = useState(false)

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcomePopup")
        if (!hasSeenWelcome) {
            setIsOpen(true)
        }
    }, [])

    function closeModal() {
        setIsOpen(false)
        if (dontShowAgain) {
            localStorage.setItem("hasSeenWelcomePopup", "true")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Get started on Hydro</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            Lock your ATOM to get voting power. The longer you
                            lock it, the more power you get. Locked ATOM
                            continues earning staking rewards on the Cosmos Hub
                            as well!
                        </li>
                        <li>
                            Vote for a proposal. You can use your voting power
                            to vote for one proposal per tranche. There are
                            multiple tranches, so make sure you look at them
                            all.
                        </li>
                        <li>
                            Collect your reward! When the round ends, 5
                            proposals from each tranche will win. If you voted
                            for one of the winning proposals you be rewarded
                            according to your voting power.
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
                            Don't show me this again
                        </label>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
