export const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === "production"


export const NFT_SIZES_PROD = [25, 50, 100, 250, 500, 1000]
export const NFT_SIZES_STAGING = [0.2, 0.62, 1.3, 1.98, 2.74, 4.26]

export const NFT_SIZES = isProd ? NFT_SIZES_PROD : NFT_SIZES_STAGING