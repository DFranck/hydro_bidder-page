import { WalletProvider } from '@/components/WalletProvider'
import { AppHeader } from '@v2/components/AppHeader'
import { AppPageContainer } from '@v2/components/AppPageContainer'
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
    <WalletProvider>
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
            // 'sidebar-open:grid-areas-mobile-sidebar-open',
            // 'sidebar-closed:grid-areas-mobile-sidebar-closed',
            // 'desktop:sidebar-open:grid-areas-desktop-sidebar-open',
            // 'desktop:sidebar-closed:grid-areas-desktop-sidebar-closed',
            '**:scrollbar-thumb-palette-beige',
            '**:scrollbar-track-background',
            '**:scrollbar-thin',
          )}
        >
          <AppHeader />

          <main className="contents">
            {/* <Sidebar /> */}

            <AppPageContainer>{children}</AppPageContainer>
          </main>

          {modal}
        </div>
      </WalletDataProvider>
    </WalletProvider>
  )
}
