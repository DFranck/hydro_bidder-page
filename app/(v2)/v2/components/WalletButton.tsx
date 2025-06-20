'use client'

import { toastMessages } from '@/components/ToastMessages'
import { useToasts } from '@/components/Toasts'
import { WalletStatus } from '@cosmos-kit/core'
import { useChain } from '@cosmos-kit/react'
import { MouseEventHandler, useEffect } from 'react'

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
  const { addToast } = useToasts()
  const { connect, openView, status, address, message } = useChain(
    chainName || 'neutron',
  )

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault()
    await connect()
  }

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault()
    openView()
  }

  useEffect(() => {
    if (ignoreStatus) return

    if (
      message &&
      [WalletStatus.Error, WalletStatus.Rejected].includes(status)
    ) {
      addToast(toastMessages.walletConnectionError(new Error(message)))
    } else {
      notifyConnectedCB?.(status === WalletStatus.Connected)
    }
  }, [message, status, notifyConnectedCB, ignoreStatus, addToast])

  // Determine button content and handler based on status
  const getButtonProps = () => {
    switch (status) {
      case WalletStatus.Connected:
        return {
          onClick: onClickOpenView,
          children: address
            ? `${address.slice(0, 8)}...${address.slice(-4)}`
            : 'Connected',
          disabled: false,
        }

      case WalletStatus.Connecting:
        return {
          onClick: undefined,
          children: 'Connecting...',
          disabled: true,
        }

      case WalletStatus.Error:
        return {
          onClick: onClickOpenView,
          children: 'Error - Click to retry',
          disabled: false,
        }

      case WalletStatus.Rejected:
        return {
          onClick: onClickConnect,
          children: 'Connection Rejected - Retry',
          disabled: false,
        }

      case WalletStatus.NotExist:
        return {
          onClick: onClickOpenView,
          children: 'Install Wallet',
          disabled: false,
        }

      case WalletStatus.Disconnected:
      default:
        return {
          onClick: onClickConnect,
          children: 'Connect Wallet',
          disabled: false,
        }
    }
  }

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
