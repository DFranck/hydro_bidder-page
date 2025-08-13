import { Icon } from "@/components/Icon"
import { MarketplaceLockup } from "../../marketplace/types"
import UnlistActionFields from "../components/fields/UnlistActionFields"
import executeRevokeUnlist from "../transactions/executeRevokeUnlist"
import { ActionConfig } from "../types"
import { SupabaseHydroListingUpdate } from "../utils/SupabaseHydroListingUpdate"

// Payload for "unlist" action
export type UnlistPayload = {}

export const unlistActionConfig: ActionConfig<
  UnlistPayload,
  MarketplaceLockup
> = {
  triggerLabel: (
    <>
      <Icon name="light:ban" /> Unlist
    </>
  ),
  submitLabel: (
    <>
      <Icon name="ban" /> Unlist
    </>
  ),
  modalTitle: "Remove from Marketplace",
  FormComponent: UnlistActionFields,
  tooltips: {},
  toasts: {
    processing: "cancelLockupInProgress",
    success: "cancelLockupSuccess",
    error: "cancelLockupError",
  },
  isDisabled: (lockup?: MarketplaceLockup) => {
    if (!lockup) return true
    return false
  },
  isValid: () => true,
  execute: async ({ address, getSigningClient, lockup }) => {
    await executeRevokeUnlist(address, getSigningClient, lockup)
  },
  onSuccess: async (lockup) => {
    const data = await SupabaseHydroListingUpdate(
      lockup.id.toString(),
      "unlist",
    )
    return data
  },
}
