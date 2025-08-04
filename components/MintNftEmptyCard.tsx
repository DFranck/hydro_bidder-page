import React from "react"
import { StyledText } from "./StyledText"
import Link from "next/link"
import { Icon } from "./Icon"

const MintNftEmptyCard = () => {
  return (
    <p className=" text-gray-400">
      <span>
        {" "}
        To mint an NFT, you need lockups of stATOM, dATOM, or ATOM liquid-staked
        to a validator that can be converted into dATOM. Only validators that
        <StyledText
          variant="link"
          href="https://app.drop.money/stake?denom=uatom"
          as={Link}
          className="mx-1.5"
        >
          <span> you can directly stake your staked balance with via Drop</span>
          <Icon name="arrow-up-right-from-square" />
        </StyledText>
        are eligible.
      </span>

      <span>
        You can also visit the
        <StyledText
          variant="link"
          href="/lockups/marketplace"
          as={Link}
          className="mx-1.5"
        >
          <span>marketplace</span>
        </StyledText>{" "}
        to buy a lockup.
      </span>
    </p>
  )
}

export default MintNftEmptyCard
