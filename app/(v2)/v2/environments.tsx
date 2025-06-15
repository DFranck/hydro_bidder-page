export type Environment = keyof typeof environments

export type SourceID =
  (typeof environments)[Environment]['sources'][number]['id']

export const environments = {
  development: {
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
        hydroContract:
          'neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp',
        tributeContract:
          'neutron1zy38lczkv82c6kkv5rccpnlltjtaz5cl4wc79mwgrtchtwdsc72skwe58t',
        priceChainId: 'neutron-1',
      },
      {
        id: 'stosmo',
        label: 'stOSMO',
        hydroContract:
          'neutron1xkvzdzfzacuzlwlxf5hhlrqgv9sz4rgd2gkhvgm8lmudn8lmw0fq2296nu',
        tributeContract:
          'neutron1l6sq43kzhw77t7f5n9e6vxente0agcj3wyedkxtc08pm7c9uu2jsssq9wj',
        priceChainId: 'neutron-1',
      },
    ],
  },
  production: {
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
        hydroContract:
          'neutron13w6sagl4clacx4c8drhuwfl20cesn3pnllhf37e65ls8zwf6gcgq93t2lp',
        tributeContract:
          'neutron1zy38lczkv82c6kkv5rccpnlltjtaz5cl4wc79mwgrtchtwdsc72skwe58t',
        priceChainId: 'neutron-1',
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
