export function proposalTotalTribute(
    pricedAndNamedTributes: {
        priceUsd: number | undefined
        symbol: string | undefined
        decimals: number | undefined
        denom: string
        amount: number
    }[]
) {
    return pricedAndNamedTributes.reduce((total, tribute) => {
        return (
            total +
            ((tribute.priceUsd ?? 0) * tribute.amount) /
                10 ** (tribute.decimals ?? 0)
        )
    }, 0)
}
