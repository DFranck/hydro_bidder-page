import { Environment, SourceID } from '@v2/types'

export type { Environment, SourceID }

export const environments = {
  development: {
    externalDataCacheDuration: 300,
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
        trancheSuffix: 'bucket',
        atomDenom:
          'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
        hydroContract:
          'neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp',
        tributeContract:
          'neutron1zy38lczkv82c6kkv5rccpnlltjtaz5cl4wc79mwgrtchtwdsc72skwe58t',
        priceChainId: 'neutron-1',
        voteThresholds: {
          1: 0.05,
          2: 0.35,
        },
        cacheDuration: 300,
      },
    ],
  },
  'staging-next': {
    externalDataCacheDuration: 300,
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
        trancheSuffix: 'bucket',
        atomDenom:
          'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
        hydroContract:
          'neutron1la84jn93j6qv3lmayrc7mvr3zp0vsmxhy9uhqzmnnevhxuev72uspf7da4',
        tributeContract:
          'neutron1e90z4vpxufxvskz3fc80wrz0g57xg4u7zda7dsuwnwm5jp7635dsrt9r4t',
        priceChainId: 'neutron-1',
        voteThresholds: {
          1: 0.05,
          2: 0.35,
        },
        cacheDuration: 300,
      },
    ],
  },
  production: {
    externalDataCacheDuration: 300,
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
        trancheSuffix: 'bucket',
        atomDenom:
          'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
        hydroContract:
          'neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp',
        tributeContract:
          'neutron1zy38lczkv82c6kkv5rccpnlltjtaz5cl4wc79mwgrtchtwdsc72skwe58t',
        priceChainId: 'neutron-1',
        voteThresholds: {
          1: 0.05,
          2: 0.35,
        },
        cacheDuration: 300,
      },
    ],
  },
} as const

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
