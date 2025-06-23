'use client'

import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

// Fixed animation timing - waves cycle every 2 seconds
const WAVE_CYCLE_DURATION = 2000 // 2 seconds for full cycle
const WAVE_DURATION = 1000 // 1 second for up/down
const WAVE_COUNT = 12

// Global reference time for consistent animation across all spinners
let globalAnimationStartTime = Date.now()

// Global loading state management
let globalLoadingCount = 0
let globalLoadingStartTime = 0

type LoadingSpinnerProps = {
  className?: string
  color?: string
  waveDuration?: number
  isFullscreen?: boolean
  useGlobalState?: boolean
}

export function LoadingSpinner({
  className,
  color = 'bg-palette-blue',
  waveDuration = WAVE_DURATION,
  isFullscreen = false,
  useGlobalState = false,
}: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [loadingCount, setLoadingCount] = useState(0)

  useEffect(() => {
    if (useGlobalState) {
      // Increment global loading count
      globalLoadingCount++
      globalLoadingStartTime = globalLoadingStartTime || Date.now()

      setLoadingCount(globalLoadingCount)
      setIsVisible(true)

      return () => {
        // Decrement global loading count
        globalLoadingCount = Math.max(0, globalLoadingCount - 1)
        setLoadingCount(globalLoadingCount)

        if (globalLoadingCount === 0) {
          setIsVisible(false)
          globalLoadingStartTime = 0
        }
      }
    } else {
      // Simple visibility for individual components
      setIsVisible(true)
    }
  }, [useGlobalState])

  // Calculate animation delay based on fixed global time
  const getAnimationDelay = (index: number) => {
    const elapsed = Date.now() - globalAnimationStartTime
    const cycleProgress = (elapsed % WAVE_CYCLE_DURATION) / WAVE_CYCLE_DURATION

    // Each wave has a base delay of (index * waveDuration) / totalWaves
    const baseDelay = (index * waveDuration) / WAVE_COUNT

    // Adjust the delay based on the current cycle progress
    // This ensures all spinners show the same wave state
    const adjustedDelay = baseDelay - cycleProgress * waveDuration

    return Math.max(0, adjustedDelay)
  }

  // Don't render if using global state and no loading is active
  if (useGlobalState && !isVisible) return null

  return (
    <div
      className={twMerge(
        isFullscreen
          ? 'bg-background fixed inset-0 z-50'
          : 'absolute inset-0 z-50',
        'flex items-center justify-center',
        'transition-opacity duration-300 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <div className="flex h-16 items-end gap-1">
        {Array.from({ length: WAVE_COUNT }).map((_, index) => (
          <div
            key={index}
            className={twMerge(
              'w-4 rounded-full',
              'transition-all duration-300',
              color,
            )}
            style={{
              animation: `wave ${waveDuration}ms ease-in-out infinite alternate`,
              animationDelay: `${getAnimationDelay(index)}ms`,
              animationPlayState: 'running',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes wave {
          0% {
            height: 0.5rem;
          }
          100% {
            height: 4rem;
          }
        }
      `}</style>
    </div>
  )
}
