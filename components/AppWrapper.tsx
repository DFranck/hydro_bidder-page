"use client"

import LoadingState from "@/app/loading"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { QueryClientProvider } from "@/components/QueryClientProvider"
import { ScrollIndicator } from "@/components/ScrollIndicator"
import { ToastContextProvider } from "@/components/Toasts"
import { WalletProvider } from "@/components/WalletProvider"
import { RawBackendDataBeforeWallet } from "@/contract-apis/types"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"
import { ReactNode } from "react"
import { twJoin } from "tailwind-merge"

export function AppWrapper({
  children,
  rawBackendDataBeforeWallet,
}: {
  children: ReactNode
  rawBackendDataBeforeWallet?: RawBackendDataBeforeWallet
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
