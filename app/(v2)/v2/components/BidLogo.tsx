import Image from 'next/image'
import { twJoin, twMerge } from 'tailwind-merge'

interface BidCardLogoProps {
  className?: string
  projectLogoUrl: string
  projectName?: string
  title?: string
}

export function BidLogo({
  className,
  projectLogoUrl,
  projectName,
  title,
}: BidCardLogoProps) {
  return (
    <div
      className={twMerge(
        'relative',
        'flex items-center justify-center',
        'bg-background overflow-hidden',
        'p-standard',
        className,
      )}
    >
      <div
        className={twJoin(
          'inset-tight absolute z-10',
          'flex items-center justify-center',
        )}
      >
        <Image
          src={projectLogoUrl}
          alt={projectName ?? title ?? '(Untitled)'}
          width={48}
          height={48}
        />
      </div>
      <div className={twJoin('absolute inset-0 z-0', 'opacity-50 blur-lg')}>
        <Image
          src={projectLogoUrl}
          alt="Decorative Shadow"
          sizes="5vw"
          fill={true}
          className="object-cover"
        />
      </div>
    </div>
  )
}
