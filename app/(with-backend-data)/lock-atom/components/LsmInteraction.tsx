"use client"

import { LockForm } from "@/app/(with-backend-data)/lock-atom/components/LockForm"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { StyledText } from "@/components/StyledText"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { SigningStargateClient } from "@cosmjs/stargate"
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"
import { classNames } from "../classNames"
import { ContinueFromHubStepper } from "../steppers/ContinueFromHubStepper"
import { ContinueFromNeutronStepper } from "../steppers/ContinueFromNeutronStepper"
import { LockStepper } from "../steppers/LockStepper"
import { RevertFromHubStepper } from "../steppers/RevertFromHubStepper"
import { RevertFromNeutronStepper } from "../steppers/RevertFromNeutronStepper"
import { checkForHubLSMShares } from "../transactions/checkForHubLSMShares"
import { checkForNeutronLSMShares } from "../transactions/checkForNeutronLSMShares"
import { IncompleteNotice, Stepper } from "../types"
import { HubIncompleteNotice } from "./HubIncompleteNotice"
import { LoaderCard } from "./LoaderCard"
import { NeutronIncompleteNotice } from "./NeutronIncompleteNotice"

export function LsmInteraction({
  validatorMap,
}: {
  validatorMap: Map<string, Validator>
}) {
  const { isAtMaxLockupCapacity } = useBackendData()
  const hubChain = useChain("cosmoshub")
  const neutronChain = useChain("neutron")
  const [hubSigner, setHubSigner] = useState<SigningStargateClient | undefined>(
    undefined
  )
  const [neutronSigner, setNeutronSigner] = useState<
    SigningStargateClient | undefined
  >(undefined)
  const [stepper, setStepper] = useState<Stepper | undefined>(undefined)
  const [visibleNotices, setVisibleNotices] = useState(2)
  const [incompleteNotices, setIncompleteNotices] = useState<
    IncompleteNotice[]
  >([])

  function deleteIncompleteNotice(denom: string, amount: string) {
    setIncompleteNotices((prevNotices) =>
      prevNotices.filter(
        (notice) => !(notice.denom === denom && notice.amount === amount)
      )
    )
  }

  useEffect(() => {
    if (hubChain.address) {
      hubChain.getSigningStargateClient().then(setHubSigner)
    }
    if (neutronChain.address) {
      neutronChain.getSigningStargateClient().then(setNeutronSigner)
    }
  }, [hubChain.address, neutronChain.address])

  useEffect(() => {
    const checkLSMShares = async () => {
      let newIncompleteNotices: IncompleteNotice[] = []
      if (hubSigner && neutronSigner) {
        const hubShares = await checkForHubLSMShares(hubChain, hubSigner)
        hubShares.forEach((share) => {
          newIncompleteNotices.push({
            type: "LSMSharesOnHub",
            validator: share.validator,
            amount: share.amount,
            denom: share.denom,
          })
        })

        const neutronShares = await checkForNeutronLSMShares(
          neutronChain,
          neutronSigner
        )
        neutronShares.forEach((share) => {
          newIncompleteNotices.push({
            type: "LSMSharesOnNeutron",
            validator: share.validator,
            amount: share.amount,
            denom: share.denom,
            baseDenom: share.baseDenom,
          })
        })
      }

      // filter out incomplete notices whose amount is < 100uatom
      // since very small amounts sometimes cannot be redeemed
      newIncompleteNotices = newIncompleteNotices.filter(
        (notice) => parseInt(notice.amount) >= 100
      )

      setIncompleteNotices(newIncompleteNotices)
    }

    checkLSMShares()
  }, [hubSigner, neutronSigner])

  return (
    (hubSigner && neutronSigner && (
      <div>
        {stepper && stepper.type === "lock" && (
          <div className={classNames.fixedOverlay}>
            <LockStepper
              amount={stepper.amount}
              validator={stepper.validator}
              lockDuration={stepper.duration}
              hubChain={hubChain}
              hubSigner={hubSigner}
              neutronChain={neutronChain}
              neutronSigner={neutronSigner}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
            />
          </div>
        )}
        {stepper && stepper.type === "revertFromHubLSM" && (
          <div className={classNames.fixedOverlay}>
            <RevertFromHubStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              hubChain={hubChain}
              neutronChain={neutronChain}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
              deleteIncompleteNotice={deleteIncompleteNotice}
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
              hubChain={hubChain}
              neutronChain={neutronChain}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
              deleteIncompleteNotice={deleteIncompleteNotice}
            />
          </div>
        )}
        {stepper && stepper.type === "continueFromHubLSM" && (
          <div className={classNames.fixedOverlay}>
            <ContinueFromHubStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              hubChain={hubChain}
              neutronChain={neutronChain}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
              deleteIncompleteNotice={deleteIncompleteNotice}
            />
          </div>
        )}
        {stepper && stepper.type === "continueFromNeutronLSM" && (
          <div className={classNames.fixedOverlay}>
            <ContinueFromNeutronStepper
              amount={stepper.amount}
              validator={stepper.validator}
              denom={stepper.denom}
              baseDenom={stepper.baseDenom}
              hubChain={hubChain}
              neutronChain={neutronChain}
              onExit={() => setStepper(undefined)}
              validatorMap={validatorMap}
              deleteIncompleteNotice={deleteIncompleteNotice}
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

          {isAtMaxLockupCapacity ? (
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
