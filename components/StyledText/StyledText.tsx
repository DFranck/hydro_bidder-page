import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { ComponentProps, ElementType, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { Tooltip } from "../Tooltip"
import { classNames } from "./classNames"

type StyledTextVariant = keyof typeof classNames

export type StyledTextProps<T extends ElementType = "span"> = Omit<
  ComponentProps<T>,
  "variant"
> & {
  as?: T
  variant?: StyledTextVariant | StyledTextVariant[]
  tooltip?: ReactNode
}

export function StyledText<T extends ElementType = "span">({
  as,
  children,
  className,
  variant,
  tooltip = null,
  ...otherProps
}: StyledTextProps<T>) {
  const Component = as || "span"

  const classNamesForVariant = Array.isArray(variant)
    ? variant.map((v) => classNames[v])
    : variant
      ? classNames[variant]
      : ``

  const hasTooltip = tooltip !== null

  return (
    <ConditionalWrapper
      condition={hasTooltip}
      wrapper={(children) => (
        <Tooltip tipContents={tooltip}>{children}</Tooltip>
      )}
    >
      <Component
        className={twMerge(classNamesForVariant, className)}
        {...otherProps}
      >
        {children}
      </Component>
    </ConditionalWrapper>
  )
}
