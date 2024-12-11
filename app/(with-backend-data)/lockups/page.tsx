"use client"

import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ContentContainer } from "@/components/ContentContainer"
import { EditLockupDurationModal } from "@/components/EditLockupDurationModal"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { ProgressBar } from "@/components/ProgressBar"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { StyledText } from "@/components/StyledText"
import { Toasts, useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  networkLimitReachedTooltip as lockupLimitReachedByNetworkTooltip,
  lockupLimitReachedByUserTooltip,
  lockupLimitTooltip,
} from "@/components/ToolTips"
import { executeWalletUnlockExpired } from "@/contract-apis/executeWalletUnlockExpired"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeUntilDate } from "@/lib/getTimeUntilDate"
import { pluralize } from "@/lib/pluralize"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LockupsPage() {
  const { incompleteNotices } = useIncompleteNotices()
  const router = useRouter()
  const [isConfirmingUnlockExpired, setIsConfirmingUnlockExpired] =
    useState(false)
  const [isShowingNextStep, setIsShowingNextStep] = useState(false)
  const {
    address,
    lockups,
    lockedAtomMaxWallet,
    lockedAtomPercentageGlobal,
    lockedAtomPercentageWallet,
    lockedAtomTotalWallet,
  } = useBackendData()
  const { getSigningCosmWasmClient } = useChain("neutron")
  const { setToasts } = useToasts()
  const expiredLockups = lockups.filter(
    (lockup) => new Date() >= lockup.dateEnd
  )

  async function handleClickToNextUnlockingStep() {
    router.push("/lock-atom")
    router.refresh()
  }

  function handleClickUnlockExpired() {
    setIsConfirmingUnlockExpired(true)
  }

  async function executeUnlockExpired() {
    if (expiredLockups.length === 0) {
      return
    }

    setIsConfirmingUnlockExpired(false)

    const pluralizedLockupText = pluralize({
      count: expiredLockups.length,
      prefixCount: true,
      singular: "expired lockup",
    })

    try {
      setToasts([
        {
          variant: "working",
          message: `Unlocking ${pluralizedLockupText}...`,
        },
      ])

      await executeWalletUnlockExpired({
        address,
        getSigningCosmWasmClient,
      })

      await revalidateTag("backendData")

      setToasts([
        {
          variant: "info",
          message: `${pluralizedLockupText} unlocked successfully. See next step!`,
          isDismissible: true,
        },
      ])

      setIsShowingNextStep(true)
    } catch (error) {
      setToasts([
        {
          variant: "error",
          message: `Error unlocking ${pluralizedLockupText}: ${error}`,
        },
      ])
    }
  }

  function handleModalWindowClose() {
    setIsConfirmingUnlockExpired(false)
  }

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundAtomLockedGlobal />
        <StatCards.CurrentRoundAtomLockedWallet />
        <StatCards.CurrentRoundVotingPowerWallet />
      </StatCards>

      <ContentContainer className="gap-6 py-6">
        <div
          className="
            flex
            flex-col
            justify-end
            gap-3
            lg:flex-row
          "
        >
          <h2 className="sr-only">Your Lockups</h2>

          <div
            className="
              flex
              flex-col
              items-end
              justify-end
              gap-6
              md:flex-row
              md:items-center
            "
          >
            <Tooltip
              tipContents={lockupLimitTooltip}
              className="block w-96 shrink-0"
            >
              <ProgressBar
                percentage={lockedAtomPercentageWallet}
                warningZone={(percentage) => percentage >= 75}
                dangerZone={(percentage) => percentage >= 95}
              >
                <div className="flex items-center gap-1">
                  <span>
                    {lockedAtomTotalWallet.toFixed(4).replace(".0000", "")} /{" "}
                    {lockedAtomMaxWallet} ATOM max
                  </span>
                  <span>
                    <Icon name="circle-info" />
                  </span>
                </div>
              </ProgressBar>
            </Tooltip>

            {expiredLockups.length > 0 && (
              <StyledText
                as="button"
                variant="button.secondary"
                className="flex items-center gap-1"
                onClick={handleClickUnlockExpired}
              >
                <Icon name="solid:lock-open" />
                Unlock {expiredLockups.length} Expired
              </StyledText>
            )}

            <ConditionalWrapper
              condition={
                lockedAtomPercentageWallet === 100 ||
                lockedAtomPercentageGlobal === 100
              }
              wrapper={(children) => (
                <Tooltip
                  classNamesForTooltip="-ml-12"
                  tipContents={
                    lockedAtomPercentageWallet === 100
                      ? lockupLimitReachedByUserTooltip
                      : lockupLimitReachedByNetworkTooltip
                  }
                >
                  <div
                    className="
                      pointer-events-none
                      cursor-not-allowed
                      opacity-50
                    "
                  >
                    {children}
                  </div>
                </Tooltip>
              )}
            >
              <StyledText as={Link} variant="button.primary" href="/lock-atom">
                New Lockup
              </StyledText>
            </ConditionalWrapper>
          </div>
        </div>

        <BlurryBackdropBox className="flex flex-col gap-6">
          {lockups.length === 0 && (
            <EmptyBox className="flex flex-col gap-1">
              <div>
                You don&rsquo;t have any lockups yet. To create one, click the
                &ldquo;New Lockup&rdquo; button&nbsp;
                <Icon name="arrow-up-right" />
              </div>
              <div>
                <StyledText
                  as={Link}
                  variant="link"
                  href="/docs/users/locking-lsm-shares"
                  target="_blank"
                  className="flex items-center gap-1 text-xs"
                >
                  <span>Learn more about Lockups</span>{" "}
                  <Icon name="arrow-up-right-from-square" />
                </StyledText>
              </div>
            </EmptyBox>
          )}

          {incompleteNotices.length > 0 && (
            <Toasts.Toast variant="error" isDismissible={false}>
              <p>
                You have {incompleteNotices.length} incomplete lockups.{" "}
                <StyledText
                  variant="link"
                  as={Link}
                  href="/lock-atom"
                  // className="text-palette-text/70 hover:text-palette-text"
                >
                  Review Incomplete Lockups <Icon name="arrow-right-long" />
                </StyledText>
              </p>
            </Toasts.Toast>
          )}

          {lockups.length > 0 && (
            <StyledTable
              columns={[
                {
                  key: "lockedATOM",
                  label: "Locked ATOM",
                  isSortable: true,
                },
                {
                  key: "multiplier",
                  label: "Multiplier",
                  isSortable: true,
                  textAlign: "right",
                },
                {
                  key: "votingPower",
                  label: "Voting Power",
                  isSortable: true,
                  textAlign: "right",
                },
                {
                  key: "endDate",
                  label: "End Date",
                  isSortable: true,
                  textAlign: "right",
                  customValueGetter: (row) => {
                    return row._lockup.dateEnd?.getTime() ?? 0
                  },
                },
                {
                  key: "actions",
                  label: "Actions",
                  textAlign: "right",
                },
              ]}
              initialSortedColumnKey="endDate"
              rows={lockups.map((lockup) => {
                const isExpired = new Date() > lockup.dateEnd
                return {
                  _lockup: lockup,
                  lockedATOM: <>{lockup.funds.amount} ATOM</>,
                  multiplier: <>{lockup.multiplier.toPrecision(3)} &times;</>,
                  votingPower: formatAmount(lockup.currentVotingPower),
                  endDate: (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        {isExpired && (
                          <Icon name="solid:triangle-exclamation" />
                        )}
                        {lockup.dateEnd.toLocaleString("en", {
                          dateStyle: "medium",
                        })}{" "}
                      </div>
                      <StyledText variant="footnote">
                        {isExpired
                          ? "Expired"
                          : getTimeUntilDate(lockup.dateEnd)}
                      </StyledText>
                    </div>
                  ),
                  actions: <EditLockupDurationModal lockup={lockup} />,
                }
              })}
            />
          )}
        </BlurryBackdropBox>
      </ContentContainer>

      <ModalWindow
        isOpen={isConfirmingUnlockExpired}
        onClose={handleModalWindowClose}
      >
        <Card>
          <Card.Header>Refresh Lockups you Want to Keep</Card.Header>
          <Card.Body>
            <p>
              Before proceeding to unlock, be sure to refresh any lockups that
              you want to keep. If you do not refresh before proceeding you will
              be unlocking all of your lockups and will lose all of your voting
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
            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() => setIsConfirmingUnlockExpired(false)}
            >
              Cancel
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>

      <ModalWindow
        isOpen={isShowingNextStep}
        onClose={() => setIsShowingNextStep(false)}
      >
        <Card>
          <Card.Header>Unlocked! Next, Revert</Card.Header>
          <Card.Body>
            <p>You will now be able to revert your lockups on the next step:</p>
          </Card.Body>
          <Card.Footer>
            <StyledText
              as="button"
              variant="button.primary"
              onClick={handleClickToNextUnlockingStep}
              className="flex items-center gap-1"
            >
              <span>Show Revertible Lockups</span>
              <Icon name="arrow-right-long" />
            </StyledText>
          </Card.Footer>
        </Card>
      </ModalWindow>
    </>
  )
}
