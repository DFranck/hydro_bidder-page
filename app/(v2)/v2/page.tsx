"use client"

import { useDummyData } from "@/app/(v2)/v2/useDummyData"
import { Icon } from "@/components/Icon"
import { needsWalletConnectionTooltip } from "@/components/ToolTips"
import { Logo } from "@/components/v2/Logo"
import { MenuItem, ResponsiveMenu } from "@/components/v2/ResponsiveMenu"
import {
  HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
  HYDRO_TELEGRAM_COMMUNITY_URL,
} from "@/config"
import { useIsMobile } from "@/lib/useIsMobile"
import Link from "next/link"
import { useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export const currentRoundId = 5

export const bidTitleCandidates = [
  "Decentralized NFT marketplace with gasless transactions",
  "Blockchain-based voting system for transparent elections",
  "Tokenized real estate investment platform on Ethereum",
  "Decentralized social media platform with privacy focus",
  "Supply chain tracking solution using smart contracts",
]

export const bidDurationCandidates = ["1 month", "3 months", "6 months"]

export const votingTokenCandidates = ["ATOM", "stOSMO"]

const getMenuItems = (isWalletConnected: boolean): MenuItem[] => [
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
]

export default function V2() {
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const menuItems = getMenuItems(false)
  const isSidebarDocked = !isSidebarOpen && !isMobile

  const { buckets, bids, currentRoundId, userVotedOnBidIds, votingTokens } =
    useDummyData()!

  return (
    <div
      className={twJoin(
        "relative h-screen w-screen",
        "grid grid-rows-[min-content_auto] gap-[2px]",
        "scrollbar-thumb-palette-beige scrollbar-track-palette-text",
        "**:scrollbar-thin",
        "transition-all",
        isMobile
          ? "grid-cols-1"
          : isSidebarOpen
            ? "grid-cols-[300px_auto]"
            : "grid-cols-[60px_auto]"
      )}
      style={{
        gridTemplateAreas: isMobile
          ? `
            logo    navigation
            sidebar sidebar
            content content
          `
          : `
            logo    navigation
            sidebar content
          `,
      }}
    >
      <header className={twJoin("items-center py-1", isMobile ? "" : "")}>
        <div className="px-3">
          <Link href="/v2" className="relative block h-12 w-full min-w-12">
            <Logo className="h-full w-full" showText={isSidebarOpen} />
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

      <main
        className={twJoin(
          "h-full overflow-hidden",
          "col-span-2",
          isMobile ? "" : "grid grid-cols-subgrid"
        )}
      >
        <aside
          className={twJoin("bg-palette-beige/10")}
          onClick={isSidebarDocked ? () => setIsSidebarOpen(true) : undefined}
        >
          <div
            id="round-selector"
            className={twJoin(
              "flex items-center justify-between",
              "bg-palette-beige text-palette-text",
              "font-bold transition-all",
              isSidebarDocked ? "flex-col-reverse p-0.5" : "h-12 px-3"
            )}
          >
            <div
              className={twJoin(
                "flex w-full items-center gap-1",
                isSidebarDocked && [
                  "flex-col",
                  "[&_span]:uppercase",
                  "[&_span]:text-[10px]",
                  "[&_var]:text-3xl",
                  "[&_var]:leading-none",
                ]
              )}
            >
              <span>Round</span> <var className="not-italic">5</var>{" "}
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
              <button className={twJoin("button", isSidebarDocked && "hidden")}>
                <Icon name="solid:caret-down" />
              </button>

              <button
                className={twJoin(
                  "button",
                  isSidebarDocked && [
                    "block w-full text-center",
                    "border-palette-text border-b-2",
                  ],
                  isMobile && "hidden"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon
                  name="solid:arrow-left-to-line"
                  className={twJoin(
                    "inline-block",
                    isSidebarDocked && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>

          <div
            className={twJoin(
              isSidebarDocked
                ? "py-[2px]"
                : !isMobile
                  ? "py-3"
                  : "pt-3 pb-[2px]"
            )}
          >
            <div className={twJoin("flex flex-col gap-2")}>
              <div
                className={twJoin(
                  "flex items-center justify-between",
                  "px-3 py-1",
                  isSidebarDocked && "hidden"
                )}
              >
                <div className="label">Lockups</div>

                <button className={twJoin("button")}>
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
            </div>
          </div>
        </aside>

        <div className="grid h-full grid-rows-[min-content_auto]">
          <div
            id="stats-bar"
            className={twJoin(
              "flex h-12 justify-around gap-3",
              "bg-palette-blue"
            )}
          >
            {[
              [14, "Live Bids"],
              ["17%", "Average APR"],
              [15, "Days Left in Round"],
            ].map(([count, label]) => (
              <div key={label} className={twJoin("flex items-center gap-3")}>
                <var className="text-palette-beige text-3xl font-extrabold not-italic">
                  {count}
                </var>

                <span>{label}</span>
              </div>
            ))}
          </div>

          <div
            id="bucket-list"
            className={twJoin(
              "snap-x snap-mandatory scroll-px-[2px] p-[2px]",
              "flex gap-[2px] overflow-x-auto",
              isMobile ? [""] : [""]
            )}
          >
            {buckets.map(({ id, label, denom, numBids }, index) => {
              const bidsInBucket = bids.filter((bid) => bid.bucketId === id)
              const userVotedInBucket = bidsInBucket.some((bid) =>
                userVotedOnBidIds.includes(bid.id)
              )

              return (
                <div
                  id={`bucket-${id}-container`}
                  key={index}
                  className={twJoin(
                    "relative",
                    "h-full shrink-0 grow-0",
                    "snap-start bg-red-400",
                    isMobile ? "w-screen" : "w-[450px]"
                  )}
                >
                  <div
                    id={`bucket-${id}-viewbox`}
                    tabIndex={0}
                    className={twMerge(
                      "absolute inset-0",
                      "grid grid-rows-[min-content_auto]",
                      "opacity-80 transition-opacity",
                      "focus-within:outline-none",
                      "focus-within:opacity-100",
                      "focus-within:ring-2",
                      "focus-within:ring-palette-beige",
                      userVotedInBucket && [
                        "bg-palette-green/10",
                        "scrollbar-thumb-palette-green",
                        "scrollbar-track-transparent",
                      ]
                    )}
                  >
                    <div
                      id="bucket-header"
                      className={twJoin(
                        "flex h-12 items-center justify-between px-3",
                        userVotedInBucket
                          ? "bg-palette-green/10"
                          : "bg-palette-beige/10"
                      )}
                    >
                      <h2 className="label">{label}</h2>

                      <div className={twJoin("flex items-center gap-2")}>
                        <span
                          className={twJoin(
                            "text-xs",
                            userVotedInBucket
                              ? "text-palette-green"
                              : "text-palette-beige"
                          )}
                        >
                          {userVotedInBucket
                            ? "You voted in this bucket"
                            : "There is still time to vote!"}
                        </span>

                        <button className={twJoin("button")}>
                          <Icon name="solid:ellipsis-vertical" />
                        </button>
                      </div>
                    </div>

                    <div
                      className={twJoin(
                        "h-full",
                        "overflow-y-auto",
                        "flex flex-col gap-[2px]"
                      )}
                    >
                      {bidsInBucket.map(
                        ({ id, title, duration, amount }, index) => {
                          const userHasVotedOnThisBid =
                            userVotedOnBidIds.includes(id)

                          return (
                            <div
                              key={index}
                              id="bid-card"
                              tabIndex={0}
                              className={twJoin(
                                "grid grid-cols-[min-content_auto]",
                                "gap-3 px-3 py-2",
                                "items-center",
                                "focus-within:outline-none",
                                "focus-within:ring-2",
                                "focus-within:ring-palette-beige",
                                userHasVotedOnThisBid && [
                                  "bg-palette-green/20 ring-palette-green ring-2",
                                ]
                              )}
                            >
                              <div
                                className={twJoin(
                                  "size-12 rounded-full",
                                  "bg-palette-beige"
                                )}
                              />

                              <div
                                className={twJoin(
                                  "h-full pt-2",
                                  "flex flex-col justify-between gap-3"
                                )}
                              >
                                <h3 className="text-lg text-balance">
                                  {title}
                                </h3>

                                <div
                                  className={twJoin(
                                    "flex items-center justify-between gap-2",
                                    "text-faded text-xs"
                                  )}
                                >
                                  {(
                                    [
                                      ["duration", "calendar", duration],
                                      ["amount", "dollar-sign", amount],
                                      [
                                        "voting status",
                                        userHasVotedOnThisBid
                                          ? "circle-check"
                                          : "circle-dashed",
                                        userHasVotedOnThisBid
                                          ? "Change Vote"
                                          : "Vote",
                                      ],
                                    ] as const
                                  ).map(([label, icon, value], index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-1"
                                    >
                                      <Icon name={icon} />
                                      <span>{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
