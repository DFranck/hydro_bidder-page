'use client'

import { useAppState } from '@v2/state/DataProviderOnClient'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Hook for programmatic navigation with automatic loading state management
 *
 * @returns Object containing navigate function and loading state
 *
 * @example
 * const { navigate, isLoading } = useInternalLink()
 *
 * // Navigate programmatically
 * navigate('/v2/bids/neutron/123')
 *
 * // Check if currently navigating
 * if (isLoading) {
 *   // Show loading indicator
 * }
 */
export function useInternalLink() {
  const router = useRouter()
  const { state, dispatch } = useAppState()
  const { isLoading } = state

  const navigate = useCallback(
    (href: string) => {
      if (isLoading || !href) return

      dispatch({ type: 'SET_IS_LOADING', payload: true })

      router.push(href)
    },
    [isLoading, dispatch, router],
  )

  return { navigate, isLoading }
}

type InternalLinkProps = React.ComponentProps<'a'> & {
  disabled?: boolean
}

/**
 * InternalLink component that handles global loading state automatically
 *
 * This component automatically manages the global loading state when navigating
 * to internal routes within the v2 app. It provides immediate visual feedback
 * and handles loading state cleanup.
 *
 * @example
 * // Basic usage
 * <InternalLink href="/v2/bids/neutron/123">
 *   View Bid Details
 * </InternalLink>
 *
 * @example
 * // With custom onClick
 * <InternalLink
 *   href="/v2/bids/neutron/123"
 *   onClick={() => console.log('Navigating...')}
 * >
 *   View Bid Details
 * </InternalLink>
 *
 * @example
 * // Disabled state
 * <InternalLink href="/v2/bids/neutron/123" disabled>
 *   View Bid Details
 * </InternalLink>
 */
export function InternalLink({
  href,
  children,
  onClick,
  disabled,
  ...otherProps
}: InternalLinkProps) {
  const { navigate, isLoading } = useInternalLink()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (disabled || isLoading || !href) return

    onClick?.(e)

    navigate(href)
  }

  const isDisabled = disabled || isLoading

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      {...otherProps}
    >
      {children}
    </a>
  )
}
