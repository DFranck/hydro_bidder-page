# Deployment Performance

By [Robo McGobo.](https://x.com/RoboMcGobo) The full write-up is available [here](https://docs.google.com/document/d/199fP59AoH18lboS270_YviEu9guBRSjCn9-_e0_xfmc/edit). 

## Launch strategy

The committee aims to ensure that the returns outlined by the bid’s stated performance expectations are met and, if performance is substantially lower than expected, make recommendations on whether or not to unwind the liquidity position.

By selecting which bids to accept and which to reject, Hydro governance will set a de facto bid performance floor that projects must exceed in order to receive liquidity. In most cases, the committee's role will be constrained to enforcing that performance floor by ensuring that the performance criteria in the original bid are being met.

Initially, this floor should be conservative not to limit the number of prospective customers for Hydro. We propose that the initial Minimum Performance Floor be set at 0. In other words, the liquidity position should not lose money outside of changes in the ATOM price.

Since it’s not always possible to predict whether a position will be profitable during a liquidity deployment, we suggest a conservative grace period of no more than ⅓ of a standard 30-day bid period (10 days). If a position is unprofitable for more than 10 days in any 30-day period, the committee may recommend unwinding it. 

## Submission requirements

To provide a framework by which the committee can monitor performance, submitted bids should include a few hard submission requirements to be considered (above and beyond those mentioned above). These are:

1. **Bid Performance Floor**: The estimated minimum return on the liquidity export, as set by the bid. This may be expressed as a percentage function over time and should subtract expected costs such as impermanent loss or the cost to convert from ATOM to another asset and back, if applicable. We encourage bidders to estimate returns conservatively.
2. **Performance monitoring**: A simple statement describing how the committee may monitor the performance of the position over time. E.g, “*The committee may monitor the position by inserting position ID [xyz] into the following API query*“ or “*The committee may monitor the position using our dashboard located at [xyz]*”

If, at any point, it becomes clear that the position will substantially fail to meet the Bid Performance Floor by the end of the bid period, the committee may recommend unwinding the position. 

Many POL export requests will likely be for purposes other than revenue generation, which may be proposed to benefit the hub differently. These use cases may provide a smaller direct financial return than other potential uses for this liquidity. However, they may still offer an outsized growth story compared to revenue-centric POL positions. If that’s the case, projects submitting these bids should state this in the language of the bid itself and explain the primary benefit the Cosmos Hub should expect from the position, even if intangible. Note that this requirement is in addition to, not in lieu of, all other requirements set forth above. 



| Parameter | Definition | Minimum Condition |
| -------- | -------- | -------- |
| Minimum Performance Floor    | Minimum performance required of the liquidity export over a specified period     | The position must not operate at a loss for more than 10 days in any 30-day period     |
| Bid Performance Floor     | Estimated minimum return on the liquidity export, as set by the bid.     | A position must not fail to meet the Bid Performance Floor by the end of the bid period     |
| Intangible Benefits     | Benefits that the Hub may receive outside of revenue     | Situationally dependent     |
