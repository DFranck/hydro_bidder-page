import { Environment, SourceID, environments } from '@v2/types'

export { environments }
export type { Environment, SourceID }

export function getEnvironment(): Environment {
  const env: Environment = (process.env.NEXT_PUBLIC_ENVIRONMENT ??
    'production') as Environment
  return env
}

export function getSource(environment: Environment, sourceId: SourceID) {
  const environmentObject = environments[environment]
  const sourceObject = environmentObject.sources.find(
    (source) => source.id === sourceId,
  )
  if (!sourceObject) {
    throw new Error(
      `Source ${sourceId} not found in environment ${environment}`,
    )
  }
  return sourceObject
}
