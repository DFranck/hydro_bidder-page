import Image from 'next/image'
import { twJoin } from 'tailwind-merge'

interface BidCardLogoProps {
  projectLogoUrl: string
  projectName?: string
  title?: string
}

export function BidCardLogo({
  projectLogoUrl,
  projectName,
  title,
}: BidCardLogoProps) {
  return (
    <div
      className={twJoin(
        'relative',
        'flex items-center justify-center',
        'bg-background overflow-hidden',
        'rounded-[calc(var(--radius-standard)-var(--spacing-tightest))]',
        'p-standard',
      )}
    >
      <div className="relative z-10 size-10">
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
