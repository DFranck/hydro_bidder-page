export interface ProposalFromNumia {
  round: string
  tranche: string
  project: string
  project_url: string
  project_logo_url: string
  id: string
  title: string
  description: string
  comments: string
  onchain_tribute_assets: string
  onchain_tribute_usdc: number
  offchain_tribute: string
  voters: number
  voting_power: number
  requested_allocation_denom: string
  requested_allocation_amount: number
  initial_allocation_denom: string
  initial_allocation_amount: number
  current_allocation_denom: string
  current_allocation_amount: number
  status: string
  duration_days: number
  apr: number
}

export interface DenomFromNumia {
  amount: number
  type: string
}

export type SanitizedProposalFromNumia = Omit<
  ProposalFromNumia,
  "offchain_tribute" | "onchain_tribute_assets"
> & {
  offchain_tribute: {
    amount: number
    type: string
  }[]
  onchain_tribute_assets: {
    amount: number
    asset: string
  }[]
}

export async function fetchNumiaData(): Promise<SanitizedProposalFromNumia[]> {
  const response = await fetch(
    "https://www.datalenses.zone/numia/cosmos/lensesV2/hydro/deployments_overview"
  )
  const data = await response.json()
  return data.map((proposal: ProposalFromNumia) => ({
    ...proposal,
    offchain_tribute: JSON.parse(proposal.offchain_tribute).filter(
      (tribute: DenomFromNumia) => tribute.amount > 0
    ),
    onchain_tribute_assets: JSON.parse(proposal.onchain_tribute_assets).filter(
      (tribute: DenomFromNumia) => tribute.amount > 0
    ),
  }))
}
