# Hydro APR Explained

Hydro gives the ATOM community the ability to lock their staked ATOM to decide on the allocation of liquidity. Projects submit bids, ATOM stakers vote for projects and receive tributes from the projects they vote for.

## The APR components 
The APR number displayed in the Hydro has two components:
- The **staking APR** is the standard inflationary reward you already earn from staking your ATOM. It's the same familiar Cosmos Hub staking APR that all ATOM stakers already receive from their contribution to network security. 
- The **tribute APR** is the hydro-specific APR originating from the tributes posted by projects looking to receive liquidity via Hydro. Projects post tributes as an incentive for Hydro voters to support them. 


## The Tribute APR

### Top APR 
The [Hydro voting page](https://hydro.cosmos.network/voting) displays the best APR currently available to any voter at any point in time. It is calculated using the most favorable ratio between a tribute size and the amount of voting power backing the corresponding bid. The exact formula is:

$\text{Top APR} = \max_{i \in \text{bids}} \left(\frac{\text{Tribute value}_i}{\text{Voting power}_i}\right) \times 12$

Note that this max available APR may change drastically throughout a round:
- It will increase if projects increase their tributes
- It will decrease if more voters lock and vote for projects

It also may not match your user-specific APR, which is based on the project bid you’ve selected, specifically, the tribute attached to the bid and your share of the voting power supporting the bid. The user-specific APR number is not currently displayed in the Hydro interface but will likely be added later.

Keep in mind that the Top APR is very dynamic. It is a snapshot at a particular point in time. The APR changes as more users vote or lock their ATOM or as projects increase their tributes. It is nearly guaranteed that you will have an APR that is **more** or **less** than the number displayed.

Some projects might bid using points rather than tradable tokens, which can influence the APR. The APR calculation assumes tributes are paid in tokens that can be traded or sold.

### Historical APR
After the first pilot round, Hydro will start displaying historical APRs. These will likely give users a more realistic view of the expected end-of-round performance. 
The historical APR is calculated based on the average Hydro voter APR of the last round. The exact formula is: 
 
$\text{Historical APR} = \frac{\sum_{i \in \text{bids}} {\text{tribute value}_i}}{\text{total atom value}_i} \times 12$

The interface will display APRs based on the last month, the last three months, and the last year.