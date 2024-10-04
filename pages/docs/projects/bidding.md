# Bidding

At the beginning of the auction round, Projects submit their bid to the Hydro smart contract and post their Tribute token. Projects can choose any type of token for bidding purposes; it does not have to be the Project's native token. For instance, a Project could pay tribute in USDC. After the auction round ends, the tribute is automatically distributed to all voters who supported the Project's bid.

During the auction round, Projects can increase the amount of tribute to attract more support. Once increased, the amount cannot be decreased. This rule prevents scenarios where a Project might offer a high tribute to gain votes and then reduce it before the round ends.

## Bid submission

To bid for liquidity, Projects should submit their proposals to the Hydro smart contract. Before submitting a proposal, you need to know the tranche ID in which you want to participate. Information about tranches can be obtained from the Hydro smart contract using the following CLI command:

```shell
neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR '{"tranches": {}}' --node [NEUTRON_NODE_RPC]
```

To submit a bid in the current auction round, use the following CLI command:

```shell
EXECUTE='{"create_proposal":{"tranche_id":[TRANCHE_ID],"title":"[PROPOSAL_TITLE]","description":"[PROPOSAL_DESCRIPTION]"}}'

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

## Verifying Bid Submission

To verify that your proposal was submitted successfully, you can query the Hydro smart contract to obtain all proposals for the given round and tranche IDs.

First we need to know what is the current round, and this information can be obtained from the Hydro contract with the following query:

```shell
neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR '{"current_round": {}}' --node [NEUTRON_NODE_RPC]
```

Then we can use the round and tranche IDs to query the proposals:

```shell
QUERY='{"round_proposals":{"round_id": [ROUND_ID],"tranche_id":[TRANCHE_ID],"start_from":0,"limit":100}}'

neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR "$QUERY" --node [NEUTRON_NODE_RPC]
```

## Adding tributes to the Bid

Projects can incentivize users to vote for their proposals by adding tributes to the Bid they've submitted to the Hydro smart contract. Multiple tributes can be added to the same Bid. Tributes are sent in the form of any token amount that the Project is willing to pay to the proposal voters. These tokens will be locked in the Tribute smart contract until the current round ends.

After the round concludes:

-   If the proposal is among the top N by voted power: The entire tribute becomes available for claiming by the voters of that proposal. Each user's portion of the tribute is proportional to their voting power relative to the total voted power for that proposal.
-   If the proposal is not among the top N: The entire tribute can be refunded to the bidding Project.
    To add a tribute to a proposal, send the following transaction to the Tribute smart contract:

```shell
EXECUTE='{"add_tribute":{"tranche_id":[TRANCHE_ID],"proposal_id":[PROPOSAL_ID]}}'

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

## Querying Tributes

To query all tributes for a given proposal, use the following query on the Tribute smart contract:

```shell
QUERY='{"proposal_tributes":{"round_id":[ROUND_ID],"tranche_id":[TRANCHE_ID],"proposal_id":[PROPOSAL_ID],"start_from":0,"limit":100}}'

neutrond q wasm contract-state smart $TRIBUTE_CONTRACT_ADDR "$QUERY" --node [NEUTRON_NODE_RPC]
```

## Refunding proposal tributes

If a proposal is not among the top N by voted power for the given round, the bidding Project can refund the tributes after the round has ended. Only the account that added the tribute is authorized to refund it.

To refund a proposal tribute, send the following transaction to the Tribute smart contract:

```shell
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

## Bidding without a live token

For Projects that do not have a live token and still want to participate in Hydro, there are a few ways.

-   Projects don’t necessarily have to give rewards in their own token; they can pay tribute in any token they desire. So a Project without its own token could in principle pay tribute in ATOM, USDC, OSMO etc. There is no special technical work necessary for this, the Project just submits the tribute with whatever token it desires to pay in.

-   Projects might want to promise Hydro voters a share of the Genesis supply of their token, once it goes live in the future.

### Tributes without a live token

Below are the recommended steps for offering Tributes without a live token:

-   The Project submits a proposal to Hydro. It announces how many rewards will be allocated to voters (e.g. a percentage, such as “0.1% of Genesis supply will be allocated to voters on this proposal”; or a fixed number such as “10000 tokens will be allocated to voters on this proposal during Genesis”. The Project does not submit any tribute via smart contract (because the token is not live yet)
-   During the round, voters vote on the proposal. Voters need to trust that the Project keeps the promise of distributing the allocation as promised once the Genesis happens.
-   After the round, when the Project computes its Genesis balance, it should allocate tokens as promised to voters on the Hydro contract. The contract has an entry point which, given a users address on Neutron and a round/tranche, shows which proposal the user voted on and with how much voting power. Consequently, users need to link their address on the Projects chain with their - Neutron address, and then the Project can query the smart contract to figure out the users voting power, and allocate tokens accordingly.

This strategy can be adjusted for Projects with different particularities.

For example, Projects that already have a pre-token-launch points system would just allocate certain amounts of points among Hydro voters. Projects that launch their token as a smart contract token e.g. on Neutron, and that are happy to launch right after the first round ends, could also create a smart contract on Neutron that automatically lets Hydro voters claim the token from the smart contract. For this, the smart contract would look very similar to the standard Tribute contract we provide, except that the tokens are not escrowed (because they don’t exist yet during the round), but would get minted when voters claim their rewards.

## Information display for Voters

At any moment the following information will be public on the Hydro FE Dashboard for ongoing rounds.

-   Tranches:
    -   The different tranches in which Projects can bid (tranche for ICS Projects & General tranche; in the future, we also plan to add a tranche providing liquidity in USDC, etc)
-   Proposals:
    -   Requests for liquidity submitted by different Projects. These contain:
        -   A description: How will the liquidity that this proposal wins be used (put into an AMM pool, lent out, etc)
        -   The current voting score of the proposal (i.e. how much voting support for the proposal)
        -   The bid: how much reward the Project will split among its voters (this is only paid out if the reward receives any liquidity, which it only does if it gets at least a minimal amount of support)

![Hydro Dashboard](/doc/hydro-voting-dash.png)
