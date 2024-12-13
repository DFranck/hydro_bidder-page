"use client"

import { LockForm } from "@/app/(with-backend-data)/lock-atom/components/LockForm"
import { useIncompleteNotices } from "@/app/(with-backend-data)/lock-atom/useIncompleteNotices"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useState } from "react"
import { classNames } from "../classNames"
import { ContinueFromHubStepper } from "../steppers/ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "../steppers/ContinueFromNeutronStepper"
import { LockStepper } from "../steppers/LockStepper"
import { RevertFromHubStepper } from "../steppers/RevertFromHubStepper"
import { RevertFromNeutronStepper } from "../steppers/RevertFromNeutronStepper"
import { Stepper } from "../types"
import { HubIncompleteNotice } from "./HubIncompleteNotice"
import { LoaderCard } from "./LoaderCard"
import { NeutronIncompleteNotice } from "./NeutronIncompleteNotice"

export function LsmInteraction({
  validatorMap,
}: {
  validatorMap: Map<string, Validator>
}) {
  const { lockedAtomIsAtCapacityGlobal: lockedAtomIsAtGlobalCapacity } =
    useBackendData()
  const {
    hubChain,
    hubSigner,
    neutronChain,
    neutronSigner,
    incompleteNotices,
    deleteIncompleteNotice,
  } = useIncompleteNotices()
  const [stepper, setStepper] = useState<Stepper | undefined>(undefined)
  const [visibleNotices, setVisibleNotices] = useState(2)

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
          {incompleteNotices.slice(0, visibleNotices).map((notice, index) => (
            <div key={index}>
              {notice.type === "LSMSharesOnHub" && (
                <HubIncompleteNotice
                  amount={notice.amount}
                  validator={notice.validator}
                  validatorMap={validatorMap}
                  denom={notice.denom}
                  setStepper={setStepper}
                />
              )}
              {notice.type === "LSMSharesOnNeutron" && (
                <NeutronIncompleteNotice
                  amount={notice.amount}
                  validator={notice.validator}
                  validatorMap={validatorMap}
                  denom={notice.denom}
                  baseDenom={notice.baseDenom}
                  setStepper={setStepper}
                />
              )}
            </div>
          ))}

          {incompleteNotices.length > 2 &&
            visibleNotices < incompleteNotices.length && (
              <StyledText
                as="button"
                variant="link.subtle"
                onClick={() => setVisibleNotices(incompleteNotices.length)}
              >
                Show {incompleteNotices.length - visibleNotices} more
              </StyledText>
            )}

          {lockedAtomIsAtGlobalCapacity ? (
            <BlurryBackdropBox className="p-6">
              <p>
                Hydro is currently at max capacity. Please wait for the next
                round to start.
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
