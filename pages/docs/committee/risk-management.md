# Risk Management

By [Phil RX](https://x.com/Phil_RX). The full write-up is available [here](https://docs.google.com/document/d/1bMaXX46DGhieGEcq7eDrhLkiqb5FqDSHTvse-nBtueA/edit). 

## Committee goals

The committee aims to gather initial data to fine-tune parameters before preparing a fully deterministic framework. The focus is defining a cap amount each project can claim rather than a strict pass-fail process. We will guide applicants to request appropriate amounts related to their risk using the described quantitative elements (yield arbitrage as a function of real-yield spread and DEX provisions as a function of volume, time, and standard deviation). 

## Use cases at launch
We propose excluding bootstrapping in v1, unless some specific conditions are proposed by the candidate to reduce the risk posed to community funds. Two use cases will be whitelisted for this initial phase:

1. **DEX provisioning for stable pairs**: This involves pairing liquid ATOM with a Liquid Staking Token (LST). Hydro’s allocation should not surpass 33% of the total liquidity after deposits.
2. **Lending**: This includes using ATOM or LSTs as collateral to mint or borrow tokens. A 60% Loan-to-Value (LTV) ratio has been established as a safety precaution. Initially, lending will be limited to liquid ATOM until LST liquidity reaches sufficient depth for whitelisting.

## Use cases afterwards

We will aim to anchor the whitelisting process with minimal subjectivity. We propose three categories, each with different risk profiles:

1. **Money Markets Usage / Staking Yield Arbitrage**: These involve simple math functions, and risk can be measured and calculated upfront. The primary risk factor is time, and potential pair imbalances should resolve naturally. Propositions should be assessed based on the yield spreads between assets. Initially, we could accept all reasonable requests, as long as the real-yield (inflation discounted) doesn’t exceed a certain percentage.
2. **DEX Liquidity Provision**: The primary risk here pertains to impermanent loss, which is more complex to calculate due to multiple variables. For the interim, I suggest a simplified approach using three variables: volume, time, and standard deviation. By comparing the relative volatility between assets in the pair, we can define the maximum risk the Hub is willing to take.
3. **Liquidity Bootstrapping**: This is the riskiest category, and we recommend using something other than community funds for this purpose in the initial version of the Hydro platform. Bootstrapping tokens involve absolute uncertainty and substantial risks. Therefore, we should wait until we have a risk compensation framework involving Hydro voter funds slashing before considering it.