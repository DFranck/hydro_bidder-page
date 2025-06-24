'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const WAVE_CYCLE_DURATION = 2000
const WAVE_DURATION = 1000
const WAVE_COUNT = 12
const MIN_HEIGHT = 8 // 0.5rem in pixels (8px)
const MAX_HEIGHT = 64 // 4rem in pixels (64px)

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
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: WAVE_COUNT }, () => MIN_HEIGHT),
  )
  const heightHistoryRef = useRef<number[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number>(0)

  const updateBarHeights = useCallback(() => {
    const now = Date.now()
    if (startTimeRef.current === 0) {
      startTimeRef.current = now
    }

    const elapsed = now - startTimeRef.current
    const progress = (elapsed % waveDuration) / waveDuration

    // Calculate the current height based on the wave function
    const currentHeight =
      MIN_HEIGHT +
      (Math.sin(progress * Math.PI * 2) * 0.5 + 0.5) * (MAX_HEIGHT - MIN_HEIGHT)

    // Store the current height in history
    heightHistoryRef.current.push(currentHeight)

    // Keep only the history we need (enough for all bars with delays)
    const maxHistoryLength = Math.ceil(WAVE_COUNT * 2) // Extra buffer
    if (heightHistoryRef.current.length > maxHistoryLength) {
      heightHistoryRef.current =
        heightHistoryRef.current.slice(-maxHistoryLength)
    }

    const newHeights = Array.from({ length: WAVE_COUNT }, () => 0)

    // Calculate delay for each bar (in frames, roughly 60fps)
    const framesPerBar = Math.max(
      1,
      Math.floor(heightHistoryRef.current.length / WAVE_COUNT),
    )

    for (let i = 0; i < WAVE_COUNT; i++) {
      const delayFrames = i * framesPerBar
      const historyIndex = Math.max(
        0,
        heightHistoryRef.current.length - 1 - delayFrames,
      )
      newHeights[i] = heightHistoryRef.current[historyIndex] || MIN_HEIGHT
    }

    setBarHeights(newHeights)
    animationFrameRef.current = requestAnimationFrame(updateBarHeights)
  }, [waveDuration])

  useEffect(() => {
    if (useGlobalState) {
      globalLoadingCount++
      globalLoadingStartTime = globalLoadingStartTime || Date.now()

      setLoadingCount(globalLoadingCount)
      setIsVisible(true)

      return () => {
        globalLoadingCount = Math.max(0, globalLoadingCount - 1)
        setLoadingCount(globalLoadingCount)

        if (globalLoadingCount === 0) {
          setIsVisible(false)
          globalLoadingStartTime = 0
        }
      }
    } else {
      setIsVisible(true)
    }
  }, [useGlobalState])

  useEffect(() => {
    if (isVisible) {
      startTimeRef.current = 0
      heightHistoryRef.current = []
      updateBarHeights()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isVisible, updateBarHeights])

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
              'transition-all duration-75',
              color,
            )}
            style={{
              height: `${barHeights[index]}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
