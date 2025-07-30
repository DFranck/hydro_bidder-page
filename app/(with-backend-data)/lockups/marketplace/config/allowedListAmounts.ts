import { getParsedEnvNumberList } from "@/lib/getParsedEnvNumberList"

export const allowedListAmounts = getParsedEnvNumberList(
  "NEXT_PUBLIC_NFT_SIZES"
)
