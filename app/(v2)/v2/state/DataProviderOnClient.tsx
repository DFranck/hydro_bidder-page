'use client'

import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { LoadingSpinner } from '@v2/components/LoadingSpinner'
import { useProcessedData } from '@v2/hooks'
import { AppAction, AppState, SourceID } from '@v2/types'
import dynamic from 'next/dynamic'
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

const QueryClientProvider = dynamic(
  () =>
    import('@/components/QueryClientProvider').then(
      (mod) => mod.QueryClientProvider,
    ),
  {
    loading: () => <LoadingSpinner isFullscreen useGlobalState />,
    ssr: false, // Since react-query needs browser APIs
  },
)

const ToastContextProvider = dynamic(
  () => import('@/components/Toasts').then((mod) => mod.ToastContextProvider),
  {
    loading: () => <LoadingSpinner isFullscreen useGlobalState />,
    ssr: false,
  },
)

const ChainsAndSignersProvider = dynamic(
  () =>
    import('@/components/ChainsAndSignersProvider').then(
      (mod) => mod.ChainsAndSignersProvider,
    ),
  {
    loading: () => <LoadingSpinner isFullscreen useGlobalState />,
    ssr: false,
  },
)

const GlobalLockupInfoProvider = dynamic(
  () =>
    import('@/components/GlobalLockupInfoProvider').then(
      (mod) => mod.GlobalLockupInfoProvider,
    ),
  {
    loading: () => <LoadingSpinner isFullscreen useGlobalState />,
    ssr: false,
  },
)

const IncompleteNoticesProvider = dynamic(
  () =>
    import('@/components/IncompleteNoticesProvider').then(
      (mod) => mod.IncompleteNoticesProvider,
    ),
  {
    loading: () => <LoadingSpinner isFullscreen useGlobalState />,
    ssr: false,
  },
)

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
    if (!hydroData) return 'no-data'
    const hasWalletData = hydroData.some((data) => data.data.walletData)
    return `hydro-${hasWalletData ? 'with-wallet' : 'no-wallet'}-${JSON.stringify(hydroData).length}`
  }, [hydroData])

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
        isLoading: combinedIsLoading,
      },
    })
  }, [
    hydroDataKey,
    filteredBidDescriptions,
    currentRoundDataPerSource,
    combinedIsLoading,
    isWalletDataLoading,
  ])

  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', payload: combinedIsLoading })
  }, [combinedIsLoading])

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
                <AppContext value={{ state, dispatch }}>{children}</AppContext>
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
