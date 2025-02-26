"use client"

import LoadingState from "@/app/loading"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { ScrollIndicator } from "@/components/ScrollIndicator"
import { ToastContextProvider } from "@/components/Toasts"
import { BackendDataBeforeWalletSlimmed } from "@/contract-apis/types"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"
import dynamic from "next/dynamic"
import { ReactNode, Suspense } from "react"
import { twJoin } from "tailwind-merge"

// Dynamic imports for heavy components
const WalletProvider = dynamic(
  () => import("@/components/WalletProvider").then((mod) => mod.WalletProvider),
  {
    loading: () => <LoadingState />,
    ssr: false,
  }
)

const BackendDataTweaker = dynamic(
  () =>
    import("@/components/BackendDataTweakerLoader").then(
      (mod) => mod.BackendDataTweaker
    ),
  {
    loading: () => null,
    ssr: false,
  }
)

const QueryClientProvider = dynamic(
  () =>
    import("@/components/QueryClientProvider").then(
      (mod) => mod.QueryClientProvider
    ),
  {
    loading: () => <LoadingState />,
    ssr: false, // Since react-query needs browser APIs
  }
)

export function AppWrapper({
  children,
  backendDataBeforeWalletSlimmed: rawBackendDataBeforeWallet,
}: {
  children: ReactNode
  backendDataBeforeWalletSlimmed?: BackendDataBeforeWalletSlimmed
}) {
  return (
    <WalletProvider>
      <QueryClientProvider>
        <ToastContextProvider>
          <LoadingState />

          <div
            className={twJoin(
              "fixed inset-0 -z-10",
              "bg-black bg-[url('/images/hydro-bg-quality-half.jpg')] bg-cover bg-no-repeat"
            )}
          />

          <div
            className="
              grid
              min-h-screen
              grid-rows-[auto_1fr_auto]
            "
          >
            <ConditionalWrapper
              condition={Boolean(
                rawBackendDataBeforeWallet &&
                  rawBackendDataBeforeWallet !== null
              )}
              wrapper={(children) => (
                <BackendDataContextProvider
                  rawBackendDataBeforeWallet={rawBackendDataBeforeWallet!}
                >
                  {children}
                  <Suspense fallback={null}>
                    <BackendDataTweaker />
                  </Suspense>
                </BackendDataContextProvider>
              )}
            >
              <Header />
              <div>{children}</div>
              <Footer />
            </ConditionalWrapper>
          </div>
          <ScrollIndicator />
        </ToastContextProvider>
      </QueryClientProvider>
    </WalletProvider>
  )
}
