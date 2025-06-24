'use client'

import dynamic from 'next/dynamic'

const WalletProvider = dynamic(
  () => import('@/components/WalletProvider').then((mod) => mod.WalletProvider),
  {
    ssr: false,
  },
)

export function ClientWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <WalletProvider>{children}</WalletProvider>
}
