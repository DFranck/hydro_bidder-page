"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { getMarketplaceQueryClient } from "@/contract-apis/getClient"
import { AugmentedLockup } from "@/contract-apis/types"
import { getFormatedDateFromNanos } from "@/lib/getFormatedDateFromNanos"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MarketplaceLockup } from "../../marketplace/types"
import { isListedMarketplaceLockup } from "../../marketplace/utils/isListedMarketplaceLockup"
import { formatDenomAmount } from "../../utils/formatDenomAmount"
import { getDenomExponent } from "../../utils/getDenomExponent"
import { getDisplayDenom } from "../../utils/getDisplayDenom"
import { getDisplayRoundId } from "../../utils/getDisplayRoundId"
import { getLockupHistory, LockupHistoryItem } from "../utils/getLockupHistory"
import {
  ExtendedEvent,
  mergeLockupHistories,
} from "../utils/mergeLockupHistories"

const actionLabels: Record<string, string> = {
  List: "Listed",
  Unlist: "Unlisted",
  Buy: "Bought",
}

export function LockupActionVotingHistory({
  lockup,
}: {
  lockup: AugmentedLockup | MarketplaceLockup
}) {
  const history = getLockupHistory(lockup)
  const [fetching, setFetching] = useState(false)
  const [lockupVotingHistory, setLockupVotingHistory] = useState<
    LockupHistoryItem[]
  >([])
  const [lockupEventsHistory, setLockupEventsHistory] = useState<
    ExtendedEvent[]
  >([])
  const unifiedHistory = mergeLockupHistories(
    lockupVotingHistory,
    lockupEventsHistory,
  )

  useEffect(() => {
    setLockupVotingHistory(history)
  }, [])

  useEffect(() => {
    const collection = isListedMarketplaceLockup(lockup)
      ? lockup.listing.collection
      : process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS
    if (!collection) return

    const fetchLockupHistory = async () => {
      setFetching(true)
      try {
        const tokenId = lockup.id.toString()
        const markeplaceQueryClient = await getMarketplaceQueryClient()
        const { events } = await markeplaceQueryClient.events({
          collection,
          tokenId,
          limit: 50,
          startAfter: undefined,
        })
        setLockupEventsHistory(
          events.map((e) => ({
            ...e,
            metadata: e.metadata as unknown as ExtendedEvent["metadata"],
          })),
        )
      } finally {
        setFetching(false)
      }
    }
    fetchLockupHistory()
  }, [])

  return (
    <div className="max-h-[110px] space-y-2 overflow-y-auto bg-gradient-to-r from-palette-beige/0 to-palette-beige/20 p-3 pl-6">
      <div className="flex items-center">
        <Icon name="clock-rotate-left" className="mr-3 min-w-4 opacity-60" />
        <StyledText as="label" variant="label.meta.faded">
          History
        </StyledText>
      </div>

      {fetching ? (
        <div className="text-[10px] opacity-60">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {unifiedHistory.length === 0 ? (
            <div className="text-[10px] opacity-60">
              No voting or event history
            </div>
          ) : (
            unifiedHistory.map((h, i) => {
              if (h.type === "vote") {
                return (
                  <div
                    key={`vote-${i}`}
                    className="flex items-center gap-3 text-[10px] opacity-60"
                  >
                    <Icon
                      name="solid:circle"
                      className="min-w-5 text-center "
                    />
                    <span className="whitespace-nowrap text-right font-bold uppercase leading-4 tracking-[0.1em]">
                      {getFormatedDateFromNanos(String(h.date_nanos), "en-CA", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      }).replace(/-/g, "•")}
                    </span>
                    <span className="whitespace-nowrap ">
                      Voted on{" "}
                      <StyledText
                        href={`/bids/${h.proposal_id}`}
                        as={Link}
                        prefetch={false}
                        className="underline"
                      >
                        Bid #{h.proposal_id}
                      </StyledText>{" "}
                      in{" "}
                      <StyledText
                        href={`/metrics/${getDisplayRoundId(h.round_id)}`}
                        as={Link}
                        prefetch={false}
                        className="underline"
                      >
                        Round {getDisplayRoundId(h.round_id)}
                      </StyledText>
                    </span>
                  </div>
                )
              }
              return (
                <div
                  key={`event-${i}`}
                  className="flex items-center gap-3 text-[10px] opacity-60"
                >
                  <Icon name="solid:circle" className="min-w-5 text-center " />
                  <span className="whitespace-nowrap text-right font-bold uppercase leading-4 tracking-[0.1em]">
                    {getFormatedDateFromNanos(String(h.date_nanos), "en-CA", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    }).replace(/-/g, "•")}
                  </span>
                  <span className="whitespace-nowrap ">
                    {h.action !== "Unlist" ? (
                      <span>
                        {actionLabels[h.action] ?? h.action}{" "}
                        {h.action !== "Unlist" &&
                          `for ${formatDenomAmount(
                            h.price.amount,
                            getDenomExponent(h.price.denom),
                          )} ${getDisplayDenom(h.price.denom)}`}
                      </span>
                    ) : (
                      <span>{actionLabels[h.action]}</span>
                    )}
                  </span>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
