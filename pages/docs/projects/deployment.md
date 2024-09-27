# Deployment

## DAO on Neutron

The Hydro committee DAO will be launched on Neutron using DAO DAO. By moving away from the current multisig method for managing liquidity exports, this new setup will offer the community higher transparency about which Projects are approved (whitelisted) and provide better control over the liquidity funds being distributed.

### Hydro committee capabilities:

-   Add/Remove Projects from the whitelist or the ICQ managers
-   Pause/Unpause the contract
-   Update the maximal number of tokens that can be locked in the contract
-   Query the top N proposals

> **Reminder:** Future versions of Hydro will incorporate a governance module and integration with the Valence protocol built by Timewave Labs, transforming the Hydro committee into an advisory body with limited decision-making authority.

## Liquid staking LP deployment example

A DEX wants to create a liquidity pool for trading between ATOM and its corresponding Liquid Staking Token stATOM. To ensure a healthy ratio in the liquidity pool, the bid submitted by the DEX envisions that the liquidity from Hydro should not exceed 33% of the total liquidity of the LP.

### Steps Involved

1. **Hydro liquidity export**

    - Hydro committee DAO deploys 50,000 ATOM and 50,000 stATOM into the liquidity pool on behalf of the DEX.
    - This initial deposit kickstarts the liquidity pool, making it attractive for other traders and liquidity providers.

2. **Community Participation**

    - Other users and smaller liquidity providers observe the pool's potential and decide to contribute.
    - Collectively, they deposit an additional 1,000 ATOM and 1,000 stATOM into the pool.

3. **Calculating Total Liquidity**

    - **Total ATOM in Pool**: 1,000 (Hydro) + 2,000 (Community) = 3,000 ATOM
    - **Total stATOM in Pool**: 1,000 (Hydro) + 2,000 (Community) = 3,000 stATOM
    - **Total Liquidity Value**: The combined value of ATOM and stATOM tokens in the pool

4. **Hydro's Liquidity Share**

    - Hydro's share of the total liquidity is calculated as its deposit divided by the total liquidity.
    - Hydro's Share: 1,000 ATOM / 3,000 ATOM = 33.33% (Same calculation applies for stATOM)

    Hydro share $= \frac{1000 \text{ ATOM}}{3000 \text{ ATOM}} = 33.33\%$

    The same calculation applies for stATOM

5. **Ensuring Allocation Limit**
    - Hydro's allocation is exactly at the 33% threshold, complying with the decision not to surpass this limit.

## Lending deployment example

A Project wants to unlock liquidity using ATOM holdings, received through Hydro, without selling them. They decide to use a DeFi lending platform that accepts ATOM as collateral.

### Steps Involved

1. **Depositing ATOM as Collateral**

    - The Hydro DAO deposits 1000 ATOM on behalf of the Project into the lending platform.
    - Assume the current market price of ATOM is $10 per ATOM.
    - Total Collateral Value: 1000 ATOM × $10 = $10,000

2. **Calculating the Maximum Borrow Amount**

    - Maximum Borrow Amount: 60% × $10,000 = $6000
    - The Project can borrow up to $6000 worth of another asset, such as a stablecoin.

3. **Borrowing Funds**

    - The Project decides to borrow 6000 units of a stablecoin USDC.
    - This amount adheres to the 60% LTV ratio limit.

4. **Monitoring Market Conditions**

    - The Project must monitor the price of ATOM. A price drop increases the LTV ratio.
    - Example: If ATOM's price falls to $8:
        - New Collateral Value: 1000 ATOM × $8 = $8000
        - New LTV Ratio: $6000 / $8000 = 75%

5. **Managing Risk of Liquidation**

    - Liquidation Threshold: Suppose the lending platform sets this at 75% LTV.
    - Actions the Project can take if approaching the threshold:
        - Repay a portion of the loan to lower the LTV ratio.
        - Add more ATOM as collateral to increase the collateral value.

6. **Repayment and Withdrawal**
    - The user repays the 6000 stablecoins plus any accrued interest.
    - After full repayment, they can withdraw their 1000 ATOM collateral.
