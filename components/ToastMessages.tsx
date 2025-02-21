import { DismissibleToastDescriptor } from "@/components/Toasts/useToasts"
import { pluralize } from "@/lib/pluralize"

export const toastMessages = {
  claimingRewards: {
    variant: "working",
    message: "Claiming rewards...",
  },

  claimingRewardsSuccess: {
    variant: "success",
    message: "Reward claimed! Reload to see changes",
    isDismissible: false,
    actionButtonPrimary: {
      label: "Reload",
      onClick: () => window.location.reload(),
    },
  },

  claimingRewardsError: (error: Error) => {
    return {
      variant: "error",
      message: `Error claiming rewards: ${error}`,
    }
  },

  lockupCapacityFull: {
    variant: "info",
    message: "Oops — there's no longer any capacity to lock. Check back often!",
  },

  lockupExtendRequestRejected: (error: Error) => ({
    variant: "error",
    message: `Request rejected: ${error}`,
  }),

  reloadingTheWindow: {
    variant: "working",
    message: "Reloading...",
  },

  savingLockup: {
    variant: "working",
    message: "Saving lockup...",
  },

  savingLockupSuccess: {
    variant: "success",
    message: "Lockup saved successfully! Reloading...",
  },

  savingLockupError: (error: Error) => ({
    variant: "error",
    message: `Error saving lockup: ${error}`,
  }),

  unlockingExpiredLockups: (count: number) => {
    const lockupOrLockups = pluralize({
      count,
      prefixCount: false,
      singular: "lockup",
    })

    return {
      variant: "working",
      message: `Unlocking ${count} expired ${lockupOrLockups}...`,
    }
  },

  unlockingExpiredLockupsSuccess: (count: number) => {
    const lockupOrLockups = pluralize({
      count,
      prefixCount: false,
      singular: "lockup",
    })

    return {
      variant: "success",
      message: `${count} ${lockupOrLockups} unlocked successfully. See next step!`,
    }
  },

  unlockingExpiredLockupsError: (count: number, error: Error) => {
    const lockupOrLockups = pluralize({
      count,
      prefixCount: false,
      singular: "lockup",
    })

    return {
      variant: "error",
      message: `Error unlocking ${count} ${lockupOrLockups}: ${error}`,
    }
  },

  votingInProgress: {
    variant: "working",
    message: "Processing your vote...",
  },

  votingSuccess: {
    variant: "success",
    message: "Vote cast! Reload to see changes",
    isDismissible: false,
    actionButtonPrimary: {
      label: "Reload",
      onClick: () => window.location.reload(),
    },
  },

  votingError: (error: Error) => ({
    variant: "error",
    message: `Error voting: ${error}`,
  }),

  walletConnectionError: (error: Error) => ({
    variant: "error",
    message: `Error connecting wallet: ${error}`,
  }),

  // AddTribute
  addingTributeInProgress: {
    variant: "working",
    message: "Processing your tribute...",
  },
  addingTributeSuccess: {
    variant: "success",
    message: "Tribute added successfully! Reloading...",
  },
  addingTributeError: (error: Error) => ({
    variant: "error",
    message: `Error adding tribute: ${error}`,
  }),
} satisfies Record<
  string,
  DismissibleToastDescriptor | ((...args: any[]) => DismissibleToastDescriptor)
>
