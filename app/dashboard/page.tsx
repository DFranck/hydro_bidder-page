import { Suspense } from "react"
import LockupsTable from "./lockupsTable"
import { DashboardTopModules } from "./TopModules"

export default async function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="max-w-7xl mx-auto">
                <DashboardTopModules />
                <div className="pt-10 pb-44">
                    <LockupsTable />
                </div>
            </div>
        </Suspense>
    )
}
