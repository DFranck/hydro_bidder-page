"use client"

import { Icon } from "@/components/Icon"
import { ComponentProps, ReactNode, useEffect, useState } from "react"
import { twJoin, twMerge } from "tailwind-merge"

interface ScrollIndicatorProps extends ComponentProps<"div"> {
  containerSelector: string
  targetSelector: string
  renderDot?: (props: {
    target: Element
    index: number
    isActive: boolean
    spreadProps: ComponentProps<"button">
  }) => ReactNode
}

export function ScrollIndicator({
  containerSelector,
  targetSelector,
  className,
  renderDot,
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
        threshold: 0.8,
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
      {targets.map((_, index) => {
        const isActive = activeIndex === index
        const spreadProps = {
          "aria-label": `Go to bucket ${index + 1}`,
          onClick: () => {
            targets[index]?.scrollIntoView({ behavior: "smooth" })
          },
        }

        if (renderDot) {
          return renderDot({
            target: targets[index],
            index,
            isActive,
            spreadProps,
          })
        }

        return (
          <button
            {...spreadProps}
            key={index}
            className={twJoin(
              "group",
              "px-2 py-4",
              "transition-all",
              isActive ? "scale-150" : "group-hover:scale-125"
            )}
          >
            <Icon name="solid:circle" />
          </button>
        )
      })}
    </div>
  )
}
