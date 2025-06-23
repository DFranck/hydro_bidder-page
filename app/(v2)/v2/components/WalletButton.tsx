'use client'

import { useWalletConnection } from '@v2/hooks/useWalletConnection'

export type WalletButtonProps = {
  chainName?: string
  notifyConnectedCB?: (isConnected: boolean) => void
  ignoreStatus?: boolean
  className?: string
} & Omit<React.ComponentProps<'button'>, 'onClick' | 'disabled' | 'children'>

export function WalletButton({
  chainName,
  notifyConnectedCB,
  ignoreStatus,
  className,
  ...otherProps
}: WalletButtonProps) {
  const { getButtonProps } = useWalletConnection({
    chainName,
    notifyConnectedCB,
    ignoreStatus,
  })

  const buttonProps = getButtonProps()

  return (
    <button
      className={className}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      {...otherProps}
    >
      {buttonProps.children}
    </button>
  )
}
