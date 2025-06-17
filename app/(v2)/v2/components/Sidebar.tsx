'use client'

import { Icon } from '@/components/Icon'
import { SidebarSourcePanel } from '@v2/components/SidebarSourcePanel'
import { type SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/provider'
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
      className={twJoin(
        'grid-in-sidebar',
        'rounded-standard flex flex-col',
        'sidebar-open:bg-shaded',
      )}
    >
      <div
        className={twJoin(
          'flex items-center',
          'px-3',
          'justify-center',
          'sidebar-open:justify-between',
          'sidebar-open:h-12',
        )}
      >
        <div className={twJoin('label', 'sidebar-closed:hidden')}>Lockups</div>

        <button
          className={twJoin(
            'btn-icon',
            'size-12',
            'fixed top-0 right-12 z-20',
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
          'px-tight',
          'sidebar-open:px-tight',
          'sidebar-open:flex-col',
          'desktop:flex-col',
          'desktop:px-0',
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
