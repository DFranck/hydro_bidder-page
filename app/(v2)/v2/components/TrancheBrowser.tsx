'use client'

import { AppPageContainer } from '@v2/components/AppPageContainer'
import { RoundStatsBar } from '@v2/components/RoundStatsBar'
import { TrancheTabbedCarousel } from '@v2/components/TrancheTabbedCarousel'
import { useTrancheStateManagement } from '@v2/hooks/useTrancheStateManagement'

export function TrancheBrowser() {
  const { handleActiveTrancheChange } = useTrancheStateManagement()

  return (
    <AppPageContainer className="gap-tight grid grid-rows-[min-content_auto]">
      <RoundStatsBar />

      <div className="h-full overflow-hidden">
        <TrancheTabbedCarousel
          containerId="tranche-browser-container"
          targetSelector="[data-carousel-section='tranche']"
          threshold={0.8}
          enableDefaultTrancheRendering={true}
          onActiveIndexChange={handleActiveTrancheChange}
        />
      </div>
    </AppPageContainer>
  )
}
