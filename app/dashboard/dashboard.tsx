"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HorizontalDivider } from "../ui/HorizontalDivider"

import { DashboardTopModules } from "./TopModules"

export default function Dashboard({
    activeTab,
    children,
}: {
    activeTab: "tributes" | "lockups"
    children: React.ReactNode
}) {
    return (
        <div className="px-[90px] pb-[90px] max-w-[1440px] mx-auto">
            <DashboardTopModules />
            <div className="pt-[70px]">
                <Tabs value={activeTab || "lockups"}>
                    <TabsList className="bg-[#303132] p-0 h-12 rounded-xl text-white">
                        <TabsTrigger
                            asChild
                            value="tributes"
                            className="h-full rounded-xl w-32"
                        >
                            <a href="/dashboard/tributes">Earned Tribute</a>
                        </TabsTrigger>
                        <TabsTrigger
                            asChild
                            value="lockups"
                            className="h-full rounded-xl w-24"
                        >
                            <a href="/dashboard">Lockups</a>
                        </TabsTrigger>
                    </TabsList>
                    <HorizontalDivider style="mt-4 py-0" />
                    {children}
                </Tabs>
            </div>
        </div>
    )
}
