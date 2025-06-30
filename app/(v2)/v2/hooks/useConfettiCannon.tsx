'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { createRoot } from 'react-dom/client'
import { useIsClient } from 'usehooks-ts'

interface UseConfettiCannonOptions {
  onComplete?: () => void
  colors?: string[]
  numberOfPieces?: number
  gravity?: number
  initialVelocityY?: {
    min: number
    max: number
  }
  initialVelocityX?: number
}

interface ConfettiBlast {
  id: number
  timestamp: number
}

export function useConfettiCannon({
  onComplete,
  colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'],
  numberOfPieces = 500,
  gravity = 0.05,
  initialVelocityY = {
    min: -10,
    max: 10,
  },
  initialVelocityX = 10,
}: UseConfettiCannonOptions = {}) {
  const isClient = useIsClient()
  const [blasts, setBlasts] = useState<ConfettiBlast[]>([])
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const nextIdRef = useRef(0)

  useEffect(() => {
    if (!isClient) return

    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.inset = '0'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '9999'
    document.body.appendChild(container)
    containerRef.current = container

    rootRef.current = createRoot(container)

    return () => {
      rootRef.current?.unmount()
      document.body.removeChild(container)
    }
  }, [isClient])

  const blastConfetti = useCallback(() => {
    const id = nextIdRef.current++
    setBlasts((prev) => [...prev, { id, timestamp: Date.now() }])
  }, [])

  const handleComplete = useCallback(
    (blastId: number) => {
      setBlasts((prev) => prev.filter((blast) => blast.id !== blastId))
      onComplete?.()
    },
    [onComplete],
  )

  useEffect(() => {
    if (!rootRef.current) return

    const confettiElements = (
      <>
        {blasts.map((blast) => (
          <ReactConfetti
            key={blast.id}
            width={window.innerWidth}
            height={window.innerHeight}
            colors={colors}
            initialVelocityY={initialVelocityY}
            initialVelocityX={initialVelocityX}
            gravity={gravity}
            recycle={false}
            run={true}
            numberOfPieces={numberOfPieces}
            onConfettiComplete={(confetti) => {
              confetti?.reset()
              handleComplete(blast.id)
            }}
          />
        ))}
      </>
    )

    rootRef.current.render(confettiElements)
  }, [
    blasts,
    colors,
    gravity,
    initialVelocityY,
    initialVelocityX,
    numberOfPieces,
    handleComplete,
  ])

  return {
    blastConfetti,
    activeBlasts: blasts.length,
  }
}
