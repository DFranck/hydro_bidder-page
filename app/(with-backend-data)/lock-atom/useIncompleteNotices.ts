"use client"

import { useEffect, useState } from "react"

import { checkForHubLSMShares } from "@/app/(with-backend-data)/lock-atom/transactions/checkForHubLSMShares"
import { checkForNeutronLSMShares } from "@/app/(with-backend-data)/lock-atom/transactions/checkForNeutronLSMShares"
import { IncompleteNotice } from "@/app/(with-backend-data)/lock-atom/types"
import { SigningStargateClient } from "@cosmjs/stargate"
import { useChain } from "@cosmos-kit/react"

export function useIncompleteNotices() {
  const [incompleteNotices, setIncompleteNotices] = useState<
    IncompleteNotice[]
  >([])
  const hubChain = useChain("cosmoshub")
  const neutronChain = useChain("neutron")
  const [hubSigner, setHubSigner] = useState<SigningStargateClient | undefined>(
    undefined
  )
  const [neutronSigner, setNeutronSigner] = useState<
    SigningStargateClient | undefined
  >(undefined)

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

  function deleteIncompleteNotice(denom: string, amount: string) {
    setIncompleteNotices((prevNotices) =>
      prevNotices.filter(
        (notice) => !(notice.denom === denom && notice.amount === amount)
      )
    )
  }

  return {
    deleteIncompleteNotice,
    hubChain,
    hubSigner,
    incompleteNotices,
    neutronChain,
    neutronSigner,
    setIncompleteNotices,
  }
}
