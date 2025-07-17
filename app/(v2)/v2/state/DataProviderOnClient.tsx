'use client'

import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { useProcessedData } from '@v2/hooks/useProcessedData'
import { AppAction, AppState, SourceID } from '@v2/types'
import { usePathname } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { initialState } from './DataProviderOnServer'
import { reducer } from './reducer'

import { ChainsAndSignersProvider } from '@/components/ChainsAndSignersProvider'
import { GlobalLockupInfoProvider } from '@/components/GlobalLockupInfoProvider'
import { IncompleteNoticesProvider } from '@/components/IncompleteNoticesProvider'
import { QueryClientProvider } from '@/components/QueryClientProvider'
import { ToastContextProvider } from '@/components/Toasts'

export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
}>({
  state: initialState,
  dispatch: () => {},
})

interface DataProviderOnClientProps {
  children: React.ReactNode
  hydroData: Array<{
    sourceId: SourceID
    data: {
      constants: any
      totalLockedTokens: number
      currentRound: any
      tranches: Tranche[]
      augmentedBids: BidRevampMetrics[]
      walletData?: any
      roundPrices?: any
      atomPrice?: number
    }
  }> | null
  bidDescriptions: Record<number, BidMetaData>
  isWalletDataLoading?: boolean
}

export function DataProviderOnClient({
  children,
  hydroData,
  bidDescriptions,
  isWalletDataLoading = false,
}: DataProviderOnClientProps) {
  const pathname = usePathname()
  const previousPathnameRef = useRef(pathname)

  const { currentRoundDataPerSource, filteredBidDescriptions, isLoading } =
    useProcessedData(hydroData, bidDescriptions)

  const combinedIsLoading = isLoading || isWalletDataLoading

  const hydroDataKey = useMemo(() => {
    if (!hydroData) return `no-data-${pathname}`
    const hasWalletData = hydroData.some((data) => data.data.walletData)
    return `hydro-${hasWalletData ? 'with-wallet' : 'no-wallet'}-${JSON.stringify(hydroData).length}-${pathname}`
  }, [hydroData, pathname])

  const initialStateWithData = useMemo(
    () => ({
      ...initialState,
      bidDescriptionsById: filteredBidDescriptions,
      currentRoundDataPerSource,
      isLoading: combinedIsLoading,
    }),
    [filteredBidDescriptions, currentRoundDataPerSource, combinedIsLoading],
  )

  const [state, dispatch] = useReducer(reducer, initialStateWithData)

  useEffect(() => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        ...initialState,
        bidDescriptionsById: filteredBidDescriptions,
        currentRoundDataPerSource,
      },
    })
  }, [
    hydroDataKey,
    filteredBidDescriptions,
    currentRoundDataPerSource,
    isWalletDataLoading,
  ])

  useEffect(() => {
    if (state.isLoading !== combinedIsLoading) {
      dispatch({ type: 'SET_IS_LOADING', payload: combinedIsLoading })
    }
  }, [combinedIsLoading, state.isLoading])

  useEffect(() => {
    if (state.isLoading && pathname !== previousPathnameRef.current) {
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
    previousPathnameRef.current = pathname
  }, [pathname, state.isLoading])

  return (
    <div key={hydroDataKey}>
      <QueryClientProvider>
        <ToastContextProvider>
          <ChainsAndSignersProvider>
            <GlobalLockupInfoProvider>
              <IncompleteNoticesProvider>
                <AppContext.Provider value={{ state, dispatch }}>
                  {children}
                </AppContext.Provider>
              </IncompleteNoticesProvider>
            </GlobalLockupInfoProvider>
          </ChainsAndSignersProvider>
        </ToastContextProvider>
      </QueryClientProvider>
    </div>
  )
}

export function useAppState() {
  return useContext(AppContext)
}
