import { AppPageContainer } from '@/app/(v2)/v2/components/AppPageContainer'
import { AppHeader } from '@v2/components/AppHeader'
import { Sidebar } from '@v2/components/Sidebar'
import { fetchData } from '@v2/state/fetchData'
import { ServerDataProvider } from '@v2/state/ServerDataProvider'
import { twJoin } from 'tailwind-merge'

export default async function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const { hydroDataPromise, bidDescriptionsPromise } = await fetchData()
  const hydroData = await hydroDataPromise
  const bidDescriptions = await bidDescriptionsPromise

  return (
    <div
      className={twJoin(
        'relative h-screen w-screen',
        'bg-background gap-tight',
        'px-loose desktop:px-standard',
        'py-standard desktop:py-tight',
        'sidebar-open:grid-areas-mobile-sidebar-open',
        'sidebar-closed:grid-areas-mobile-sidebar-closed',
        'desktop:sidebar-open:grid-areas-desktop-sidebar-open',
        'desktop:sidebar-closed:grid-areas-desktop-sidebar-closed',
        '**:scrollbar-thumb-palette-beige',
        '**:scrollbar-track-background',
        '**:scrollbar-thin',
      )}
    >
      <ServerDataProvider
        hydroData={hydroData}
        bidDescriptions={bidDescriptions}
      >
        <AppHeader />

        <main className="contents">
          <Sidebar />

          <AppPageContainer>{children}</AppPageContainer>
        </main>

        {modal}
      </ServerDataProvider>
    </div>
  )
}
