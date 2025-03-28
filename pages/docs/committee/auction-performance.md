# Auction Performance

By [Trix](https://x.com/brane_trix). The full write-up is available [here](https://docs.google.com/document/d/1EYtyF2POFdOskPmCXDN6braImI1FBAxkq-HFIhVqmWg/edit?usp=sharing).

## Committee Goals

The committee aims to gather information and figure out what optimization/collusion protection solutions can be added to Hydro with low effort, e.g 
- How many auctions can be run concurrently? 
- Can subsets of export whitelists be assigned to auctions? 
- Can we set specific export parameters (i.e., duration) per auction?

The collusion & performance solutions described in the full write-up revolve mainly around creating more bid groups to maximize the performance of each export auction. This will require an initial period to monitor the yield appetite for auctions, build a collusion detector, and garner feedback from bidders to determine what changes would increase their demand to bid for exports. The overarching goal for “Auction Performance” is creating an environment where bidders are ecstatic to bid, and voters are excited to front the opportunity costs of locking to direct Hub capital. Yield to voters. Value to bidders.



## Bidder strategies

**Gradual Increase of Bids**: Without historical data, projects won’t know how many votes they may get for a bid amount. Since they can increase their bid and voters can switch votes whenever they want, a good strategy would be to start low and add more tokens over time to attract the necessary votes. This strategy may not work well if voters vote once and leave or wait until the end of the round to vote (knowing projects can always add more tokens).

**Precise Total Vote Goals**: As the auctions get more sophisticated and the projects earn reputation, they may begin to add bids only to target specific vote totals in order to target minimum export amounts. With the export allocation cap and the vote-weighted export totals, it’s not necessary to win as many votes as possible as long as the projects are winning a total export they deem valuable.