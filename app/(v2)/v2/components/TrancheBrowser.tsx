'use client'

import { AppPageContainer } from '@v2/components/AppPageContainer'
import { RoundStatsBar } from '@v2/components/RoundStatsBar'
import { TrancheCarousel } from '@v2/components/TrancheCarousel'
import { useTrancheStateManagement } from '@v2/hooks/useTrancheStateManagement'
import { useRef } from 'react'

export function TrancheBrowser() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { handleActiveTrancheChange } = useTrancheStateManagement()

  return (
    <AppPageContainer className="gap-tight grid grid-rows-[min-content_auto]">
      <RoundStatsBar />

      <div ref={containerRef} className="h-full overflow-hidden">
        <TrancheCarousel
          containerId="tranche-browser-container"
          onActiveTrancheChange={handleActiveTrancheChange}
        />
      </div>
    </AppPageContainer>
  )
}