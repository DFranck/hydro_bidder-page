import { twJoin } from 'tailwind-merge'

interface GradientOverlayProps {
  direction: 'left' | 'right' | 'down'
  className?: string
}

export function GradientOverlay({
  direction,
  className,
}: GradientOverlayProps) {
  const baseClasses = ['pointer-events-none', 'absolute inset-y-0 z-0']

  const positionClasses =
    direction === 'down'
      ? 'inset-x-0 h-1/2 w-full'
      : ['w-1/2', direction === 'left' ? 'left-0' : 'right-0']

  const gradientDirection =
    direction === 'down'
      ? 'bg-gradient-to-b'
      : direction === 'left'
        ? 'bg-gradient-to-r'
        : 'bg-gradient-to-l'

  const gradientColors =
    direction === 'down'
      ? 'from-token-color/40 to-transparent'
      : direction === 'left'
        ? 'from-token-color-to-left/20 to-transparent'
        : 'from-token-color-to-right/20 to-transparent'

  return (
    <div
      className={twJoin(
        baseClasses,
        positionClasses,
        gradientDirection,
        gradientColors,
        className,
      )}
    />
  )
}
