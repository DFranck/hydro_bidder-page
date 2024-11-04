import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import ConfettiType from "react-confetti/dist/types/Confetti"

export function Confetti({
  trigger,
  onComplete,
}: {
  trigger: boolean
  onComplete?: (confetti?: ConfettiType) => void
}) {
  const [isCelebrating, setIsCelebrating] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsCelebrating(true)
    }
  }, [trigger])

  return (
    <ReactConfetti
      className="fixed inset-3 z-[100]"
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
    />
  )
}
