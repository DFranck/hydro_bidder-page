import { getParsedEnvNumberList } from "@/lib/getParsedEnvNumberList"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"

export const NFT_SIZES = getParsedEnvNumberList("NEXT_PUBLIC_NFT_SIZES")

const stATOM = [
  {
    amount: NFT_SIZES[0],
    image: "/images/stATOM/25_Piranha_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[1],
    image: "/images/stATOM/50_Barracuda_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[2],
    image: "/images/stATOM/100_Swordfish_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[3],
    image: "/images/stATOM/250_Shark_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[4],
    image: "/images/stATOM/500_Whale_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[5],
    image: "/images/stATOM/1000_Kraken_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
]

const dATOM = [
  {
    amount: NFT_SIZES[0],
    image: "/images/dAtom/25_Piranha_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[1],
    image: "/images/dAtom/50_Barracuda_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[2],
    image: "/images/dAtom/100_Swordfish_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[3],
    image: "/images/dAtom/250_Shark_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[4],
    image: "/images/dAtom/500_Whale_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: NFT_SIZES[5],
    image: "/images/dAtom/1000_Kraken_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
]

export const NFT_LIST = [...stATOM, ...dATOM].sort(
  (a, b) => a.amount - b.amount
)

export const MINIMUM_SPLIT_AMOUNT = 0.0001

export const MINIMUM_DATOM_AMOUNT = 950000 / 1e6
