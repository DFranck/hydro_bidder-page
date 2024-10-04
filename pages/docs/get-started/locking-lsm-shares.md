# Locking LSM Shares

## Understanding the LSM

The LSM shares (i.e Liquid Staking Module shares) represent tokenized, staked ATOM on the Cosmos Hub. By converting your staked ATOM into LSM shares, you unlock the ability to get voting power and Hydro rewards while still earning staking rewards on your staked ATOM. LSM shares are transferable, liquid versions of staked ATOM and play a crucial role in participating in Hydro.

### Key Points:

-   LSM shares allow you to earn rewards by voting for liquidity distribution on Hydro.
-   By tokenizing your staked ATOM into LSM shares, you maintain the benefits of staking while gaining flexibility in using these tokens.

## Staking & Tokenizing

### Staking ATOM:

1. If you haven't already staked your ATOM, you can do so via your preferred staking platform (e.g., Keplr, Cosmostation).
2. Choose a validator and delegate your ATOM to start earning staking rewards.\*

### Converting to LSM Shares:

1. Navigate to the Hydro website at hydro.cosmos.network.
2. Click "Connect Wallet" in the menu or click one of the "Get Started" buttons on the homepage.
3. In the first modal that appears, select one of the validators that you are currently staking ATOM with.
4. In the next modal, choose the amount of ATOM that you want to use to obtain voting power.
    > Note: you will see the voting power update in real-time based on the Lock-up period and the amount of ATOM you input.
5. Click "Get Voting Power".

**NOTE**: There are many reasons to choose your validator carefully in Cosmos. In the Hydro context, if your validator falls out of the active set, you will not receive staking rewards and will not be able to vote in Hydro anymore.

## Locking for Voting Power

When you lock your LSM shares into Hydro, you gain voting power, which enables you to vote on liquidity distribution proposals. The amount of voting power you receive depends on two factors:

1. Amount of LSM shares locked
2. Duration of lock-up (1 month, 2 months, 3 months, 6 months, 12 months)

The longer the lock-up period, the more voting power you will receive. However, voting power diminishes over time as the lock-up period gets closer to expiration. The specific calculation of your voting power is based on the remaining lockup duration at the end of the current round.

| Remaining Lockup Duration | Duration Scaling Factor |
| ------------------------- | ----------------------- |
| >0 months                 | 1                       |
| >1 month                  | 1.25                    |
| >2 months                 | 1.5                     |
| >3 months                 | 2                       |
| >6 months                 | 4                       |

This means that a users voting power decays over time in steps, and behaves like this:

![Remaining scaling explained](/doc/remaining-lockup.png)

Note: Round 1 of Hydro will have certain restrictions around lockups. Specifically, users will not be allowed in the first round to lock for 6 or 12 months. The user will only be able to lock for 1, 2, or 3 months during Round 1. In future rounds users will be able to successfully create lockups that are for 1, 2, 3, 6 and 12 months.

**Key Points**:

-   Locking for longer periods (e.g., 12 months) grants more voting power than shorter periods.
-   As lock-ups age, voting power decreases, requiring users to refresh or extend their lock-up to maintain influence.


### Example Scenarios

#### Short Lock-Up

A user locks 1000 LSM shares for 1 month on 7-Oct. They receive 1000 in voting power. By the end of the one month, their voting power has diminished, and they can either refresh or unlock their shares.

| Short Lock-Up | On 7-Oct | On 7-Nov |
|---------------|----------|----------|
| Month         | 0        | 1        |
| Voting power  | 1000     | 0        |

![Scenario 1](/doc/scenario-1.png)

#### Long Lock-Up

A user locks 5000 LSM shares for 6 months during a round on 7-Oct. They receive 10,000 voting power. Over time, their voting power gradually diminishes but remains significantly higher than shorter lock-ups due to the longer duration. 

| Long Lock-Up | On 7-Oct | On 7-Nov | On 7-Dec | On 7-Jan | On 7-Feb | On 7-Mar | On 7-Apr |
|--------------|----------|----------|----------|----------|----------|----------|----------|
| Month        | 0        | 1        | 2        | 3        | 4        | 5        | 6        |
| Voting power | 10000    | 10000    | 10000    | 7500     | 6250     | 5000     | 0        |

![Scenario 2](/doc/scenario-2.png)

#### Multiple Lock-Ups

A user creates three lock-ups on 7-Oct:
- 500 LSM shares locked for 1 month
- 1000 LSM shares locked for 3 months
- 2000 LSM shares locked for 6 months

Each lock-up provides different voting power; the user can monitor their combined voting power on the Hydro dashboard.

| Multiple Lock-Ups | On 7-Oct | On 7-Nov | On 7-Dec | On 7-Jan | On 7-Feb | On 7-Mar | On 7-Apr |
|-------------------|----------|----------|----------|----------|----------|----------|----------|
| Month             | 0        | 1        | 2        | 3        | 4        | 5        | 6        |
| Voting power 1    | 500      | 0        | 0        | 0        | 0        | 0        | 0        |
| Voting power 2    | 1500     | 1250     | 1000     | 0        | 0        | 0        | 0        |
| Voting power 3    | 4000     | 4000     | 4000     | 3000     | 2500     | 2000     | 0        |
| Sum               | 6000     | 5250     | 5000     | 3000     | 2500     | 2000     | 0        |

![Scenario 3](/doc/scenario-3.png)
