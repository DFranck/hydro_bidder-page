"use client"

import { ComponentProps, useEffect, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"

interface ScrollIndicatorProps extends ComponentProps<"div"> {
  containerSelector: string
  targetSelector: string
}

export function ScrollIndicator({
  containerSelector,
  targetSelector,
  className,
  ...otherProps
}: ScrollIndicatorProps) {
  const [targets, setTargets] = useState<Element[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const targets = Array.from(container.querySelectorAll(targetSelector))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = targets.findIndex((target) =>
              entry.target.isSameNode(target)
            )
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        root: container,
        threshold: 1,
      }
    )

    targets.forEach((target) => {
      observer.observe(target)
    })

    setTargets(targets)

    return () => observer.disconnect()
  }, [containerSelector])

  return (
    <div
      className={twMerge("flex items-center justify-center", className)}
      {...otherProps}
    >
      {targets.map((_, index) => (
        <button
          key={index}
          aria-label={`Go to bucket ${index + 1}`}
          className={twJoin("px-2 py-4", "transition-all")}
          onClick={() => {
            targets[index]?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <div
            className={twJoin(
              "size-4 rounded-full",
              activeIndex === index
                ? "bg-palette-beige scale-150"
                : "bg-palette-beige/30 hover:bg-palette-beige/50"
            )}
          />
        </button>
      ))}
    </div>
  )
}
