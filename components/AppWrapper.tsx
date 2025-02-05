import LoadingState from "@/app/loading"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { QueryClientProvider } from "@/components/QueryClientProvider"
import { ScrollIndicator } from "@/components/ScrollIndicator"
import { ToastContextProvider } from "@/components/Toasts"
import { WalletProvider } from "@/components/WalletProvider"
import { BackendDataBeforeWallet } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { BackendDataContextProvider } from "@/contract-apis/useBackendData"
import { ReactNode } from "react"

export function AppWrapper({
  children,
  backendData,
}: {
  children: ReactNode
  backendData?: BackendDataBeforeWallet
}) {
  return (
    <WalletProvider>
      <QueryClientProvider>
        <ToastContextProvider>
          <LoadingState />

          <div
            className="
              grid
              min-h-screen
              grid-rows-[auto_1fr_auto]
            "
          >
            <ConditionalWrapper
              condition={Boolean(backendData && backendData !== null)}
              wrapper={(children) => (
                <BackendDataContextProvider backendData={backendData!}>
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
