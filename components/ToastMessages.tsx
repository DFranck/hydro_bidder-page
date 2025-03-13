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

  unlockingExpiredLockupsSuccess: (count: number) => {
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

  convertingToAtom: {
    variant: "working",
    message: "Converting to ATOM.",
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
} satisfies Record<
  string,
  DismissibleToastDescriptor | ((...args: any[]) => DismissibleToastDescriptor)
>
