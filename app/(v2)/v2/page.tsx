"use client"

import { SourceBadge } from "@/app/(v2)/v2/components/SourceBadge"
import { StatBar } from "@/app/(v2)/v2/components/StatBar"
import { TokenThemeWrapper } from "@/app/(v2)/v2/components/TokenThemeWrapper"
import { useAppState } from "@/app/(v2)/v2/state/provider"
import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { useIsMobile } from "@/lib/useIsMobile"
import sortBy from "lodash/sortBy"
import Link from "next/link"
import { twJoin, twMerge } from "tailwind-merge"
import { Logo } from "./components/Logo"
import { ResponsiveMenu } from "./components/ResponsiveMenu"
import { Tranche } from "./components/Tranche"
import { TrancheNavigation } from "./components/TrancheNavigation"
import { getMenuItems } from "./utils/getMenuItems"

export default function V2() {
  const isMobile = useIsMobile()
  const { state, dispatch } = useAppState()
  const { currentRoundDataPerSource, narrowBuckets, isSidebarOpen } = state
  const menuItems = getMenuItems(false, narrowBuckets, dispatch)
  const isSidebarDocked = !isSidebarOpen && !isMobile
  const allSources = Object.values(currentRoundDataPerSource ?? {})
  const allTranchesSorted = sortBy(
    allSources.flatMap(({ sourceId, tranches }) =>
      tranches.map((tranche) => ({
        ...tranche,
        sourceId: sourceId,
      }))
    ),
    (tranche) => tranche.sourceId
  )

  return (
    <div
      className={twJoin(
        "relative h-screen w-screen",
        "p-standard",
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
          "flex items-center justify-between"
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
            "bg-palette-text rounded-standard border shadow-2xl"
          )}
          classNameForSubItemsMobile="gap-3"
        />
      </header>

      <main className="contents">
        <aside
          className={twJoin(
            "grid-in-sidebar",
            "rounded-standard flex flex-col",
            "bg-palette-beige/10"
          )}
          onClick={() =>
            dispatch({ type: "SET_SIDEBAR_OPEN", payload: !isSidebarOpen })
          }
        >
          <div
            className={twJoin(
              "h-12 px-3",
              "flex items-center justify-between",
              isSidebarDocked && "hidden"
            )}
          >
            <div className="label whitespace-nowrap">Voting Tokens</div>

            <div className="flex items-center gap-2">
              <button className={twJoin("btn-icon")}>
                <Icon name="solid:ellipsis-vertical" />
              </button>
              <button
                className={twJoin("btn-icon", isSidebarDocked && "hidden")}
                onClick={() =>
                  dispatch({
                    type: "SET_SIDEBAR_OPEN",
                    payload: !isSidebarOpen,
                  })
                }
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

          <div
            className={twJoin(
              "gap-standard flex flex-col",
              !isSidebarDocked && "p-standard"
            )}
          >
            {allSources.map(
              ({ totalLockedTokens, sourceId, currentRoundId }) => (
                <TokenThemeWrapper
                  key={sourceId}
                  sourceId={sourceId}
                  className={twMerge(
                    "relative",
                    "flex items-center justify-between gap-3",
                    "bg-token-color rounded-standard",
                    isSidebarDocked
                      ? "flex-col gap-1 py-3 text-center"
                      : "h-12 flex-row pl-3"
                  )}
                >
                  <div
                    className={twJoin(
                      "flex items-center",
                      isSidebarDocked ? "flex-col gap-1" : "flex-row gap-3"
                    )}
                  >
                    <SourceBadge sourceId={sourceId} className="size-8 p-1.5" />

                    <div
                      className={twJoin(
                        "flex items-baseline gap-1",
                        isSidebarDocked ? "flex-col items-center" : "flex-row"
                      )}
                    >
                      <span className="font-extrabold">
                        {totalLockedTokens.toLocaleString()}
                      </span>
                      <span className="denom">{sourceId}</span>
                    </div>
                  </div>

                  <div
                    className={twJoin(
                      "flex items-center gap-2",
                      isSidebarDocked && "hidden"
                    )}
                  >
                    <div className={twJoin("label")}>
                      Round {currentRoundId}
                    </div>
                    <button className="btn-icon">
                      <Icon name="solid:caret-down" />
                    </button>
                  </div>
                </TokenThemeWrapper>
              )
            )}
          </div>

          <CollapsibleBox
            id="sidebar-content"
            isCollapsed={isMobile && !isSidebarOpen}
          ></CollapsibleBox>
        </aside>

        <CollapsibleBox
          id="content-container"
          isCollapsed={isMobile && isSidebarOpen}
          className={twJoin("grid-in-content")}
          classNamesForInnerWrapper={twJoin(
            "relative grid",
            "gap-standard",
            "grid-rows-[min-content_min-content_auto]"
          )}
        >
          <StatBar
            stats={[
              ["Live Bids", 14],
              ["Average APR", "17%"],
              ["Days Left", 15],
            ]}
          />

          <TrancheNavigation allTranchesSorted={allTranchesSorted} />

          <div
            id="bid-card-lists"
            className={twJoin(
              "relative",
              "snap-x snap-mandatory",
              "flex overflow-x-auto"
            )}
          >
            {allTranchesSorted.map(({ id, sourceId }, index) => (
              <Tranche
                key={index}
                sourceId={sourceId}
                trancheId={id}
                className={twJoin(!isMobile && "-ml-standard", "first:ml-0")}
                classNameForContentContainer="pb-12"
              />
            ))}
          </div>
        </CollapsibleBox>
      </main>
    </div>
  )
}
