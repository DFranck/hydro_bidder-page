export const environments = {
  development: {
    externalDataCacheDuration: 300,
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
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
  production: {
    externalDataCacheDuration: 300,
    sources: [
      {
        id: 'atom',
        label: 'ATOM',
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

export type Environment = keyof typeof environments

export type SourceID = (typeof environments)[Environment]['sources'][number]['id']
