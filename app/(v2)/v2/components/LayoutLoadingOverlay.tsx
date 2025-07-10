'use client'

import { LoadingScreen } from '@v2/components/LoadingScreen'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useEffect } from 'react'

export function LayoutLoadingOverlay() {
  const { state } = useAppState()
  const { isLoading } = state

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
  }, [])

  if (!isLoading) return null

  return <LoadingScreen />
}
