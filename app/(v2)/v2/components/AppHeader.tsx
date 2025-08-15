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
import { WalletButton } from '@v2/components/WalletButton'
import { twJoin } from 'tailwind-merge'

function getMenuItems(isWalletConnected: boolean): MenuItem[] {
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
          href: 'https://x.com/hydromarkets',
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
  const { isWalletConnected } = useChain('neutron')
  const menuItems = getMenuItems(isWalletConnected)

  return (
    <header
      className={twJoin(
        'grid-in-header',
        'flex items-center justify-center',
        'desktop:justify-between',
      )}
    >
      <div className="h-bar-height-standard">
        <InternalLink
          href="/v2"
          className={twJoin('relative z-50 block h-full scale-90')}
        >
          <Logo />
        </InternalLink>
      </div>

      <div className="flex items-center">
        <ResponsiveMenu
          menuItems={menuItems}
          className={twJoin(
            'z-50',
            'desktop:flex',
            'desktop:justify-end',
            'desktop:text-sm',
          )}
          classNameForBackdrop="bg-shaded backdrop-blur-sm"
          classNameForBackground="bg-gradient-to-l from-palette-blue to-background"
          classNameForMenuButton={twJoin(
            'size-bar-height-standard',
            'top-standard left-standard fixed z-40',
          )}
          classNameForItems={twJoin(
            'flex flex-col justify-between',
            'p-loosest',
            'gap-looser',
            'desktop:h-bar-height-large',
            'desktop:flex-row',
            'desktop:gap-loose',
            'desktop:items-center',
            'desktop:justify-end',
            'desktop:px-standard',
            'desktop:py-0',
            'desktop:opacity-100',
          )}
          classNameForItem={twJoin(
            'hover:text-palette-beige cursor-pointer',
            'desktop:hover:text-palette-beige',
            'desktop:focus-within:text-palette-beige',
          )}
          classNameForSubItems={twJoin(
            'border-l-palette-beige border-l-2',
            'pl-loosest',
            'my-looser',
            'gap-looser',
            'desktop:border-l-0',
            'desktop:border-0',
            'desktop:pl-0',
            'desktop:gap-0',
            'desktop:mb-0',
            'desktop:mt-tighter',
            'desktop:py-tighter',
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

        <WalletButton />
      </div>
    </header>
  )
}
