import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { useToasts } from "@/components/Toasts/useToasts"
import { ComponentProps, useState } from "react"
import { twMerge } from "tailwind-merge"
import { classNames } from "./classNames"

interface ToastProps extends ComponentProps<"div"> {
  icon?: IconString
  isDismissible?: boolean
  variant?: keyof (typeof classNames)["variants"]
}

export function Toast({
  id,
  children,
  className,
  icon,
  isDismissible = true,
  variant = "info",
  ...otherProps
}: ToastProps) {
  const { setToasts } = useToasts()
  const [isDismissed, setIsDismissed] = useState(false)

  function handleDismiss() {
    setIsDismissed(true)
  }

  function dismiss() {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast._id !== id))
  }

  return (
    <CollapsibleBox
      isCollapsed={isDismissed}
      onCollapseEnd={dismiss}
      {...otherProps}
    >
      <div
        className={twMerge(
          "js-toast",
          classNames.toastContainer,
          classNames.variants[variant].container,
          className
        )}
      >
        <div className={classNames.iconContainer}>
          {icon ? <Icon name={icon} /> : classNames.variants[variant].icon}
        </div>

        <div className={classNames.messageContainer}>{children}</div>

        {isDismissible && (
          <div className={classNames.dismissButtonContainer}>
            <button
              className={classNames.dismissButton}
              onClick={handleDismiss}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </CollapsibleBox>
  )
}
