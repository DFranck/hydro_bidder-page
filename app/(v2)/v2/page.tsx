"use client"

import { ScrollIndicator } from "@/app/(v2)/v2/components/ScrollIndicator"
import { StatBar } from "@/app/(v2)/v2/components/StatBar"
import { useAppState } from "@/app/(v2)/v2/state/provider"
import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { needsWalletConnectionTooltip } from "@/components/ToolTips"
import {
  HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
  HYDRO_TELEGRAM_COMMUNITY_URL,
} from "@/config"
import { useIsMobile } from "@/lib/useIsMobile"
import range from "lodash/range"
import sortBy from "lodash/sortBy"
import Link from "next/link"
import { useState } from "react"
import { twJoin } from "tailwind-merge"
import { Bucket } from "./components/Bucket"
import { Logo } from "./components/Logo"
import { MenuItem, ResponsiveMenu } from "./components/ResponsiveMenu"
import { useDummyData } from "./dummy-data/useDummyData"

export default function V2() {
  const isMobile = useIsMobile()
  const { state, dispatch } = useAppState()
  const { narrowBuckets } = state
  const [isSidebarOpen, setIsSidebarOpen] = useState(isMobile ? false : true)
  const [isRoundSelectorOpen, setIsRoundSelectorOpen] = useState(false)
  const menuItems = getMenuItems(false)
  const isSidebarDocked = !isSidebarOpen && !isMobile

  const { buckets, currentRoundId } = useDummyData()!

  const sortedBuckets = sortBy(buckets, (bucket) => bucket.userVotedInBucket)

  function getMenuItems(isWalletConnected: boolean): MenuItem[] {
    return [
      {
        label: "Bids",
        href: "/bids",
      },
      {
        disabled: !isWalletConnected,
        label: "Lockups",
        href: "/lockups",
        tooltip: !isWalletConnected ? needsWalletConnectionTooltip : undefined,
      },
      {
        disabled: !isWalletConnected,
        label: "Rewards",
        href: "/rewards",
        tooltip: !isWalletConnected ? needsWalletConnectionTooltip : undefined,
      },
      {
        label: "Metrics",
        href: "/metrics",
      },
      {
        label: "More",
        menuItems: [
          {
            label: "Grants",
            href: "https://forms.gle/RGPdDenuFQ1pGapKA",
            iconLeft: "solid:award",
            iconRight: "arrow-up-right-from-square",
            target: "_blank",
          },
          {
            label: "Airdrops",
            href: "/airdrops",
            iconLeft: "solid:parachute-box",
            iconRight: "arrow-up-right-from-square",
            target: "_blank",
          },
          {
            href: "https://daodao.zone/dao/neutron1lefyfl55ntp7j58k8wy7x3yq9dngsj73s5syrreq55hu4xst660s5p2jtj/proposals",
            iconLeft: "solid:gavel",
            iconRight: "arrow-up-right-from-square",
            label: "Governance",
            target: "_blank",
          },
          {
            href: "/docs",
            iconLeft: "solid:book",
            iconRight: "arrow-up-right-from-square",
            label: "Docs",
            target: "_blank",
          },
          {
            href: "https://x.com/HydroTeam_",
            iconLeft: "brands:x-twitter",
            iconRight: "arrow-up-right-from-square",
            label: "Twitter",
            target: "_blank",
          },
          {
            href: HYDRO_TELEGRAM_COMMUNITY_URL,
            iconLeft: "solid:paper-plane",
            iconRight: "arrow-up-right-from-square",
            label: "Community",
            target: "_blank",
          },
          {
            href: HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
            iconLeft: "solid:paper-plane",
            iconRight: "arrow-up-right-from-square",
            label: "Announcements",
            target: "_blank",
          },
        ],
      },
      {
        label: "Settings",
        iconRight: "solid:gear",
        menuItems: [
          {
            label: "Narrow Buckets",
            iconLeft: "solid:columns-3",
            iconRight: narrowBuckets ? "solid:toggle-on" : "solid:toggle-off",
            onClick: () =>
              dispatch({
                type: "SET_NARROW_BUCKETS",
                payload: !narrowBuckets,
              }),
          },
        ],
      },
    ]
  }

  return (
    <div
      className={twJoin(
        "relative h-screen w-screen",
        "p-[2px]",
        "scrollbar-thumb-palette-beige scrollbar-track-palette-text",
        "**:scrollbar-thin",
        isMobile
          ? isSidebarOpen
            ? "grid-areas-mobile-sidebar-open"
            : "grid-areas-mobile-sidebar-closed"
          : isSidebarOpen
            ? "grid-areas-desktop-sidebar-open"
            : "grid-areas-desktop-sidebar-closed"
      )}
    >
      <header
        className={twJoin(
          "grid-in-header",
          "flex items-center justify-between",
          isMobile ? "" : ""
        )}
      >
        <div className={twJoin("h-12 w-full px-3 py-1")}>
          <Link href="/v2" className={twJoin("relative block h-full")}>
            <Logo />
          </Link>
        </div>

        <ResponsiveMenu
          menuItems={menuItems}
          classNameDesktop={twJoin("flex justify-end text-sm", "px-3")}
          classNameForBackdropMobile="bg-palette-text/20 backdrop-blur-sm"
          classNameForBackgroundMobile="bg-palette-blue/80"
          classNameForItemDesktop="hover:text-palette-beige cursor-pointer"
          classNameForItemMobile={twJoin(
            "px-6",
            "hover:text-palette-beige focus-within:text-palette-beige"
          )}
          classNameForSubItemDesktop={twJoin(
            "px-4 py-2",
            "hover:bg-palette-green hover:text-palette-text",
            "focus-within:bg-palette-green focus-within:text-palette-text"
          )}
          classNameForSubItemsDesktop={twJoin(
            "right-0 mt-2 py-2",
            "bg-palette-text rounded-md border shadow-2xl"
          )}
          classNameForSubItemsMobile="gap-3"
        />
      </header>

      <main className={twJoin("contents", isMobile ? "" : "")}>
        <aside
          className={twJoin(
            "grid-in-sidebar",
            "flex flex-col",
            "bg-palette-beige/10"
          )}
          onClick={isSidebarDocked ? () => setIsSidebarOpen(true) : undefined}
        >
          <div
            id="sidebar-round-selector"
            className={twJoin(
              "flex items-center justify-between",
              "bg-palette-beige text-palette-text",
              "font-bold transition-all",
              isSidebarDocked
                ? "flex-col p-[2px]" // move the switcher above
                : "h-12 px-3"
            )}
          >
            <div
              className={twJoin(
                "flex w-full items-center",
                isSidebarDocked ? "flex-col" : "gap-3"
              )}
            >
              <span
                className={twJoin(
                  isSidebarDocked && [
                    "py-2",
                    "flex flex-col items-center justify-center",
                    "text-[10px] uppercase",
                  ]
                )}
              >
                <span>Round</span>{" "}
                <var
                  className={twJoin(
                    "not-italic",
                    isSidebarDocked && "text-3xl leading-none"
                  )}
                >
                  5
                </var>
              </span>{" "}
              <span
                className={twJoin(
                  "py-0.5",
                  "text-[10px] uppercase",
                  "bg-palette-text text-palette-beige",
                  isSidebarDocked ? "w-full text-center" : "rounded-full px-2"
                )}
              >
                Current
              </span>
            </div>

            <div className={twJoin("flex items-center gap-2")}>
              <button
                className={twJoin(
                  "btn-icon transition-all",
                  isSidebarDocked && "hidden",
                  isRoundSelectorOpen && "rotate-180"
                )}
                onClick={() => setIsRoundSelectorOpen(!isRoundSelectorOpen)}
              >
                <Icon name="solid:caret-down" />
              </button>

              <button
                className={twJoin("btn-icon", isSidebarDocked && "hidden")}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Icon
                  name="solid:arrow-left-to-line"
                  className={twJoin(
                    "inline-block",
                    isSidebarDocked && "rotate-180",
                    isMobile && (isSidebarOpen ? "rotate-90" : "-rotate-90")
                  )}
                />
              </button>
            </div>
          </div>

          <CollapsibleBox
            id="sidebar-round-selector-options"
            isCollapsed={!isRoundSelectorOpen || isSidebarDocked}
            className={twJoin(
              !isMobile &&
                (!isRoundSelectorOpen || isSidebarDocked) &&
                "mt-[2px]"
            )}
            classNamesForInnerWrapper={twJoin(
              "flex flex-col",
              "bg-palette-beige text-palette-text"
            )}
          >
            {range(-2, currentRoundId + 1).map((roundId) => (
              <Link
                key={roundId}
                href={`/v2/rounds/${roundId + 1}`}
                className={twJoin(
                  "flex items-center gap-1",
                  "h-12 px-3",
                  "hover:bg-palette-text/10"
                )}
              >
                Round {roundId + 1}
              </Link>
            ))}
          </CollapsibleBox>

          <CollapsibleBox
            id="sidebar-content"
            isCollapsed={isMobile && !isSidebarOpen}
          >
            <div
              className={twJoin(
                "h-12 px-3",
                "flex items-center justify-between",
                isSidebarDocked && "hidden"
              )}
            >
              <div className="label">Lockups</div>

              <button className={twJoin("btn-icon")}>
                <Icon name="solid:ellipsis-vertical" />
              </button>
            </div>

            <div
              className={twJoin(
                "grid gap-[2px]",
                isSidebarDocked ? "grid-cols-1" : "grid-cols-2"
              )}
            >
              {(
                [
                  [200, "ATOM", "bg-token-atom"],
                  [0, "stOSMO", "bg-token-stosmo"],
                ] as const
              ).map(([amount, denom, className]) => (
                <div
                  key={denom}
                  className={twJoin(
                    "flex flex-col items-center justify-center",
                    "gap-1 py-3",
                    className,
                    "*:block"
                  )}
                >
                  <span
                    className={twJoin(
                      "-mb-1 size-8 rounded-full bg-white leading-0"
                    )}
                  />{" "}
                  <var className="font-extrabold not-italic">{amount}</var>{" "}
                  <span className="denom">{denom}</span>
                </div>
              ))}
            </div>
          </CollapsibleBox>
        </aside>

        <CollapsibleBox
          id="content-container"
          isCollapsed={isMobile && isSidebarOpen}
          className={twJoin("grid-in-content")}
          classNamesForInnerWrapper={twJoin(
            "relative",
            "grid grid-rows-[min-content_min-content_auto]"
          )}
        >
          <StatBar
            stats={[
              ["Live Bids", 14],
              ["Average APR", "17%"],
              ["Days Left", 15],
            ]}
          />

          <ScrollIndicator
            containerSelector="#bid-card-lists"
            targetSelector="[id^='bucket-container-']"
            className={twJoin(
              "w-full gap-[2px] p-[2px]",
              "overflow-x-auto",
              "bg-palette-text/50 backdrop-blur-xs"
            )}
            renderDot={({ index, isActive, spreadProps }) => {
              const bucket = sortedBuckets[index]
              const { label, userVotedInBucket } = bucket

              return (
                <button
                  {...spreadProps}
                  key={index}
                  className={twJoin(
                    isActive && "is-active",
                    userVotedInBucket && "has-voted",
                    "h-12 w-full truncate px-3",
                    "text-palette-text transition-all",
                    "border-2 border-transparent transition-all",
                    "[&:is(.is-active.has-voted,.has-voted:focus-within)]:bg-palette-green",
                    "[&:is(.is-active,:focus-within):not(.has-voted)]:bg-palette-beige",
                    "[&:is(.has-voted)]:bg-palette-green/60",
                    "[&:not(.has-voted)]:bg-palette-beige/60"
                  )}
                >
                  <span className="label">{label}</span>
                </button>
              )
            }}
          />

          <div
            id="bid-card-lists"
            className={twJoin(
              "relative",
              "snap-x snap-mandatory",
              "flex overflow-x-auto"
            )}
          >
            {sortedBuckets.map(({ id }, index) => (
              <Bucket
                key={index}
                bucketId={id}
                className="ml-[-2px] first:ml-0"
                classNameForContentContainer="pb-12"
              />
            ))}
          </div>
        </CollapsibleBox>
      </main>
    </div>
  )
}
