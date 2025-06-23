'use client'

import { LoadingSpinner } from '@v2/components/LoadingSpinner'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { useEffect } from 'react'

export function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { state } = useAppState()
  const { isLoading } = state

  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100dvh'
      document.body.style.width = '100dvw'
    } else {
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
      document.body.style.width = 'auto'
    }

    return () => {
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
      document.body.style.width = 'auto'
    }
  }, [isLoading])

  return (
    <>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50">
          <LoadingSpinner />
        </div>
      )}
    </>
  )
}
