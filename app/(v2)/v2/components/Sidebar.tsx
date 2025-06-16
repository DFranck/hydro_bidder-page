'use client'

import { Icon } from '@/components/Icon'
import { SidebarSourcePanel } from '@v2/components/SidebarSourcePanel'
import { type SourceID } from '@v2/environments'
import { useAppState } from '@v2/state/provider'
import { useEffect } from 'react'
import { twJoin } from 'tailwind-merge'
import { useMediaQuery } from 'usehooks-ts'

type SidebarState =
  | 'mobile-open'
  | 'mobile-closed'
  | 'desktop-open'
  | 'desktop-closed'

function getSidebarState(isMobile: boolean, isOpen: boolean): SidebarState {
  if (isMobile) return isOpen ? 'mobile-open' : 'mobile-closed'
  return isOpen ? 'desktop-open' : 'desktop-closed'
}

export function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { state, dispatch } = useAppState()
  const { currentRoundDataPerSource, isSidebarOpen } = state
  const allSources = Object.values(currentRoundDataPerSource ?? {})
  const sidebarState = getSidebarState(isMobile, isSidebarOpen)
  const isDesktop = sidebarState.startsWith('desktop')
  const isOpen = sidebarState.endsWith('open')
  const isClosed = sidebarState.endsWith('closed')

  useEffect(() => {
    const initialIsOpen = !isMobile
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: initialIsOpen })
  }, [])

  return (
    <aside
      className={twJoin(
        'grid-in-sidebar',
        'rounded-standard flex flex-col',
        !isClosed && 'bg-shaded',
      )}
      onClick={() =>
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: !isSidebarOpen })
      }
    >
      <div
        className={twJoin(
          'flex items-center',
          'px-3',
          isClosed ? 'justify-center' : 'justify-between',
          isMobile && isClosed ? 'h-0' : 'h-12',
        )}
        onClick={() =>
          dispatch({
            type: 'SET_SIDEBAR_OPEN',
            payload: !isSidebarOpen,
          })
        }
      >
        <div className={twJoin('label', isClosed && 'hidden')}>Lockups</div>

        <button
          className={twJoin(
            'btn-icon',
            isMobile && ['size-12', 'fixed top-0 right-12 z-20'],
          )}
        >
          <Icon
            name={
              isMobile
                ? isOpen
                  ? 'solid:arrow-up-to-line'
                  : 'solid:arrow-down-to-line'
                : 'solid:sidebar'
            }
            className="inline-block"
          />
        </button>
      </div>

      <div
        className={twJoin(
          'gap-standard flex',
          (isOpen || isMobile) && 'px-standard',
          ((isMobile && !isClosed) || isDesktop) && 'flex-col',
        )}
      >
        {allSources.map(({ totalLockedTokens, sourceId, currentRoundId }) => (
          <SidebarSourcePanel
            key={sourceId}
            sourceId={sourceId as SourceID}
            totalLockedTokens={totalLockedTokens}
            currentRoundId={currentRoundId}
            sidebarState={sidebarState}
          />
        ))}
      </div>
    </aside>
  )
}
