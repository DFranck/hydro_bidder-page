'use client'

import { CollapsibleBox } from '@/components/CollapsibleBox'
import { useIsMobile } from '@/lib/useIsMobile'
import { LoadingSpinner } from '@v2/components/LoadingSpinner'
import { useAppState } from '@v2/state/DataProviderOnClient'
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
  const { isSidebarOpen, isLoading } = state

  return (
    <CollapsibleBox
      id="content-container"
      dontUnmountOnCollapse={true}
      isCollapsed={isMobile && isSidebarOpen}
      className="grid-in-content h-full overflow-hidden"
      classNamesForInnerWrapper={twMerge('relative', className)}
    >
      {children}
      {isLoading && <LoadingSpinner />}
    </CollapsibleBox>
  )
}
