import { RAW_FEED } from "./raw_feed"

export const FEED_COINS_BY_SYMBOL: Map<
    string,
    { name: string; api_id: string }
> = new Map(Object.entries(JSON.parse(JSON.stringify(RAW_FEED))))
