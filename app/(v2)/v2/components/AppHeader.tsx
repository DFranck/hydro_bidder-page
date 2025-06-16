'use client'

import { needsWalletConnectionTooltip } from '@/components/ToolTips'
import {
  HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
  HYDRO_TELEGRAM_COMMUNITY_URL,
} from '@/config'
import { Logo } from '@v2/components/Logo'
import { MenuItem, ResponsiveMenu } from '@v2/components/ResponsiveMenu'
import { useAppState } from '@v2/state/provider'
import { AppAction } from '@v2/state/reducer'
import Link from 'next/link'
import { twJoin } from 'tailwind-merge'

function getMenuItems(
  isWalletConnected: boolean,
  narrowBuckets: boolean,
  dispatch: React.Dispatch<AppAction>,
): MenuItem[] {
  return [
    {
      label: 'Bids',
      href: '/bids',
    },
    {
      disabled: !isWalletConnected,
      label: 'Lockups',
      href: '/lockups',
      tooltip: !isWalletConnected ? needsWalletConnectionTooltip : undefined,
    },
    {
      disabled: !isWalletConnected,
      label: 'Rewards',
      href: '/rewards',
      tooltip: !isWalletConnected ? needsWalletConnectionTooltip : undefined,
    },
    {
      label: 'Metrics',
      href: '/metrics',
    },
    {
      label: 'More',
      menuItems: [
        {
          label: 'Grants',
          href: 'https://forms.gle/RGPdDenuFQ1pGapKA',
          iconLeft: 'solid:award',
          iconRight: 'arrow-up-right-from-square',
          target: '_blank',
        },
        {
          label: 'Airdrops',
          href: '/airdrops',
          iconLeft: 'solid:parachute-box',
          iconRight: 'arrow-up-right-from-square',
          target: '_blank',
        },
        {
          href: 'https://daodao.zone/dao/neutron1lefyfl55ntp7j58k8wy7x3yq9dngsj73s5syrreq55hu4xst660s5p2jtj/proposals',
          iconLeft: 'solid:gavel',
          iconRight: 'arrow-up-right-from-square',
          label: 'Governance',
          target: '_blank',
        },
        {
          href: '/docs',
          iconLeft: 'solid:book',
          iconRight: 'arrow-up-right-from-square',
          label: 'Docs',
          target: '_blank',
        },
        {
          href: 'https://x.com/HydroTeam_',
          iconLeft: 'brands:x-twitter',
          iconRight: 'arrow-up-right-from-square',
          label: 'Twitter',
          target: '_blank',
        },
        {
          href: HYDRO_TELEGRAM_COMMUNITY_URL,
          iconLeft: 'solid:paper-plane',
          iconRight: 'arrow-up-right-from-square',
          label: 'Community',
          target: '_blank',
        },
        {
          href: HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
          iconLeft: 'solid:paper-plane',
          iconRight: 'arrow-up-right-from-square',
          label: 'Announcements',
          target: '_blank',
        },
      ],
    },
    {
      label: 'Settings',
      iconRight: 'solid:gear',
      menuItems: [
        {
          label: 'Narrow Buckets',
          iconLeft: 'solid:columns-3',
          iconRight: narrowBuckets ? 'solid:toggle-on' : 'solid:toggle-off',
          onClick: () =>
            dispatch({
              type: 'SET_NARROW_BUCKETS',
              payload: !narrowBuckets,
            }),
        },
      ],
    },
  ]
}

export function AppHeader() {
  const { state, dispatch } = useAppState()
  const { narrowBuckets } = state
  const isWalletConnected = false // TODO: Add wallet connection state
  const menuItems = getMenuItems(isWalletConnected, narrowBuckets, dispatch)

  return (
    <header
      className={twJoin('grid-in-header', 'flex items-center justify-between')}
    >
      <div className={twJoin('h-12 w-full px-3 py-1')}>
        <Link href="/v2" className={twJoin('relative block h-full')}>
          <Logo />
        </Link>
      </div>

      <ResponsiveMenu
        menuItems={menuItems}
        className={twJoin(
          'desktop:flex',
          'desktop:justify-end',
          'desktop:text-sm',
          'desktop:px-3',
        )}
        classNameForBackdrop="bg-shaded backdrop-blur-sm"
        classNameForBackground="bg-palette-blue/80"
        classNameForItem={twJoin(
          'hover:text-palette-beige cursor-pointer',
          'desktop:px-6',
          'desktop:hover:text-palette-beige desktop:focus-within:text-palette-beige',
        )}
        classNameForSubItem={twJoin(
          'desktop:px-4 desktop:py-2',
          'desktop:hover:bg-palette-green desktop:hover:text-background',
          'desktop:focus-within:bg-palette-green desktop:focus-within:text-background',
        )}
        classNameForSubItems={twJoin(
          'gap-3',
          'desktop:right-0',
          'desktop:mt-2',
          'desktop:py-2',
          'desktop:bg-background',
          'desktop:rounded-standard',
          'desktop:border',
          'desktop:shadow-2xl',
        )}
      />
    </header>
  )
}
