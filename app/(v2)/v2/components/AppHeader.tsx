'use client'

import { needsWalletConnectionTooltip } from '@/components/ToolTips'
import {
  HYDRO_TELEGRAM_ANNOUNCEMENTS_URL,
  HYDRO_TELEGRAM_COMMUNITY_URL,
} from '@/config'
import { useChain } from '@cosmos-kit/react'
import { InternalLink } from '@v2/components/InternalLink'
import { Logo } from '@v2/components/Logo'
import { MenuItem, ResponsiveMenu } from '@v2/components/ResponsiveMenu'
import { useAppState } from '@v2/state/DataProviderOnClient'
import { AppAction } from '@v2/state/reducer'
import { twJoin } from 'tailwind-merge'

function getMenuItems(
  isWalletConnected: boolean,
  narrowBuckets: boolean,
  dispatch: React.Dispatch<AppAction>,
): MenuItem[] {
  return [
    {
      label: 'Bids',
      href: '/v2',
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
  ]
}

export function AppHeader() {
  const { state, dispatch } = useAppState()
  const { narrowBuckets } = state
  const { isWalletConnected } = useChain('neutron')
  const menuItems = getMenuItems(isWalletConnected, narrowBuckets, dispatch)

  return (
    <header
      className={twJoin('grid-in-header', 'flex items-center justify-between')}
    >
      <div
        className={twJoin(
          'h-bar-height-standard w-full',
          'pl-loose desktop:pl-tight py-1',
        )}
      >
        <InternalLink href="/v2" className={twJoin('relative block h-full')}>
          <Logo />
        </InternalLink>
      </div>

      <ResponsiveMenu
        menuItems={menuItems}
        className={twJoin(
          'desktop:flex',
          'desktop:justify-end',
          'desktop:text-sm',
        )}
        classNameForBackdrop="bg-shaded backdrop-blur-sm"
        classNameForBackground="bg-palette-blue/80"
        classNameForItems={twJoin(
          'flex flex-col justify-between',
          'px-standard py-loose gap-standard',
          'desktop:flex-row',
          'desktop:gap-loose',
          'desktop:items-center',
          'desktop:justify-end',
          'desktop:px-standard',
          'desktop:opacity-100',
        )}
        classNameForItem={twJoin(
          'hover:text-palette-beige cursor-pointer',
          'desktop:hover:text-palette-beige',
          'desktop:focus-within:text-palette-beige',
        )}
        classNameForSubItems={twJoin(
          'desktop:mt-2',
          'desktop:py-2',
          'desktop:bg-palette-beige',
          'desktop:text-background',
          'desktop:rounded-standard',
          'desktop:shadow-2xl',
        )}
        classNameForSubItem={twJoin(
          'desktop:px-standard',
          'desktop:w-full',
          'desktop:whitespace-nowrap',
          'desktop:py-tight',
          'desktop:hover:bg-background',
          'desktop:hover:text-palette-beige',
          'desktop:focus-within:bg-background',
          'desktop:focus-within:text-palette-beige',
        )}
        classNameForSubItemActive={twJoin(
          'desktop:bg-background',
          'desktop:text-palette-beige',
        )}
      />
    </header>
  )
}
