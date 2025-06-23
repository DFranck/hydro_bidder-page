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

  const fetchData = useCallback(async (walletAddress: string) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchWalletData(walletAddress)

      // Check if this request was cancelled
      if (abortControllerRef.current.signal.aborted) {
        return
      }

      setWalletData(data)
      lastAddressRef.current = walletAddress
    } catch (err) {
      // Don't set error if request was cancelled
      if (!abortControllerRef.current.signal.aborted) {
        setError(err instanceof Error ? err : new Error('Failed to fetch wallet data'))
      }
    } finally {
      // Only update loading state if this request wasn't cancelled
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!address) {
      setWalletData(null)
      setError(null)
      setIsLoading(false)
      lastAddressRef.current = null
      return
    }

    // Only fetch if address has changed
    if (lastAddressRef.current !== address) {
      fetchData(address)
    }

    // Cleanup function to cancel ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [address, fetchData])

  const refetch = useCallback(() => {
    if (address) {
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
