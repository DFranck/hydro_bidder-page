"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import ConfettiType from "react-confetti/dist/types/Confetti"
import { createPortal } from "react-dom"
import { useIsClient } from "usehooks-ts"

export function Confetti({
  trigger,
  onComplete,
}: {
  trigger: boolean
  onComplete?: (confetti?: ConfettiType) => void
}) {
  const isClient = useIsClient()
  const [isCelebrating, setIsCelebrating] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsCelebrating(true)
    }
  }, [trigger])

  return !isClient
    ? null
    : createPortal(
        <ReactConfetti
          className="fixed inset-3 z-50"
          colors={[
            "#FFE1B8", // beige
            "#00D1FF", // cyan
            "#0061FF", // blue
            "#00FFC2", // green
            // "#FF7B51", // red
          ]}
          initialVelocityY={{
            min: -10,
            max: 10,
          }}
          initialVelocityX={10}
          gravity={0.05}
          recycle={false}
          run={isCelebrating}
          numberOfPieces={500}
          onConfettiComplete={(confetti) => {
            setIsCelebrating(false)
            confetti?.reset()
            onComplete?.(confetti)
          }}
        />,
        document.body
      )
}
