import { SourceBadge } from '@v2/components/SourceBadge'
import { SourceID, getEnvironment, getSource } from '@v2/environments'

interface SourceLabelProps {
  sourceId: SourceID
  isShortened?: boolean
}

export function SourceLabel({
  sourceId,
  isShortened = false,
}: SourceLabelProps) {
  const environment = getEnvironment()
  const source = getSource(environment, sourceId)
  const displayName = isShortened ? source.label.split(' ')[0] : source.label

  return (
    <span className="flex items-center gap-2">
      <SourceBadge sourceId={sourceId} />
      <span className="label">{displayName}</span>
    </span>
  )
}
