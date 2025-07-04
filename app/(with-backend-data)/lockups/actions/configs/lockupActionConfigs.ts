import { buyActionConfig } from "./buy"
import { listActionConfig } from "./list"
import { transferActionConfig } from "./transfer"
import { unlistActionConfig } from "./unlist"

// Main registry for all lockup actions.
// Add new actions here.
export const lockupActionConfigs = {
  list: listActionConfig,
  transfer: transferActionConfig,
  buy: buyActionConfig,
  unlist: unlistActionConfig,
} as const
