const stATOM = [
  {
    amount: 0.15,
    image: "/images/stATOM/25_Piranha_stATOM@4x.png",
    baseDenom:
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
    displayDenom: "stATOM",
  },
  {
    amount: 1.07,
    image: "/images/stATOM/50_Barracuda_stATOM@4x.png",
    baseDenom:
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
    displayDenom: "stATOM",
  },
  {
    amount: 100,
    image: "/images/stATOM/100_Swordfish_stATOM@4x.png",
    baseDenom:
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
    displayDenom: "stATOM",
  },
  {
    amount: 250,
    image: "/images/stATOM/250_Shark_stATOM@4x.png",
    baseDenom:
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
    displayDenom: "stATOM",
  },
  {
    amount: 500,
    image: "/images/stATOM/500_Whale_stATOM@4x.png",
    baseDenom:
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
    displayDenom: "stATOM",
  },
  {
    amount: 1000,
    image: "/images/stATOM/1000_Kraken_stATOM@4x.png",
    baseDenom:
      "ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C",
    displayDenom: "stATOM",
  },
]

const dATOM = [
  {
    amount: 0.008926,
    image: "/images/dAtom/25_Piranha_dATOM@4x.png",
    baseDenom:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    displayDenom: "dATOM",
  },
  {
    amount: 50,
    image: "/images/dAtom/50_Barracuda_dATOM@4x.png",
    baseDenom:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    displayDenom: "dATOM",
  },
  {
    amount: 100,
    image: "/images/dAtom/100_Swordfish_dATOM@4x.png",
    baseDenom:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    displayDenom: "dATOM",
  },
  {
    amount: 250,
    image: "/images/dAtom/250_Shark_dATOM@4x.png",
    baseDenom:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    displayDenom: "dATOM",
  },
  {
    amount: 500,
    image: "/images/dAtom/500_Whale_dATOM@4x.png",
    baseDenom:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    displayDenom: "dATOM",
  },
  {
    amount: 1000,
    image: "/images/dAtom/1000_Kraken_dATOM@4x.png",
    baseDenom:
      "factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom",
    displayDenom: "dATOM",
  },
]

export const NFT_LIST = [...stATOM, ...dATOM].sort(
  (a, b) => a.amount - b.amount
)

export const NFT_SIZES = [25, 50, 100, 200, 500, 1000]
