import * as ToolTips from "@/components/ToolTips"

export function getActionTooltip(key?: string): React.ReactNode {
  if (!key) {
    return null
  }
  const tooltip = (ToolTips as unknown as Record<string, React.ReactNode>)[key]

  if (!tooltip) {
    throw new Error(`Unknown tooltip key: "${key}"`)
  }
  return tooltip
}
