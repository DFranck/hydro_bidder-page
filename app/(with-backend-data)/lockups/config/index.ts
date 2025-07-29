import { TOKEN_DENOMS } from "@/lib/tokenDenoms"

const stATOM = [
  {
    amount: 0.22,
    image: "/images/stATOM/25_Piranha_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: 1.07,
    image: "/images/stATOM/50_Barracuda_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: 100,
    image: "/images/stATOM/100_Swordfish_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: 250,
    image: "/images/stATOM/250_Shark_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: 500,
    image: "/images/stATOM/500_Whale_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
  {
    amount: 1000,
    image: "/images/stATOM/1000_Kraken_stATOM@4x.png",
    baseDenom: TOKEN_DENOMS.stATOM.denom,
    displayDenom: TOKEN_DENOMS.stATOM.displayDenom,
  },
]

const dATOM = [
  {
    amount: 3,
    image: "/images/dAtom/25_Piranha_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: 50,
    image: "/images/dAtom/50_Barracuda_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: 100,
    image: "/images/dAtom/100_Swordfish_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: 250,
    image: "/images/dAtom/250_Shark_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: 500,
    image: "/images/dAtom/500_Whale_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
  {
    amount: 1000,
    image: "/images/dAtom/1000_Kraken_dATOM@4x.png",
    baseDenom: TOKEN_DENOMS.dATOM.denom,
    displayDenom: TOKEN_DENOMS.dATOM.displayDenom,
  },
]

export const NFT_LIST = [...stATOM, ...dATOM].sort(
  (a, b) => a.amount - b.amount
)

export const NFT_SIZES = [25, 50, 100, 200, 500, 1000]
