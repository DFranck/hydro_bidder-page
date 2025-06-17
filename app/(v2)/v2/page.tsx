'use client'

import { AppHeader } from '@v2/components/AppHeader'
import { Sidebar } from '@v2/components/Sidebar'
import { TrancheBrowser } from '@v2/components/TrancheBrowser'
import { twJoin } from 'tailwind-merge'

export default function V2() {
  return (
    <div
      className={twJoin(
        'relative h-screen w-screen',
        'bg-background gap-tight',
        'p-0',
        'desktop:p-tight',
        'sidebar-open:grid-areas-mobile-sidebar-open',
        'sidebar-closed:grid-areas-mobile-sidebar-closed',
        'desktop:sidebar-open:grid-areas-desktop-sidebar-open',
        'desktop:sidebar-closed:grid-areas-desktop-sidebar-closed',
        '**:scrollbar-thumb-palette-beige',
        '**:scrollbar-track-background',
        '**:scrollbar-thin',
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
