import { DismissibleToastDescriptor } from "@/components/Toasts/useToasts"
import { pluralize } from "@/lib/pluralize"

export const toastMessages = {
  claimingRewards: {
    variant: "working",
    message: "Claiming rewards in progress.",
  },

  claimingRewardsSuccess: {
    variant: "success",
    message: "Reward claimed succesfully. Reload to see changes.",
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

  lockingTokens: {
    variant: "working",
    message: "Locking tokens...",
  },

   lockingUnavailableTokens: {
    variant: "error",
    message: "Tokens are not available for locking. Please try again later.",
  },

  lockingTokensSuccess: {
    variant: "success",
    message: "Tokens locked successfully! Reload to see changes.",
    actionButtonPrimary: {
      label: "Reload",
      onClick: () => window.location.reload(),
    },
  },

  lockingTokensError: (error: Error) => ({
    variant: "error",
    message: `Error locking tokens: ${error}`,
  }),

  lockupCapacityFull: {
    variant: "info",
    message: "There's no longer capacity to create a lockup.",
  },

  lockupExtendRequestRejected: (error: Error) => ({
    variant: "error",
    message: `Request rejected: ${error}`,
  }),

  reloadingTheWindow: {
    variant: "working",
    message: "Reloading in progress.",
  },

  extendingLockup: {
    variant: "working",
    message: "Extending your lockup in progress.",
  },

  extendingLockupSuccess: {
    variant: "success",
    message: "Lockup extended successfully! Reloading in progress.",
  },

  extendingLockupError: (error: Error) => ({
    variant: "error",
    message: `Error extending lockup: ${error}`,
  }),

  unlockingExpiredLockups: (count: number) => {
    const lockupOrLockups = pluralize({
      count,
      prefixCount: false,
      singular: "lockup",
    })

    return {
      variant: "working",
      message: `Unlocking ${count} expired ${lockupOrLockups} in progress.`,
    }
  },

  unlockingExpiredAtomLockupsSuccess: (count: number) => {
    const lockupOrLockups = pluralize({
      count,
      prefixCount: false,
      singular: "lockup",
    })

    return {
      variant: "success",
      message: `${count} ${lockupOrLockups} unlocked successfully. Continue to next step.`,
    }
  },

  unlockingExpiredStOsmoLockupsSuccess: (count: number) => {
    const lockupOrLockups = pluralize({
      count,
      prefixCount: false,
      singular: "lockup",
    })

    return {
      variant: "success",
      message: `${count} ${lockupOrLockups} unlocked successfully. Reload to see changes.`,
      isDismissible: true,
      actionButtonPrimary: {
        label: "Reload",
        onClick: () => {
          window.location.reload()
        },
      },
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
    message: "Your vote is processing.",
  },

  votingSuccess: {
    variant: "success",
    message: "Vote cast successfully. Reload to see changes.",
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

  transactionCompleted: {
    variant: "success",
    message: "Transaction completed.",
  },

  searchingConvertRoute: {
    variant: "working",
    message: "Searching for route to convert.",
  },

  converting: {
    variant: "working",
    message: "Converting...",
  },

  transactionSigned: (chainID: string) => {
    return {
      variant: "working",
      message: `Transaction signed with chain ID: ${chainID}`,
    }
  },

  validatingGas: (status: string) => {
    return {
      variant: "working",
      message: `Validating gas balance, status: ${status}`,
    }
  },

  transactionTracked: (explorerLink: string) => {
    return {
      variant: "info",
      message: "You can track this transaction",
      isDismissible: false,
      actionButtonPrimary: {
        label: "Track",
        onClick: () => {
          window.open(explorerLink, "_blank")
        },
      },
    }
  },

  transactionError: (error: Error) => {
    return {
      variant: "error",
      message: `Error during transaction: ${error}`,
    }
  },
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

  // Lockup - Transferring
  transferringLockupInProgress: {
    variant: "working",
    message: "Transferring lockup in progress...",
  },
  transferringLockupSuccess: {
    variant: "success",
    message: "Lockup transferred successfully.",
  },
  transferringLockupError: (error: Error) => ({
    variant: "error",
    message: `Failed to transfer lockup: ${error.message}`,
  }),

  // Lockup - Transferring
  listingLockupInProgress: {
    variant: "working",
    message: "Listing lockup in progress...",
  },
  listingLockupSuccess: {
    variant: "success",
    message: "Lockup listed successfully.",
  },
  listingLockupError: (error: Error) => ({
    variant: "error",
    message: `Failed to list lockup: ${error.message}`,
  }),

  // Lockup - Buying
  buyLockupInProgress: {
    variant: "working",
    message: "Buying lockup in progress...",
  },
  buyLockupSuccess: {
    variant: "success",
    message: "Lockup bought successfully.",
  },
  buyLockupError: (error: Error) => ({
    variant: "error",
    message: `Failed to buy lockup: ${error.message}`,
  }),

  // Lockup - Canceling
  cancelLockupInProgress: {
    variant: "working",
    message: "Canceling lockup in progress...",
  },
  cancelLockupSuccess: {
    variant: "success",
    message: "Lockup canceled successfully.",
  },
  cancelLockupError: (error: Error) => ({
    variant: "error",
    message: `Failed to cancel lockup: ${error.message}`,
  }),
} satisfies Record<
  string,
  DismissibleToastDescriptor | ((...args: any[]) => DismissibleToastDescriptor)
>
