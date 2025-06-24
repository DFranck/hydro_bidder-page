import { WalletButton } from '@/app/(v2)/v2/components/WalletButton'
import { AppHeader } from '@v2/components/AppHeader'
import { AppPageContainer } from '@v2/components/AppPageContainer'
import { ClientWalletProvider } from '@v2/components/ClientWalletProvider'
import { LayoutLoadingOverlay } from '@v2/components/LayoutLoadingOverlay'
import { WalletDataProvider } from '@v2/components/WalletDataProvider'
import { fetchData } from '@v2/state/fetchData'
import { twJoin } from 'tailwind-merge'

export default async function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const initialDataPromises = fetchData()

  return (
    <ClientWalletProvider>
      <WalletDataProvider initialDataPromises={initialDataPromises}>
        <div
          className={twJoin(
            'relative h-screen w-screen',
            'bg-background gap-tight',
            'p-standard',
            'grid-areas-mobile-no-sidebar',
            'desktop:grid-areas-desktop-no-sidebar',
            'desktop:px-standard',
            'desktop:py-tight',
            '**:scrollbar-thumb-palette-beige',
            '**:scrollbar-track-background',
            '**:scrollbar-thin',
          )}
        >
          <AppHeader />

          <main className="contents">
            <AppPageContainer>{children}</AppPageContainer>
          </main>

          {modal}
        </div>

        <WalletButton />
        <LayoutLoadingOverlay />
      </WalletDataProvider>
    </ClientWalletProvider>
  )
}
