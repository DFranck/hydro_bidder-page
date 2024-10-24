"use client"

import { HorizontalDivider } from "@/components/HorizontalDivider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DashboardTopModules } from "./TopModules"

export default function DashboardWithTabs({
    activeTab,
    children,
}: {
    activeTab: "tributes" | "lockups"
    children: React.ReactNode
}) {
    return (
        <div className="mx-auto max-w-[1440px] px-[90px] pb-[90px]">
            <DashboardTopModules />
            <div className="pt-[70px]">
                <Tabs value={activeTab || "lockups"}>
                    <TabsList className="h-12 rounded-xl bg-[#303132] p-0 text-white">
                        <TabsTrigger
                            asChild
                            value="tributes"
                            className="h-full w-32 rounded-xl"
                        >
                            <a href="/lockups/tributes">Earned Tribute</a>
                        </TabsTrigger>
                        <TabsTrigger
                            asChild
                            value="lockups"
                            className="h-full w-24 rounded-xl"
                        >
                            <a href="/lockups">Lockups</a>
                        </TabsTrigger>
                    </TabsList>
                    <HorizontalDivider className="mt-4 py-0" />
                    {children}
                </Tabs>
            </div>
        </div>
    )
}
