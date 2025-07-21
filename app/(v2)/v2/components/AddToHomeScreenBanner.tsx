'use client'

import { Icon } from '@/components/Icon'
import { isTouchscreen } from '@/lib/isTouchscreen'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'

interface AddToHomeScreenBannerProps {
  className?: string
  delay?: number
  permanentlyHideOnDismiss?: boolean
  promptLocalStorageKey?: string
}

export function AddToHomeScreenBanner({
  className,
  delay = 1000,
  permanentlyHideOnDismiss = true,
  promptLocalStorageKey = 'iosPwaPrompt',
}: AddToHomeScreenBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const checkPWAInstallation = () => {
      const userAgent = navigator.userAgent
      const isDev = process.env.NODE_ENV === 'development'

      if (isDev) {
        if (isTouchscreen(userAgent)) {
          setTimeout(() => setIsVisible(true), delay)
        }
        return
      }

      const isIOS = /iPad|iPhone|iPod/.test(userAgent)
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches
      const hasBeenDismissed =
        localStorage.getItem(promptLocalStorageKey) === 'dismissed'
      if (
        isIOS &&
        !isStandalone &&
        !hasBeenDismissed &&
        isTouchscreen(userAgent)
      ) {
        setTimeout(() => setIsVisible(true), delay)
      }
    }
    checkPWAInstallation()
  }, [delay, promptLocalStorageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    if (permanentlyHideOnDismiss) {
      localStorage.setItem(promptLocalStorageKey, 'dismissed')
    }
  }

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div
      className={twJoin(
        'bottom-standard fixed left-1/2 z-50',
        '-translate-x-1/2',
        'bg-palette-green text-background rounded-lg',
        'px-standard py-tight shadow-lg',
        'w-sm',
        className,
      )}
    >
      <div className="gap-tight flex items-center">
        <p>&ldquo;Add to Home Screen&rdquo; for a better experience</p>

        <button onClick={handleDismiss} className="btn-icon">
          <Icon name="xmark" />
        </button>
      </div>

      <div
        className={twJoin(
          'absolute -bottom-1 left-1/2',
          'size-2',
          '-translate-x-1/2 rotate-45',
          'bg-palette-green',
        )}
      ></div>
    </div>
  )
}
