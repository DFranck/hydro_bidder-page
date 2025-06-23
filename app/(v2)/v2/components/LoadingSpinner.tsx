'use client'

import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type LoadingSpinnerProps = {
  className?: string
  color?: string
  waveDuration?: number
}

export function LoadingSpinner({
  className,
  color = 'bg-palette-blue',
  waveDuration = 500,
}: LoadingSpinnerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={twMerge(
        'absolute inset-0 z-50',
        'flex items-center justify-center',
        'transition-opacity duration-300 ease-in-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      <div className="flex h-16 items-end gap-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={twMerge(
              'w-4 rounded-full',
              'transition-all duration-300',
              color,
            )}
            style={{
              animation: `wave ${waveDuration}ms ease-in-out infinite alternate`,
              animationDelay: `${(index * waveDuration) / 12}ms`,
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
