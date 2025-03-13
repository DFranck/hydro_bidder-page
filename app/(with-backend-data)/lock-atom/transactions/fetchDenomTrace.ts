export const fetchDenomTrace = async (
  balance: {
    denom: string
    amount: string
  },
  restEndpoint: string
) => {
  if (balance.denom?.startsWith("ibc/")) {
    try {
      const url = `${restEndpoint}ibc/apps/transfer/v1/denom_traces/${balance.denom}`
      const denomTraceResponse = await fetch(url).then((res) => res.json())
      const baseDenom = denomTraceResponse.denom_trace.base_denom

      if (baseDenom?.startsWith("cosmosvaloper")) {
        const [validator, _] = baseDenom?.split("/") ?? []
        return {
          validator,
          amount: balance.amount,
          denom: balance.denom,
          baseDenom,
        }
      }
    } catch (error) {
      console.error(`Error fetching denom trace for ${balance.denom}:`, error)
    }
  }
  return null
}
