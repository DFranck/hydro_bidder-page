'use client'

import { Tranche } from '@/app/ts_types/HydroBase.types'
import { BidMetaData, BidRevampMetrics } from '@/contract-apis/types'
import { LoadingSpinner } from '@v2/components/LoadingSpinner'
import { SourceID } from '@v2/environments'
import { useProcessedData } from '@v2/hooks'
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
import { AppState, initialState } from './DataProviderOnServer'
import { AppAction, reducer } from './reducer'

const QueryClientProvider = dynamic(
  () =>
    import('@/components/QueryClientProvider').then(
      (mod) => mod.QueryClientProvider,
    ),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Since react-query needs browser APIs
  },
)

const WalletProvider = dynamic(
  () => import('@/components/WalletProvider').then((mod) => mod.WalletProvider),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
)

const ToastContextProvider = dynamic(
  () => import('@/components/Toasts').then((mod) => mod.ToastContextProvider),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
)

const ChainsAndSignersProvider = dynamic(
  () =>
    import('@/components/ChainsAndSignersProvider').then(
      (mod) => mod.ChainsAndSignersProvider,
    ),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
)

const GlobalLockupInfoProvider = dynamic(
  () =>
    import('@/components/GlobalLockupInfoProvider').then(
      (mod) => mod.GlobalLockupInfoProvider,
    ),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
)

const IncompleteNoticesProvider = dynamic(
  () =>
    import('@/components/IncompleteNoticesProvider').then(
      (mod) => mod.IncompleteNoticesProvider,
    ),
  {
    loading: () => <LoadingSpinner />,
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
}

export function DataProviderOnClient({
  children,
  hydroData,
  bidDescriptions,
}: DataProviderOnClientProps) {
  const pathname = usePathname()
  const previousPathnameRef = useRef(pathname)

  // Use the custom hook for data processing
  const { currentRoundDataPerSource, filteredBidDescriptions, isLoading } =
    useProcessedData(hydroData, bidDescriptions)

  const initialStateWithData = useMemo(
    () => ({
      ...initialState,
      bidDescriptionsById: filteredBidDescriptions,
      currentRoundDataPerSource,
      isLoading,
    }),
    [filteredBidDescriptions, currentRoundDataPerSource, isLoading],
  )

  const [state, dispatch] = useReducer(reducer, initialStateWithData)

  // Update state when data changes
  useEffect(() => {
    dispatch({
      type: 'SET_STATE',
      payload: {
        currentRoundDataPerSource,
        bidDescriptionsById: filteredBidDescriptions,
        isLoading,
      },
    })
  }, [currentRoundDataPerSource, filteredBidDescriptions, isLoading])

  // Update loading state when data changes
  useEffect(() => {
    dispatch({ type: 'SET_IS_LOADING', payload: isLoading })
  }, [isLoading])

  // Watch for pathname changes to clear loading state when navigation completes
  useEffect(() => {
    if (state.isLoading && pathname !== previousPathnameRef.current) {
      // Pathname has changed, navigation completed
      dispatch({ type: 'SET_IS_LOADING', payload: false })
    }
    previousPathnameRef.current = pathname
  }, [pathname, state.isLoading])

  console.log(JSON.stringify(state).length, 'bytes', { state })

  return (
    <WalletProvider>
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
    </WalletProvider>
  )
}

export function useAppState() {
  return useContext(AppContext)
}
