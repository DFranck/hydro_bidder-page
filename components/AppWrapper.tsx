"use client"

import Loading from "@/app/loading"
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

const WalletProvider = dynamic(
  () => import("@/components/WalletProvider").then((mod) => mod.WalletProvider),
  {
    loading: () => <Loading />,
    ssr: false,
  }
)

import { BackendDataTweaker } from "@/components/BackendDataTweakerLoader"

const QueryClientProvider = dynamic(
  () =>
    import("@/components/QueryClientProvider").then(
      (mod) => mod.QueryClientProvider
    ),
  {
    loading: () => <Loading />,
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
                  <Suspense
                    fallback={
                      <div className="fixed inset-12 z-50 bg-red-500">
                        Tweaker failed to load
                      </div>
                    }
                  >
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
