'use client'

import { CollapsibleBox } from '@/components/CollapsibleBox'
import { useIsMobile } from '@/lib/useIsMobile'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export function AppPageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const isMobile = useIsMobile()
  const { state } = useAppState()
  const { isSidebarOpen } = state

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100dvh'
    document.body.style.width = '100dvw'

    return () => {
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
      document.body.style.width = 'auto'
    }
  })

  return (
    <CollapsibleBox
      id="content-container"
      dontUnmountOnCollapse={true}
      isCollapsed={isMobile && isSidebarOpen}
      className="grid-in-content h-full overflow-hidden"
      classNamesForInnerWrapper={twMerge('relative h-full', className)}
    >
      {children}
    </CollapsibleBox>
  )
}
