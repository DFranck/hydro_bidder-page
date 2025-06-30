'use client'

import { Icon } from '@/components/Icon'
import { useChain } from '@cosmos-kit/react'
import { Tooltip } from '@v2/components/Tooltip'
import { useWalletConnection } from '@v2/hooks/useWalletConnection'
import { useEffect, useRef } from 'react'
import { twJoin } from 'tailwind-merge'

export function WalletButton() {
  const { address, isWalletConnected } = useChain('neutron')

  const lastRefetchedAddressRef = useRef<string | null>(null)
  const hasTriggeredRefetchRef = useRef(false)

  useEffect(() => {
    if (
      isWalletConnected &&
      address &&
      lastRefetchedAddressRef.current !== address
    ) {
      lastRefetchedAddressRef.current = address
      hasTriggeredRefetchRef.current = true
    }
  }, [isWalletConnected, address])

  useEffect(() => {
    if (!isWalletConnected || !address) {
      lastRefetchedAddressRef.current = null
      hasTriggeredRefetchRef.current = false
    }
  }, [isWalletConnected, address])

  const { getButtonProps } = useWalletConnection({
    chainName: 'neutron',
  })

  const buttonProps = getButtonProps()

  if (!isWalletConnected) {
    return (
      <div
        className={twJoin(
          'h-bar-height-large',
          'fixed right-0 bottom-0 left-0 z-50',
          'desktop:bottom-auto',
          'desktop:top-0',
        )}
      >
        <div
          className={twJoin(
            'w-[200vw]',
            'pointer-events-none absolute inset-y-0',
            'left-1/2 -translate-x-1/2',
            'from-palette-green bg-radial via-transparent to-transparent',
            'translate-y-1/2',
            'desktop:-translate-y-1/2',
          )}
        />
        <button
          onClick={buttonProps.onClick}
          disabled={buttonProps.disabled}
          className={twJoin(
            'absolute top-1/2 left-1/2',
            '-translate-x-1/2 -translate-y-1/2',
            'btn-primary',
            'transition-all',
            'shadow-lg',
            'hover:shadow-xl',
            'focus:shadow-xl',
          )}
        >
          <Icon name="solid:wallet" className="size-5" />
          <span className="font-medium">{buttonProps.children}</span>
        </button>
      </div>
    )
  }

  return (
    <Tooltip
      tipContents="Manage Wallet"
      className="top-standard right-standard fixed"
    >
      <button
        disabled={buttonProps.disabled}
        className={twJoin(
          'btn-essentials size-bar-height-standard',
          'text-palette-green',
        )}
        onClick={buttonProps.onClick}
      >
        <Icon name="solid:wallet" />
      </button>
    </Tooltip>
  )
}
