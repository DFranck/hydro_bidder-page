import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { QueryClientProvider } from "@/components/QueryClientProvider"
import { ScrollIndicator } from "@/components/ScrollIndicator"
import { ToastContextProvider } from "@/components/Toasts"
import { WalletProvider } from "@/components/WalletProvider"
import { ReactNode } from "react"

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <QueryClientProvider>
        <ToastContextProvider>
          <div
            className="
              fixed
              bottom-0
              left-0
              right-0
              top-0
              -z-10
              bg-black
              bg-[url('/images/AdobeStock_633966567.jpg')]
              bg-cover
              bg-no-repeat
            "
          />
          <div
            className="
              grid
              min-h-screen
              grid-rows-[auto_1fr_auto]
            "
          >
            <Header />
            <div>{children}</div>
            <Footer />
          </div>
          <ScrollIndicator />
        </ToastContextProvider>
      </QueryClientProvider>
    </WalletProvider>
  )
}
