import PocketBase from "pocketbase";

// source: https://github.com/pocketbase/js-sdk/issues/69#issuecomment-1326840765

export const PB = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
