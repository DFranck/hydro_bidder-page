'use client'

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
  return (
    <div
      className={twMerge(
        'bg-background absolute inset-0 z-50',
        'flex items-center justify-center',
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
