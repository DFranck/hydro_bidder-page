'use client'

import { useAppState } from '@/app/(v2)/v2/state/ClientDataProvider'
import { CollapsibleBox } from '@/components/CollapsibleBox'
import { useIsMobile } from '@/lib/useIsMobile'
import { twMerge } from 'tailwind-merge'

export function AppPageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const isMobile = useIsMobile({ valueOnServer: false })
  const { state } = useAppState()
  const { isSidebarOpen } = state

  return (
    <CollapsibleBox
      id="content-container"
      dontUnmountOnCollapse={true}
      isCollapsed={isMobile && isSidebarOpen}
      className="grid-in-content h-full overflow-hidden"
      classNamesForInnerWrapper={twMerge(
        'relative',
        'px-tight',
        'desktop:px-0',
        className,
      )}
    >
      {children}
    </CollapsibleBox>
  )
}
