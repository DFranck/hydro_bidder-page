import { needsWalletConnectionTooltip } from "@/components/ToolTips"
import {
    HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
    HYDRO_TELEGRAM_COMMUNITY_URL,
} from "@/config"
import { Dispatch } from "react"
import { MenuItem } from "../components/ResponsiveMenu"

type AppAction = {
  type: "SET_NARROW_BUCKETS"
  payload: boolean
}

export function getMenuItems(
  isWalletConnected: boolean,
  narrowBuckets: boolean,
  dispatch: Dispatch<AppAction>
): MenuItem[] {
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
