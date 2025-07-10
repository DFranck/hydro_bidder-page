import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

// Carousel Components
interface CarouselContainerProps {
  children: ReactNode
  className?: string
  id?: string
  ref?: React.RefObject<HTMLDivElement | null>
}

export function CarouselContainer({
  children,
  className,
  id,
  ref,
}: CarouselContainerProps) {
  return (
    <div
      ref={ref}
      id={id}
      className={twMerge(
        'relative h-full',
        'snap-x snap-proximity',
        'flex overflow-x-auto',
        'overflow-y-hidden',
        'scroll-smooth',
        className,
      )}
      style={{ scrollBehavior: 'smooth' }}
    >
      {children}
    </div>
  )
}

interface CarouselSectionProps {
  children: ReactNode
  className?: string
  id?: string
  [key: string]: any // Allow additional props like data attributes
}

export function CarouselSection({
  children,
  className,
  id,
  ...otherProps
}: CarouselSectionProps) {
  return (
    <div
      id={id}
      className={twMerge(
        'w-full flex-shrink-0',
        'snap-start',
        'overflow-y-auto',
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  )
}

interface CarouselNavigationButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  id?: string
}

export function CarouselNavigationButton({
  children,
  className,
  onClick,
  disabled,
  id,
}: CarouselNavigationButtonProps) {
  return (
    <button
      id={id}
      className={twMerge(
        'cursor-pointer',
        'h-bar-height-standard',
        'px-standard w-min shrink-0',
        '@4xs:w-12',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Modal Components
interface ModalFullScreenOverlayProps {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function ModalFullScreenOverlay({
  children,
  className,
  onClick,
}: ModalFullScreenOverlayProps) {
  return (
    <div
      className={twMerge(
        'bg-background/95',
        'fixed inset-0 z-50',
        'backdrop-blur-sm',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface ModalMobileHeaderProps {
  children: ReactNode
  className?: string
}

export function ModalMobileHeader({
  children,
  className,
}: ModalMobileHeaderProps) {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between',
        'px-loose py-tight',
        'bg-theme-color/10',
        'desktop:hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
