"use client"

import { Card } from "@/components/Card"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts/useToasts"
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { useBackendData } from "@/contract-apis/useBackendData"
import { pluralize } from "@/lib/pluralize"
import { useChain } from "@cosmos-kit/react"

export function ModalWindowToUnlockExpiredLockups({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const { lockups } = useBackendData()
  const { setToasts } = useToasts()
  const { address, getSigningCosmWasmClient } = useChain("neutron")

  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd,
  )

  async function executeUnlockExpired() {
    if (expiredLockups.length === 0) {
      return
    }

    if (!address) {
      throw new Error("Address not found")
    }

    onClose()

    try {
      setToasts([toastMessages.unlockingExpiredLockups(expiredLockups.length)])

      await executeWalletUnlockExpired({
        address,
        getSigningCosmWasmClient,
        lockIds: expiredLockups.map((lockup) => lockup.id),
      })

      await fetch("/api/revalidate-tag", {
        method: "POST",
        body: JSON.stringify({ tag: "backendData" }),
      })

      onSuccess()
    } catch (error) {
      setToasts([
        toastMessages.unlockingExpiredLockupsError(
          expiredLockups.length,
          error as Error,
        ),
      ])
    }
  }

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose}>
      <Card>
        <Card.Header>Refresh Lockups you Want to Keep</Card.Header>
        <Card.Body>
          <p>
            Before proceeding to unlock, be sure to refresh any lockups that you
            want to keep. If you do not refresh before proceeding you will be
            unlocking all of your lockups and will lose all of your voting
            power.
          </p>
          <p>
            Unlock{" "}
            {pluralize({
              count: expiredLockups.length,
              prefixCount: true,
              singular: "expired lockup",
            })}
            ?
          </p>
        </Card.Body>
        <Card.Footer>
          <StyledText
            as="button"
            variant="button.primary"
            onClick={executeUnlockExpired}
          >
            Unlock
          </StyledText>
          <StyledText as="button" variant="button.secondary" onClick={onClose}>
            Cancel
          </StyledText>
        </Card.Footer>
      </Card>
    </ModalWindow>
  )
}
