import { environments } from '@v2/environments'

export type Environment = keyof typeof environments

export type SourceID = (typeof environments)[Environment]['sources'][number]['id']
