import { SourceID } from '@v2/environments'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

export function SourceBadge({
  sourceId,
  className,
  ...otherProps
}: React.ComponentProps<'div'> & { sourceId: SourceID }) {
  return (
    <span
      className={twMerge(
        'relative size-6',
        'flex items-center justify-center',
        'shrink-0',
        className,
      )}
      {...otherProps}
    >
      <span className="absolute inset-0">
        <Image
          src={`/images/token-logo-${sourceId}-white.svg`}
          alt={sourceId}
          fill={true}
          sizes="10vw"
        />
      </span>
    </span>
  )
}
