import {
  isProd,
  NFT_SIZES_PROD,
  NFT_SIZES_STAGING,
} from "../../config/nft-sizes"

export const allowedListAmounts = isProd ? NFT_SIZES_PROD : NFT_SIZES_STAGING
