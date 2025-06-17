import { SourceBadge } from '@v2/components/SourceBadge'
import { SourceID, getEnvironment, getSource } from '@v2/environments'
import { twMerge } from 'tailwind-merge'

interface SourceLabelProps extends React.ComponentProps<'span'> {
  sourceId: SourceID
  isShortened?: boolean
}

export function SourceLabel({
  sourceId,
  isShortened = false,
  className,
}: SourceLabelProps) {
  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const displayName = isShortened ? source.label.split(' ')[0] : source.label

  return (
    <span className={twMerge('flex items-center gap-2', className)}>
      <SourceBadge sourceId={sourceId} />
      <span className="label">{displayName}</span>
    </span>
  )
}
