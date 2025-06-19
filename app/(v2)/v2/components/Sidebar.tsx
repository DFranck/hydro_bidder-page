'use client'

import { Icon } from '@/components/Icon'
import { SidebarSourcePanel } from '@v2/components/SidebarSourcePanel'
import { type SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/ClientDataProvider'
import { useCallback, useEffect } from 'react'
import { twJoin } from 'tailwind-merge'

export function Sidebar() {
  const { state, dispatch } = useAppState()
  const { currentRoundDataPerSource, isSidebarOpen } = state
  const allSources = Object.values(currentRoundDataPerSource ?? {})

  const setSidebarIsOpen = useCallback(
    (isOpen: boolean) => {
      document.documentElement.classList.toggle('sidebar-open', isOpen)
      document.documentElement.classList.toggle('sidebar-closed', !isOpen)
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: isOpen })
    },
    [dispatch],
  )

  useEffect(() => {
    const isSidebarOpen =
      document.documentElement.classList.contains('sidebar-open')
    setSidebarIsOpen(isSidebarOpen)
  }, [setSidebarIsOpen])

  return (
    <aside
      className={twJoin('grid-in-sidebar', 'rounded-standard flex flex-col')}
    >
      <div
        className={twJoin(
          'flex items-center',
          'justify-center',
          'sidebar-open:px-tight',
          'sidebar-open:justify-between',
          'sidebar-open:h-bar-height-standard',
        )}
      >
        <div className={twJoin('label', 'sidebar-closed:hidden')}>Lockups</div>

        <button
          className={twJoin(
            'btn-icon',
            'size-bar-height-standard',
            'top-tight fixed z-20',
            'right-[calc(var(--spacing)*12+var(--spacing-tight))]',
            'desktop:static',
            'desktop:size-auto',
          )}
          onClick={() => setSidebarIsOpen(!isSidebarOpen)}
        >
          <Icon name="solid:sidebar" />
        </button>
      </div>

      <div
        className={twJoin(
          'gap-tight flex',
          'sidebar-open:flex-col',
          'desktop:flex-col',
        )}
      >
        {allSources.map(({ totalLockedTokens, sourceId, currentRoundId }) => (
          <SidebarSourcePanel
            key={sourceId}
            sourceId={sourceId as SourceID}
            totalLockedTokens={totalLockedTokens}
            currentRoundId={currentRoundId}
          />
        ))}
      </div>
    </aside>
  )
}
