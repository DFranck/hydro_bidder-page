# Hydro Bidder Guide

Hydro allocates liquidity through sequential monthly auction rounds, each lasting one month. Projects compete by offering tributes to voters. This onboarding guide describes how projects may participate in the auction process.

The best way to get started as a Hydro bidder is to schedule a call with [Brian Truax](https://calendly.com/actional/hydro) from the Hydro team. He will walk you through the process and answer initial questions.

## Bid approvals

During Pilot Rounds, participation in Hydro requires pre-approval from the Hydro committee, and prospective bidders will be requested to fill out the [project bid template](https://docs.google.com/document/d/1t_K0PxpH4nVWrme6l_8dNQxrUiw0OceNoQ0S959Kp_0/edit?usp=sharing).

An overview of the full bidding process is below.

The information required in the project bid template includes the following:

- Contact details
- Bid Description
  - Liquidity bucket and tranche
  - Intended use of liquidity
  - Conversion to desired LST (if needed)
  - Performance monitoring details
  - Expected performance
  - Risk mitigation details
  - Security audits
  - Deployment Venue Queries
- Tribute tokens during auction process

The full template can be found [here](https://docs.google.com/document/d/1t_K0PxpH4nVWrme6l_8dNQxrUiw0OceNoQ0S959Kp_0/edit?usp=sharing).
For reference, an example of a completed, approved bid teplate can be found [here](https://docs.google.com/document/d/1wlJ0PC6oY2Tu34nbNL1wX5VGUJyy7bibjG8jIQLMWDM/edit#heading=h.tzgjlv8wdq8b).
To start the conversation, you can schedule a call with [Brian](https://calendly.com/actional/hydro) from the Hydro Team.

## Committee review

During Pilot Rounds, the Hydro committee is responsible for allowlisting Projects, deploying liquidity, and managing exports (future versions of Hydro will incorporate a governance module and integration with the [Valence](https://www.valence.zone/) protocol built by Timewave Labs). Committee members are also responsible for maximizing returns for voters and alerting the community about unwanted behaviors and vulnerabilities.

The committee has written [guidelines for project pre-submissions](https://hydro.cosmos.network/docs/committee/hydro-guidelines#whitelisting-guidelines). At launch, the strategies most likely to be allowed are Liquid Staking DEX Provision (pairing liquid ATOM with a Liquid Staking Token) and Lending (with a 60% Loan-to-Value ratio). Over time, the Hydro committee is expected to be willing to allow riskier strategies.

The Hydro committee members currently are:

| Name                                       | Role                         | Description                                                                                                                                            |
| ------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Robo McGobo](https://x.com/RoboMcGobo)    | Liquidity Export Performance | Tracks liquidity export performance to ensure funds are used as intended and yield expected returns. May suggest clawbacks if performance falls short. |
| [Phil RX](https://x.com/Phil_RX)           | Allowlist Management         | Liaises with applicants and provides feedback on allowlist proposals based on qualitative and quantitative criteria.                                   |
| [Trix](https://x.com/brane_trix)           | Auction Performance          | Monitors auctions on Hydro platform for manipulation or collusion, suggesting improvements as needed.                                                  |
| [Jonny Wiles](https://x.com/JohnnyWyles87) | Export Deployment            | Ensures efficient and cost-effective liquidity export deployment across the IBC ecosystem, minimizing fees.                                            |
| [Andres](https://x.com/aesmonty)           | Security Monitoring          | Handles security emergencies and coordinates with the Cosmos Hub community, proposing vetoes and sanctions if needed.                                  |
| [Carter](https://x.com/l_woetzel)          | Ecosystem Growth             | Identifies new collaboration and user adoption opportunities, liaising with partners and developers for Hydro integrations.                            |

## Deployment Venue Query Requirement

To ensure transparency and effective tracking of liquidity, all bidders are required to include the following information for each deployment venue within their proposal:

- **Query for Hydro Account Holdings:** Provide a query that can be used to determine the current holdings of the Hydro committee’s account in the deployment venue. This query should output the amounts held in the principal asset(s). For example, in an stATOM<>ATOM pool, the query should display the holdings of the Hydro account in terms of stATOM and ATOM, as well as the total value denominated in ATOM or USDC.
- **Query for Venue Total TVL:** Provide a query that lists the total TVL (Total Value Locked) in the deployment venue. The output should include the amounts in the principal asset(s) as well as the total value denominated in ATOM or USDC for ease of comparison.

**Expected Output Format:**
The resulting data from both queries must include:

- The amounts of the principal asset(s).
- A total value calculation denominated in either ATOM or USDC.

These queries are critical for ensuring real-time tracking and monitoring of Hydro liquidity deployment. Proposals that fail to include these queries will not be considered.

The principal assets should also be able to be queried completely on-chain (for the ATOM/USDC total values, an off-chain endpoint is sufficient.)

## Bid Process Overview

For prospective bidders, understanding the sequence of events and responsibilities is crucial for a smooth onboarding experience. Below is a general timeline for how bids are prepared, submitted, reviewed, and executed.

### Draft Bid Creation

- Bidders should start by drafting their bid using the [bid template](https://docs.google.com/document/d/1t_K0PxpH4nVWrme6l_8dNQxrUiw0OceNoQ0S959Kp_0/edit?usp=sharing).
- Bidders should ensure the draft meets the [Whitelisting Guidelines](https://hydro.cosmos.network/docs/committee/hydro-guidelines#whitelisting-guidelines), authored by the Hydro Committee.

### Initial Bid Review

- Bidders should reach out to the [Hydro team on Telegram](http://t.me/briantruax) or set a [Calendly meeting](https://calendly.com/actional/hydro) to initiate the bid review process.
- Bidders will meet with a Hydro team member and the Hydro Committee member responsible for Whitelist Management.

### Bid Refinement, Submission & Tribute Upload

- Following the meeting, the draft is reviewed for copywriting standards by the Hydro team and finalized by all parties.
- The finalized bid is uploaded to the Hydro smart contract, as outlined in the [Bid submission](https://hydro.cosmos.network/docs/projects/bidding#bid-submission) section of the bidding process documentation.
- Tribute should be promptly added to the smart contract after the bid is uploaded, using the instructions in the [Tribute additions](https://hydro.cosmos.network/docs/projects/bidding#tribute-additions) section.
- If a bidder is using Points as tribute, this will be managed by the Hydro team on the front-end.

### Front-End Listing

- Once approved by all parties and uploaded to the smart contract, the Hydro team will add the bid to the Hydro front-end, making it visible to users for voting and interactions.

### Deployment Tests

- The Hydro team and committee will conduct deployment tests during the final week of the round to validate and troubleshoot any issues that may occur during liquidity deployment. More information on this can be found in the [Deployments process](https://hydro.cosmos.network/docs/projects/deployment) documentation.

### Round Closure

- Once the round ends, successful bids proceed to liquidity deployment, guided by Hydro’s [Deployment procedures](https://hydro.cosmos.network/docs/projects/deployment).

## Bidder Accountability

Bidders are responsible for ensuring the deployment process proceeds smoothly by:

- Providing accurate and transparent deployment queries.
- Assisting the Hydro committee and Hydro team during tests and deployments.
- Resolving any technical issues promptly and comprehensively.

Additional bidder accountability requirements during the Deployment phase of a bid can be found in the [Deployment processes documentation](https://hydro.cosmos.network/docs/projects/deployment).
