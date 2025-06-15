'use client'

import { AppHeader } from '@v2/components/AppHeader'
import { Sidebar } from '@v2/components/Sidebar'
import { TrancheBrowser } from '@v2/components/TrancheBrowser'
import { useAppState } from '@v2/state/provider'
import { twJoin } from 'tailwind-merge'

export default function V2() {
  const { state } = useAppState()
  const { isSidebarOpen } = state

  return (
    <div
      className={twJoin(
        'relative h-screen w-screen',
        'bg-background gap-standard',
        '**:scrollbar-thumb-palette-beige',
        '**:scrollbar-track-background',
        '**:scrollbar-thin',
        'p-standard',
        'mobile:p-0',
        isSidebarOpen
          ? [
              'grid-areas-desktop-sidebar-open',
              'mobile:grid-areas-mobile-sidebar-open',
            ]
          : [
              'grid-areas-desktop-sidebar-closed',
              'mobile:grid-areas-mobile-sidebar-closed',
            ],
      )}
    >
      <AppHeader />

      <main className="contents">
        <Sidebar />
        <TrancheBrowser />
      </main>
    </div>
  )
}
