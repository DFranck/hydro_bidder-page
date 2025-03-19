"use client"

import { ComponentProps, ElementType, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { useIsClient } from "usehooks-ts"

type ModalWindowProps<T extends ElementType = "section"> = ComponentProps<T> & {
  as?: T
  isOpen: boolean
  propsForBackdrop?: ComponentProps<"div">
  onClose: () => void
  onCloseComplete?: () => void
}

export function ModalWindow<T extends ElementType = "section">({
  as,
  children,
  className,
  isOpen,
  propsForBackdrop,
  onClose,
  onCloseComplete,
  duration = 500,
  ...otherProps
}: ModalWindowProps<T>) {
  const isClient = useIsClient()
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [modalState, setModalState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed")
  const isOpenOrOpening = ["open", "opening"].includes(modalState)
  const isClosedOrClosing = ["closed", "closing"].includes(modalState)
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      clearTimers()

      timerRefs.current.push(
        setTimeout(() => {
          setModalState("opening")

          timerRefs.current.push(
            setTimeout(() => {
              setModalState("open")
            }, duration)
          )
        }, 100)
      )

      return clearTimers
    } else {
      handleClickClose()
    }
  }, [isOpen, duration])

  useEffect(() => {
    const shortcuts: Record<string, () => void> = {
      Escape: handleClickClose,
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key in shortcuts) {
        shortcuts[event.key]()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  function handleClickClose() {
    clearTimers()
    setModalState("closing")

    timerRefs.current.push(
      setTimeout(() => {
        setModalState("closed")
        onClose()
        onCloseComplete?.()
        setShouldRender(false)
      }, duration)
    )
  }

  function clearTimers() {
    timerRefs.current.forEach((timer) => clearTimeout(timer))
    timerRefs.current = []
  }

  const Component = String(as || "section") as ElementType

  return !isClient
    ? null
    : createPortal(
        shouldRender && (
          <>
            <ModalWindow.Backdrop
              {...propsForBackdrop}
              className={twMerge(
                `
                  pointer-events-none
                  opacity-0
                  transition-all
                `,
                isOpenOrOpening &&
                  `
                    pointer-events-auto
                    opacity-100
                  `,
                propsForBackdrop?.className
              )}
              style={{ transitionDuration: duration }}
              onClick={(...args) => {
                handleClickClose()
                propsForBackdrop?.onClick?.(...args)
              }}
            />

            <Component
              className={twMerge(
                `
                  fixed
                  left-1/2
                  top-1/2
                  z-40
                  -translate-x-1/2
                  -translate-y-1/2
                  transition-all
                `,
                isOpenOrOpening &&
                  `
                    scale-100
                    opacity-100
                  `,
                isClosedOrClosing &&
                  `
                    pointer-events-none
                    scale-75
                    opacity-0
                  `,
                className
              )}
              style={{ transitionDuration: duration }}
              {...otherProps}
            >
              {children}
            </Component>
          </>
        ),
        document.body
      )
}

ModalWindow.Backdrop = function Backdrop({
  className,
  ...otherProps
}: ComponentProps<"div">) {
  return (
    <div
      className={twMerge(
        `
          fixed
          inset-0
          z-30
          backdrop-blur-md
        `,
        className
      )}
      {...otherProps}
    />
  )
}
