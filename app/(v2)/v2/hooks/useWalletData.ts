import { fetchWalletData } from '@v2/state/fetchWalletData'
import { useCallback, useEffect, useRef, useState } from 'react'

interface WalletDataResult {
  sourceId: string
  walletData: any
}

export function useWalletData(address: string | null) {
  const [walletData, setWalletData] = useState<WalletDataResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastAddressRef = useRef<string | null>(null)
  const lastDataRef = useRef<WalletDataResult[] | null>(null)
  const isFetchingRef = useRef(false)

  const fetchData = useCallback(async (walletAddress: string) => {
    if (isFetchingRef.current) {
      return
    }

    isFetchingRef.current = true

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchWalletData(walletAddress)

      if (abortControllerRef.current.signal.aborted) {
        return
      }

      const dataString = JSON.stringify(data)
      const lastDataString = JSON.stringify(lastDataRef.current)

      if (dataString !== lastDataString) {
        setWalletData(data)
        lastDataRef.current = data
      }

      lastAddressRef.current = walletAddress
    } catch (err) {
      console.error('useWalletData: Error fetching wallet data:', err)
      if (!abortControllerRef.current.signal.aborted) {
        setError(err instanceof Error ? err : new Error('Failed to fetch wallet data'))
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false)
      }
      isFetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!address) {
      setWalletData(null)
      setError(null)
      setIsLoading(false)
      lastAddressRef.current = null
      lastDataRef.current = null
      isFetchingRef.current = false

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      return
    }

    if (lastAddressRef.current !== address && !isFetchingRef.current) {
      fetchData(address)
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [address])

  const refetch = useCallback(() => {
    if (address && !isFetchingRef.current) {
      fetchData(address)
    }
  }, [address, fetchData])

  return {
    walletData,
    isLoading,
    error,
    refetch,
  }
}
