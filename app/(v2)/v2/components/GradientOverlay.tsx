import { twJoin } from 'tailwind-merge'

interface GradientOverlayProps {
  direction: 'left' | 'right' | 'down'
  className?: string
  previousThemeColor?: string
  nextThemeColor?: string
  currentThemeColor?: string
}

export function GradientOverlay({
  direction,
  className,
  previousThemeColor = 'var(--color-palette-blue)',
  nextThemeColor = 'var(--color-palette-blue)',
  currentThemeColor = 'var(--color-palette-blue)',
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

  const getGradientColors = () => {
    if (direction === 'down') {
      return `from-[${currentThemeColor}]/40 to-transparent`
    } else if (direction === 'left') {
      return `from-[${previousThemeColor}]/20 to-transparent`
    } else {
      return `from-[${nextThemeColor}]/20 to-transparent`
    }
  }

  return (
    <div
      className={twJoin(
        baseClasses,
        positionClasses,
        gradientDirection,
        getGradientColors(),
        className,
      )}
    />
  )
}
