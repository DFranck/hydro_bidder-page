import { WalletStatus } from '@cosmos-kit/core'
import { MouseEventHandler } from 'react'

export interface UseWalletConnectionOptions {
  chainName?: string
  notifyConnectedCB?: (isConnected: boolean) => void
  ignoreStatus?: boolean
}

export interface UseWalletConnectionReturn {
  // Wallet state
  status: WalletStatus
  address: string | undefined
  message: string | undefined
  isWalletConnected: boolean

  // Event handlers
  onClickConnect: MouseEventHandler
  onClickOpenView: MouseEventHandler

  // Button props generator
  getButtonProps: () => {
    onClick: MouseEventHandler | undefined
    children: string
    disabled: boolean
  }
}
