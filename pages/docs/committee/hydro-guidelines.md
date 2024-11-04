# Guidelines

The starting committee is composed of [Robo McGobo](https://x.com/RoboMcGobo) (export performance), [Phil RX](https://x.com/Phil_RX) (whitelist management), [Trix](https://x.com/brane_trix) (auction performance), [Carter](https://x.com/l_woetzel) (partnerships), [Johnny Wyles](https://x.com/JohnnyWyles87) (export deployment) and [Andres Monty](https://x.com/aesmonty) (security monitoring)

This document explains to future potential voters and bidders how the committee intends to make decisions and conduct its operations at launch. It is meant to be updated regularly to incorporate learnings and feedback.

## WHITELISTING GUIDELINES

By [Phil RX](https://x.com/Phil_RX). The full write-up is available [here](https://docs.google.com/document/d/1bMaXX46DGhieGEcq7eDrhLkiqb5FqDSHTvse-nBtueA/edit).

### Committee goals

The committee aims to gather initial data to fine-tune parameters before preparing a fully deterministic framework. The focus is defining a cap amount each project can claim rather than a strict pass-fail process. We will guide applicants to request appropriate amounts related to their risk using the described quantitative elements (yield arbitrage as a function of real-yield spread and DEX provisions as a function of volume, time, and standard deviation).

### Use cases at launch

We propose excluding bootstrapping in v1, unless some specific conditions are proposed by the candidate to reduce the risk posed to community funds. Two use cases will be whitelisted for this initial phase:

1. **DEX provisioning for stable pairs**: This involves pairing liquid ATOM with a Liquid Staking Token (LST). Hydro’s allocation should not surpass 33% of the total liquidity after deposits.
2. **Lending**: This includes using ATOM or LSTs as collateral to mint or borrow tokens. A 60% Loan-to-Value (LTV) ratio has been established as a safety precaution. Initially, lending will be limited to liquid ATOM until LST liquidity reaches sufficient depth for whitelisting.

### Use cases afterwards

We will aim to anchor the whitelisting process with minimal subjectivity. We propose three categories, each with different risk profiles:

1. **Money Markets Usage / Staking Yield Arbitrage**: These involve simple math functions, and risk can be measured and calculated upfront. The primary risk factor is time, and potential pair imbalances should resolve naturally. Propositions should be assessed based on the yield spreads between assets. Initially, we could accept all reasonable requests, as long as the real-yield (inflation discounted) doesn’t exceed a certain percentage.
2. **DEX Liquidity Provision**: The primary risk here pertains to impermanent loss, which is more complex to calculate due to multiple variables. For the interim, I suggest a simplified approach using three variables: volume, time, and standard deviation. By comparing the relative volatility between assets in the pair, we can define the maximum risk the Hub is willing to take.
3. **Liquidity Bootstrapping**: This is the riskiest category, and we recommend using something other than community funds for this purpose in the initial version of the Hydro platform. Bootstrapping tokens involve absolute uncertainty and substantial risks. Therefore, we should wait until we have a risk compensation framework involving Hydro voter funds slashing before considering it.

## EXPORT PERFORMANCE GUIDELINES

By [Robo McGobo.](https://x.com/RoboMcGobo) The full write-up is available [here](https://docs.google.com/document/d/199fP59AoH18lboS270_YviEu9guBRSjCn9-_e0_xfmc/edit).

### Launch strategy

The committee aims to ensure that the returns outlined by the bid’s stated performance expectations are met and, if performance is substantially lower than expected, make recommendations on whether or not to unwind the liquidity position.

By selecting which bids to accept and which to reject, Hydro governance will set a de facto bid performance floor that projects must exceed in order to receive liquidity. In most cases, the committee's role will be constrained to enforcing that performance floor by ensuring that the performance criteria in the original bid are being met.

Initially, this floor should be conservative not to limit the number of prospective customers for Hydro. We propose that the initial Minimum Performance Floor be set at 0. In other words, the liquidity position should not lose money outside of changes in the ATOM price.

Since it’s not always possible to predict whether a position will be profitable during a liquidity deployment, we suggest a conservative grace period of no more than ⅓ of a standard 30-day bid period (10 days). If a position is unprofitable for more than 10 days in any 30-day period, the committee may recommend unwinding it.

### Submission requirements

To provide a framework by which the committee can monitor performance, submitted bids should include a few hard submission requirements to be considered (above and beyond those mentioned above). These are:

1. **Bid Performance Floor**: The estimated minimum return on the liquidity export, as set by the bid. This may be expressed as a percentage function over time and should subtract expected costs such as impermanent loss or the cost to convert from ATOM to another asset and back, if applicable. We encourage bidders to estimate returns conservatively.
2. **Performance monitoring**: A simple statement describing how the committee may monitor the performance of the position over time. E.g, “_The committee may monitor the position by inserting position ID [xyz] into the following API query_“ or “_The committee may monitor the position using our dashboard located at [xyz]_”

If, at any point, it becomes clear that the position will substantially fail to meet the Bid Performance Floor by the end of the bid period, the committee may recommend unwinding the position.

Many POL export requests will likely be for purposes other than revenue generation, which may be proposed to benefit the hub differently. These use cases may provide a smaller direct financial return than other potential uses for this liquidity. However, they may still offer an outsized growth story compared to revenue-centric POL positions. If that’s the case, projects submitting these bids should state this in the language of the bid itself and explain the primary benefit the Cosmos Hub should expect from the position, even if intangible. Note that this requirement is in addition to, not in lieu of, all other requirements set forth above.

| Parameter                 | Definition                                                                   | Minimum Condition                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Minimum Performance Floor | Minimum performance required of the liquidity export over a specified period | The position must not operate at a loss for more than 10 days in any 30-day period      |
| Bid Performance Floor     | Estimated minimum return on the liquidity export, as set by the bid.         | A position must not fail to meet the Bid Performance Floor by the end of the bid period |
| Intangible Benefits       | Benefits that the Hub may receive outside of revenue                         | Situationally dependent                                                                 |

## SECURITY GUIDELINES

By [Monty](https://x.com/aesmonty). The full write-up is available [here](https://docs.google.com/document/d/1z5tHsIqBCX9pzGtu6tJluVTjrXaCLa0h-mLdbdh_FgI/edit).

### Committee goals

The responsibilities of the Security Monitoring role are divided into two primary duties:

- Detection: Enabling the Hydro Committee to promptly detect malicious activity, risks, and operational incidents.
- Response: Implementing processes to coordinate with relevant stakeholders in case of security emergencies or operational problems to mitigate damages.

Given the part-time nature of the role, security monitoring will be performed on a best-effort basis, and it’s not guaranteed that a given security incident or emergency will be detected in time to prevent or mitigate any damages. The full write-up includes a table for each monitoring target, with a summary of the events and situations to be covered.

### Submission requirements

To vet projects applying to Hydro and maintain high-security standards across Hydro's third-party dependencies (e.g., POL venues), we propose a security checklist, which would serve as a requirement for applying teams. You can find the checklist below:

- The code must be open-source or source-available. It must also be audited by a reputable security firm, and the audit report must be publicly available.
- The public documentation must include emergency security contacts, upgrade capabilities, and emergency response capabilities (such as pause or freeze actions)

In addition, proposed protocol upgrades should be communicated to the Hydro committee at least two weeks in advance.

## AUCTION PERFORMANCE GUIDELINES

By [Trix](https://x.com/brane_trix). The full write-up is available [here](https://docs.google.com/document/d/1EYtyF2POFdOskPmCXDN6braImI1FBAxkq-HFIhVqmWg/edit?usp=sharing).

### Committee Goals

The committee aims to gather information and figure out what optimization/collusion protection solutions can be added to Hydro with low effort, e.g

- How many auctions can be run concurrently?
- Can subsets of export whitelists be assigned to auctions?
- Can we set specific export parameters (i.e., duration) per auction?

The collusion & performance solutions described in the full write-up revolve mainly around creating more bid groups to maximize the performance of each export auction. This will require an initial period to monitor the yield appetite for auctions, build a collusion detector, and garner feedback from bidders to determine what changes would increase their demand to bid for exports. The overarching goal for “Auction Performance” is creating an environment where bidders are ecstatic to bid, and voters are excited to front the opportunity costs of locking to direct Hub capital. Yield to voters. Value to bidders.

### Bidder strategies

**Gradual Increase of Bids**: Without historical data, projects won’t know how many votes they may get for a bid amount. Since they can increase their bid and voters can switch votes whenever they want, a good strategy would be to start low and add more tokens over time to attract the necessary votes. This strategy may not work well if voters vote once and leave or wait until the end of the round to vote (knowing projects can always add more tokens).

**Precise Total Vote Goals**: As the auctions get more sophisticated and the projects earn reputation, they may begin to add bids only to target specific vote totals in order to target minimum export amounts. With the export allocation cap and the vote-weighted export totals, it’s not necessary to win as many votes as possible as long as the projects are winning a total export they deem valuable.

## DEPLOYMENT GUIDELINES

By [Johnny Wyles](https://x.com/JohnnyWyles87). The full write-up is available [here](https://docs.google.com/document/d/1Xytt4fpwi6zXVwAX9VHV8XpbW3HpM11ppecKlrYCFmE/edit).

### Transparency

All transactions will be visible on the single display of the Hydro Committee page. Proposals to be carried out on another chain will utilize either DAODAO Cross Chain accounts, native Interchain Accounts, or be represented by a custom proposal with links to all transactions outside Cosmos SDK chains.

### Timeliness

Deployment proposals may occur asynchronously to speed execution. All deployments, including those requiring synchronous signing due to factors such as slippage or timeout restrictions, should occur within one week of the bidding process's completion. Delays to deployment resulting from technical issues must be communicated to the winning bidder within the day these are encountered. Delays to deployments beyond the week timeframe must be disclosed to all Hydro auction participants.

### Safety

Deposits for all new deployments will be tested by actioning up to 10% of the intended allocation before the total amount is deposited. All liquidity will remain under the control of the Hydro Committee multisig and must not be transferred to a third party or single representative.
