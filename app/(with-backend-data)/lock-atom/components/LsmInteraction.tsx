"use client"

import { LockForm } from "@/app/(with-backend-data)/lock-atom/components/LockForm"
import { getValidatorMoniker } from "@/app/(with-backend-data)/lock-atom/functions/getValidatorMoniker"
import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Toast } from "@/components/Toasts/Toast"
import { Tooltip } from "@/components/Tooltip"
import { cannotContinueLockupTooltip } from "@/components/ToolTips"
import { HYDRO_TELEGRAM_URL } from "@/config"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { formatAmount } from "@/lib/formatAmount"
import Link from "next/link"
import { useState } from "react"
import { twJoin } from "tailwind-merge"
import { classNames } from "../classNames"
import { ContinueFromHubStepper } from "../steppers/ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "../steppers/ContinueFromNeutronStepper"
import { LockStepper } from "../steppers/LockStepper"
import { RevertFromHubStepper } from "../steppers/RevertFromHubStepper"
import { RevertFromNeutronStepper } from "../steppers/RevertFromNeutronStepper"
import { Stepper } from "../types"
import { LoaderCard } from "./LoaderCard"

export function LsmInteraction({
  validatorMap,
}: {
  validatorMap: Map<string, Validator>
}) {
  const {
    lockedAtomIsAtCapacityGlobal,
    lockedAtomIsAtCapacityWallet,
    lockedAtomRemainingCapacityGlobal,
  } = useBackendData()
  const {
    hubChain,
    hubSigner,
    neutronChain,
    neutronSigner,
    incompleteNotices,
  } = useIncompleteNotices()
  const [stepper, setStepper] = useState<Stepper | undefined>(undefined)
  const [numVisibleNotices, setVisibleNotices] = useState(2)

  return (
    (hubSigner && neutronSigner && (
      <div>
        {stepper && stepper.type === "lock" && (
          <div className={classNames.fixedOverlay}>
            <LockStepper
              amount={stepper.amount}
              validator={stepper.validator}
              lockDuration={stepper.duration}
              onExit={() => setStepper(undefined)}
            />
          </div>
        )}
        {stepper && stepper.type === "revertFromHubLSM" && (
          <div className={classNames.fixedOverlay}>
            <RevertFromHubStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
            />
          </div>
        )}
        {stepper && stepper.type === "revertFromNeutronLSM" && (
          <div className={classNames.fixedOverlay}>
            <RevertFromNeutronStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              baseDenom={stepper.baseDenom}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
            />
          </div>
        )}
        {stepper && stepper.type === "continueFromHubLSM" && (
          <div className={classNames.fixedOverlay}>
            <ContinueFromHubStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
            />
          </div>
        )}
        {stepper && stepper.type === "continueFromNeutronLSM" && (
          <div className={classNames.fixedOverlay}>
            <ContinueFromNeutronStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
            />
          </div>
        )}
        <div className="flex flex-col gap-6">
          {incompleteNotices.length >= 1 && (
            <>
              {incompleteNotices
                .slice(0, numVisibleNotices)
                .map((notice, index) => {
                  const canFinalizeLockup =
                    lockedAtomRemainingCapacityGlobal >=
                    Number((Number(notice.amount) / 10 ** 6).toFixed(6))

                  function getStepperConfigForAction(
                    action: "continue" | "revert"
                  ) {
                    const baseConfig = {
                      validator: notice.validator,
                      amount: notice.amount,
                      denom: notice.denom,
                    }

                    const source =
                      notice.type === "LSMSharesOnHub" ? "Hub" : "Neutron"
                    const type = `${action}From${source}LSM` as const
                    return (
                      source === "Neutron"
                        ? { ...baseConfig, type, baseDenom: notice.baseDenom }
                        : { ...baseConfig, type }
                    ) as any
                  }

                  return (
                    <Toast
                      variant="warning"
                      key={index}
                      actionButtonPrimary={{
                        label: (
                          <ConditionalWrapper
                            condition={!canFinalizeLockup}
                            wrapper={(children) => (
                              <Tooltip
                                tipContents={cannotContinueLockupTooltip}
                              >
                                {children}
                              </Tooltip>
                            )}
                          >
                            <div
                              className={twJoin(
                                "flex items-center justify-center gap-1",
                                !canFinalizeLockup &&
                                  "cursor-default opacity-60"
                              )}
                            >
                              Resume <Icon name="arrow-right-long" />
                            </div>
                          </ConditionalWrapper>
                        ),
                        onClick: () => {
                          if (!canFinalizeLockup) return
                          setStepper(getStepperConfigForAction("continue"))
                        },
                      }}
                      actionButtonSecondary={{
                        label: (
                          <div className="flex items-center justify-center gap-1">
                            <Icon name="rotate-left" /> Revert
                          </div>
                        ),
                        onClick: () => {
                          setStepper(getStepperConfigForAction("revert"))
                        },
                      }}
                    >
                      <strong>{formatAmount(notice.amount)} ATOM</strong> staked
                      with{" "}
                      <strong>
                        {getValidatorMoniker(notice.validator, validatorMap)}
                      </strong>{" "}
                      is not fully locked
                    </Toast>
                  )
                })}

              {incompleteNotices.length > 2 &&
                numVisibleNotices < incompleteNotices.length && (
                  <StyledText
                    as="button"
                    variant="link.subtle"
                    onClick={() => setVisibleNotices(incompleteNotices.length)}
                  >
                    Show {incompleteNotices.length - numVisibleNotices} more
                  </StyledText>
                )}
            </>
          )}

          {lockedAtomIsAtCapacityWallet ? (
            <BlurryBackdropBox className="p-6">
              <p>
                You&rsquo;ve reached the maximum of ATOM you can lock for this
                pilot round.
              </p>
            </BlurryBackdropBox>
          ) : lockedAtomIsAtCapacityGlobal ? (
            <BlurryBackdropBox className="p-6">
              <p>
                Hydro is currently at max capacity. Please wait for the next
                round or for the cap to be increased. Check{" "}
                <StyledText as={Link} href={HYDRO_TELEGRAM_URL} variant="link">
                  Telegram
                </StyledText>{" "}
                for updates.
              </p>
            </BlurryBackdropBox>
          ) : (
            <LockForm
              onSubmit={(validator, amount, duration) =>
                setStepper({
                  type: "lock",
                  validator,
                  amount,
                  duration,
                })
              }
              hubChain={hubChain}
              validatorMap={validatorMap}
            />
          )}
        </div>
      </div>
    )) || (
      <LoaderCard
        haveChains={!!hubChain || !!neutronChain}
        address={hubChain?.address || null}
      />
    )
  )
}
