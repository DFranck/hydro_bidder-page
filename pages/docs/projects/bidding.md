# Bidding process

## Bid submission

At the beginning of the auction round, projects submit their bid to the Hydro smart contract and post their Tribute token. Projects can choose any type of token for bidding purposes; it does not have to be the project's native token. For example, a project could pay a tribute in USDC. After the auction round ends, the tribute is automatically distributed to all voters who supported the Project's bid.

During the auction round, projects can increase the amount of tribute to attract more support. Once increased, the amount cannot be decreased. This rule prevents scenarios where a project might offer a high tribute to gain votes and then reduce it before the round ends.

Before submitting a proposal, projects choose the tranche ID you want to participate in. Information about tranches can be obtained from the Hydro smart contract using the following CLI command:

`neutrond q wasm contract-state smart $HYDRO_CONTRACT_ADDR '{"tranches": {}}' --node [NEUTRON_NODE_RPC]`

Submit a bid in the current auction round using the following CLI command:

```
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

## Bids without Tokens

Some projects may not have a live token with which to bid. In that case, the simple option is to bid with another token (e.g., ATOM, USDC, OSMO, etc.). No technical work is required: the project simply submits the tribute with the token it desires to pay.

### Genesis Allocation

Another option is to give Hydro voters a small share of the genesis supply of a future token. In that case, the project may submit a bid that announces how many tokens will be allocated to voters. This could be a percentage (_“0.1% of Genesis supply will be allocated to voters”_) or a fixed number (_“10000 tokens will be allocated to voters on this proposal during Genesis”_). During the round, voters must trust that the project keeps the promise of distributing the allocation. After Genesis, the project computes its balance and allocates tokens. The Hydro contract has an entry point which, given a user’s address on Neutron, round & tranche, shows which proposal the user voted on and with how much voting power. The project can query the smart contract to determine the users' voting power and allocate tokens accordingly.

### Points Systems

Some projects may have a pre-token-launch points system. In that case, they would just allocate specific points among Hydro voters. Projects that launch their token as a smart contract token, e.g., on Neutron, and are happy to launch right after the first round ends could also create a smart contract on Neutron that automatically lets Hydro voters claim the token from the smart contract. For this, the smart contract would look very similar to the standard Tribute contract we provide, except that the tokens are not escrowed (because they don’t exist yet during the round) but would get minted when voters claim their rewards.
