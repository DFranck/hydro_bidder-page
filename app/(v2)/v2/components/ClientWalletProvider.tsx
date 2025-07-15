'use client'

import dynamic from 'next/dynamic'

const V2WalletProvider = dynamic(
  () => import('./V2WalletProvider').then((mod) => mod.V2WalletProvider),
  {
    ssr: false,
  },
)

export function ClientWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <V2WalletProvider>{children}</V2WalletProvider>
}
