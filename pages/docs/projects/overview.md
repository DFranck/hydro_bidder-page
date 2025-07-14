# Bidder Guide

Hydro allocates liquidity through sequential auction rounds, each lasting one month. Bidders compete by offering tribute to voters. This onboarding guide describes how projects may create and submit bids to participate in the auction process.

The best way to get started as a Hydro bidder is to schedule a call with [Patrick Hawk](https://calendly.com/patrick-hydrolabs) from the Hydro team. He will walk you through the process and answer initial questions.

Before starting, briefly familiarize yourself with the complete process of creating a bid through to winning and monitoring a deployment. The table below is a high-level overview:

| Step | Description |
| ----- | ----- |
| Bid draft | Draft your bid using the [bid template](https://hydro.cosmos.network/docs//projects/overview#bid-template). Ensure it meets the [Whitelisting Guidelines](https://hydro.cosmos.network/docs/committee/members) authored by the Hydro Committee. |
| Bid review | Contact the Hydro team on Telegram or schedule a Calendly meeting to initiate a review. Meet with a Hydro team member and the Hydro Committee member responsible for Whitelist Management. |
| Bid submission | Refine the draft per copywriting standards.  Finalize the bid and upload it to the Hydro smart contract as outlined in the [Bid submission](https://hydro.cosmos.network/docs/projects/bids#bid-submission) section of the bid process documentation.  |
| Bid approval | Once approved and uploaded to the smart contract, the Hydro team will approve the bid on the Hydro front-end, making it visible to users for voting and interactions. |
| Tribute Upload | Add Tribute using the instructions in the [Tribute additions section](https://hydro.cosmos.network/docs/projects/bids#tribute-additions). (Points as tribute are managed by the Hydro team on the front-end.) |
| Voting Period | Monitor the success of your bid during the voting period, ensuring that vote dynamics are going in your favor. The best ways to encourage voters to choose your bid is to offer attractive tribute (which can be increased during the round) and to get the word out about your active Hydro bid. |
| Deployment tests | The Hydro team and committee conduct deployment tests during the final week of the round to validate and troubleshoot liquidity deployment. More information can be found in the [Deployments process documentation](https://hydro.cosmos.network/docs/projects/deployments). |
| Deployments | After the round ends, successful bids proceed to liquidity deployment, guided by Hydro’s Deployment procedures. Bidders must provide accurate deployment queries, assist the Hydro committee and team during tests and deployments, and resolve any technical issues promptly |

## Requirements

To participate in Hydro liquidity auctions, bidders should ideally support CosmWasm, but at a minimum have Interchain Accounts (ICA) enabled as a host and have an active IBC channel to Neutron. This ensures seamless integration with Hydro’s deployment infrastructure and enables secure, automated liquidity management. Projects without direct compatibility should establish the necessary connections before submitting a bid.

## Bid template

During Pilot Rounds, participation in Hydro requires approval from the Hydro committee, and prospective bidders must fill out the [project bid template](https://docs.google.com/document/d/1t_K0PxpH4nVWrme6l_8dNQxrUiw0OceNoQ0S959Kp_0/edit?usp=sharing). The information needed in the project bid template is the following:

* Contact details  
* Bid Description  
  * Liquidity bucket and tranche  
  * Intended use of liquidity  
  * Conversion to desired LST (if required)  
  * Performance monitoring details  
  * Expected performance  
  * Risk mitigation details  
  * Security audits  
  * Deployment Venue Queries  
  * Tribute tokens or points during auction process

The full template can be found [here](https://docs.google.com/document/d/1t_K0PxpH4nVWrme6l_8dNQxrUiw0OceNoQ0S959Kp_0/edit?usp=sharing). The template contains instructions on how to prepare a bid for review. 

## Committee review

During Pilot Rounds, the Hydro committee is responsible for allowlisting Projects, deploying liquidity, and managing exports (future versions of Hydro will incorporate a governance module and integration with the [Valence](https://www.valence.zone/) protocol built by Timewave Labs). Committee members are also responsible for maximizing returns for voters and alerting the community about unwanted behaviors and vulnerabilities.

The committee has written [guidelines for project pre-submissions](https://hydro.cosmos.network/docs/committee/performance). At launch, the strategies most likely to be allowed are Liquid Staking DEX Provision (pairing liquid ATOM with a Liquid Staking Token) and Lending (with a 60% Loan-to-Value ratio). Over time, the Hydro committee is expected to be willing to allow riskier strategies.
