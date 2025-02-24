# Bidding process

## Bid submission
At the beginning of the auction round, projects submit their bid to the Hydro smart contract and post their Tribute token. Projects can choose any type of token for bidding purposes; it does not have to be the project's native token. For example, a project could pay a tribute in USDC. After the auction round ends, the tribute is automatically distributed to all voters who supported the Project's bid.

During the auction round, projects can increase the amount of tribute to attract more support. Once increased, the amount cannot be decreased. This rule prevents scenarios where a project might offer a high tribute to gain votes and then reduce it before the round ends.

Before submitting a proposal, projects choose the tranche ID you want to participate in. Information about tranches can be obtained from the Hydro smart contract using the following CLI command:

`neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR '{"tranches": {}}' --node [NEUTRON_NODE_RPC]`

Submit a bid in the current auction round using the following CLI command:

```
EXECUTE='{"create_proposal":{"deployment_duration":[deployment_duration],"description":"[description]","minimum_atom_liquidity_request":"[minimum request]","title":"[title]","tranche_id":[tranche_id]}}'

neutrond tx wasm execute $HYDRO_CONTRACT_ADDR "$EXECUTE" \
--chain-id neutron-1 \
--gas auto \
--gas-adjustment [GAS_ADJUSTMENT] \
--gas-prices [GAS_PRICES] \
--node [NEUTRON_NODE_RPC] \
--from [WALLET_NAME] \
--home [NEUTRON_NODE_HOME_DIR] \
--keyring-backend [KEYRING_BACKEND]
```

## Submission check

To verify that your proposal was submitted successfully, projects can query the Hydro smart contract to obtain all proposals for the given round and tranche IDs. 

`neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR '{"current_round": {}}' --node [NEUTRON_NODE_RPC]`

Then, use the round and tranche IDs to query the proposals:

```
QUERY='{"round_proposals":{"round_id": [ROUND_ID],"tranche_id":[TRANCHE_ID],"start_from":0,"limit":100}}'

neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR "$QUERY" --node [NEUTRON_NODE_RPC]
```

## Tribute Additions

Projects can incentivize users to vote for their proposals by adding tributes to the bid they've submitted to the Hydro smart contract. Multiple tributes can be added to the same bid. Tributes are sent as any token amount that the Project is willing to pay to the proposal voters. These tokens will be locked in the tribute smart contract until the current round ends.

If a bid is among the top N by voted power, the entire tribute becomes available for the voters to claim. Each user's portion of the tribute is proportional to their voting power relative to the total voted power for that proposal. The tribute is refunded if a bid is not among the top N.

To add a tribute to a proposal, send the following transaction to the Tribute smart contract:

```
EXECUTE='{"add_tribute":{"proposal_id":[PROPOSAL_ID],"round_id":[ROUND_ID],"tranche_id": [TRANCHE_ID]}}'

neutrond tx wasm execute $TRIBUTE_CONTRACT_ADDR "$EXECUTE" \
--amount [TRIBUTE_AMOUNT]
--chain-id neutron-1 \
--gas auto \
--gas-adjustment [GAS_ADJUSTMENT] \
--gas-prices [GAS_PRICES] \
--node [NEUTRON_NODE_RPC] \
--from [WALLET_NAME] \
--home [NEUTRON_NODE_HOME_DIR] \
--keyring-backend [KEYRING_BACKEND]
```

## Tribute Queries
To query all tributes for a given proposal, use the following query on the Tribute smart contract:

```
QUERY='{"proposal_tributes":{"round_id":[ROUND_ID],"tranche_id":[TRANCHE_ID],"proposal_id":[PROPOSAL_ID],"start_from":0,"limit":100}}'

neutrond q wasm contract-state smart $TRIBUTE_CONTRACT_ADDR "$QUERY" --node [NEUTRON_NODE_RPC]
```

## Tribute Refunds

If a proposal is not among the top N by voted power for a given round, projects get refunded the tributes to the account that added the tribute. This is done by sending the following transaction to the tribute smart contract:

```
EXECUTE='{"refund_tribute":{"round_id":[ROUND_ID],"tranche_id":[TRANCHE_ID],"proposal_id":[PROPOSAL_ID], "tribute_id": [TRIBUTE_ID]}}'

neutrond tx wasm execute $TRIBUTE_CONTRACT_ADDR "$EXECUTE" \
--chain-id neutron-1 \
--gas auto \
--gas-adjustment [GAS_ADJUSTMENT] \
--gas-prices [GAS_PRICES] \
--node [NEUTRON_NODE_RPC] \
--from [WALLET_NAME] \
--home [NEUTRON_NODE_HOME_DIR] \
--keyring-backend [KEYRING_BACKEND]
```

After the transaction is successfully executed, the entire amount of the tribute will be refunded to the sender's account.

## Tribute Floor

The tribute floor feature helps balance fair rewards for users and equitable access to liquidity for projects. The tribute floor and the tribute amount submitted by a bidder determine a maximum allocation. The formula to calculate a maximum allocation using the tribute floor is: 

`Max allocation` \= `current_tribute_amount` / `tribute_floor_rate`

The table below shows two examples of how the rate of the tribute floor can impact the maximum amount of liquidity a bid can receive. 

| Tribute Amount | Tribute Floor | Max allocation |
| :---: | :---: | :---: |
| 100 ATOM | 0.01% | 100,000 ATOM |
| 100 ATOM | 1% | 10,000 ATOM |

As bidders increase their tribute (or ATOM price fluctuates), the maximum allocation is updated dynamically throughout a bidding round. The system will enforce it at the end of the round, before the deployment is made.

A healthy tribute floor rate ensures fair contributions for liquidity and healthy APRs for users.  

## Bids without live tokens

Some projects may not have a live token with which to bid. In that case, the simplest option is to upload a tribute with another token (e.g., ATOM, USDC, etc.). No technical work is required; the project simply submits the tribute using the token it wishes to pay.

However, some bidders do not have a live token yet and instead wish to use points as tribute. This is acceptable as long as points-based bids are structured transparently and equitably, allowing Hydro voters to assess their value confidently. The requirements are:

**APR Calculation:** The Hydro team must be provided with a straightforward method for determining the APR of the points. Since fair auction dynamics require comparability between token-based and point-based bids, the project must include in their bid:

* The percentage (a % range) of the total token supply that will be allocated to points.  
* The percentage of total points that will be used for bidding in Hydro.  
* The expected market cap of the project  
* A short justification for this market cap (see example below)

Predicting the marketplace of a crypto project is obviously a very difficult task, so projects should just use the last private valuation or a simple comparable valuation method. 

Let’s take an example with the liquid staking protocol Drop. Drop’s latest private valuation isn’t publicly available, but the Drop protocol is similar to the Stride protocol. If the STRD market cap is $20M, and the Drop-assets represent roughly 40% of Stride-assets, DROP market cap may be closer to $10M than $1M or $100M. 

**Timely Distribution**: Points should be distributed promptly after each round once the Hydro team provides the list of wallets that voted for the point-based bid. Token tributes are available for claim as soon as deployments for a round are completed, so it’s unfair to voters for points distributions to significantly lag. Delayed point distributions are not permitted, as they undermine trust in Hydro’s auction process. 