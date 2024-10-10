# Pilot Rounds

As we prepare for Hydro's full launch, we are initiating a series of Pilot Rounds to test the platform, gather valuable feedback, and ensure everything is functioning as expected before deploying the total liquidity. 

The primary goal of the Pilot Round is to test all critical features of Hydro, including the voting mechanism, project bidding process, and liquidity deployment. We encourage all users to actively participate in this process by joining our Telegram channel. 

The Pilot Round's smaller scale also gives us a better sense of the bidding dynamics. More generally, it’s an opportunity to thoroughly test the processes, from project setup to liquidity deployment, covering the experience of bidders, voters, and the Hydro committee. This document outlines the critical specifics of the Pilot Round and what users can expect.

## Tranches
A tranche is a pool of liquidity for which projects compete. Each project submits a bid, and users vote to decide how the available funds are distributed.

There will not be an ICS tranche during the Pilot Round. This will simplify the flow for users and reduce the workload of the Hydro committee, which is currently operating on a volunteer basis. Additionally, the Pilot Round has no projects directly consuming security from the Hub using ICS.

## Committee management
During Hydro’s pilot round, the Committee will be given decision-making authority on key parts of the allocation & deployment process. 

One such element is the **top-N feature**. All votes are tallied in each round, and the top projects are selected to receive liquidity from the Hydro pool. Projects that do not rank within the top 'n' will have their tribute refunded. This mechanism optimizes liquidity deployment and protects against potential Denial-of-Service (DoS) attacks. To maintain flexibility, the Hydro committee can set 'n' to a high value, such as 100, to effectively remove the cap if necessary.

Once the top projects are selected, the committee must initiate a series of smart contract messages to process the liquidity exports for the winners. This manual oversight ensures that the liquidity is properly deployed while preventing small, time-consuming deployments. 

## Voting Power
During the pilot round, users will only be able to lock their staked ATOM for the duration of one round, i.e., one month. This is to minimize the risks associated with users getting locked for several months as Hydro iterates quickly. As the protocol becomes more stable and progresses toward regular rounds, users will gain the ability to choose longer lock periods, granting them more voting power relative to the amount of staked ATOM.
