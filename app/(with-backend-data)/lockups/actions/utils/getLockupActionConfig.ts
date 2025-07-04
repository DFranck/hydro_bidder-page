import { lockupActionConfigs } from "@/app/(with-backend-data)/lockups/actions/configs/lockupActionConfigs"
import {
  ActionConfig,
  LockupActionPayloadFor,
  LockupActionType,
  LockupTypeForAction,
} from "../types"

export function getLockupActionConfig<T extends LockupActionType>(
  action: T,
): ActionConfig<LockupActionPayloadFor<T>, LockupTypeForAction<T>> {
  return lockupActionConfigs[action] as unknown as ActionConfig<
    LockupActionPayloadFor<T>,
    LockupTypeForAction<T>
  >
}
