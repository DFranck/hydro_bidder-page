import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { Toast as ToastType, useToasts } from "@/components/Toasts/useToasts"
import { get } from "lodash"
import { ComponentProps, useState } from "react"
import { twMerge } from "tailwind-merge"
import { classNames } from "./classNames"

interface ToastProps
  extends ComponentProps<"div">,
    Omit<ToastType, "message" | "variant" | "_id"> {
  icon?: IconString
  variant?: keyof (typeof classNames)["variants"]
}

export function Toast({
  id,
  actionButton,
  children,
  className,
  icon,
  isDismissible: isDismissibleOverride,
  variant = "info",
  ...otherProps
}: ToastProps) {
  const { setToasts } = useToasts()
  const [isDismissed, setIsDismissed] = useState(false)
  const isDismissible =
    isDismissibleOverride ??
    get(classNames.variants[variant], "isDismissible", true)

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
          {icon ? (
            <Icon name={icon} variant="light" />
          ) : (
            classNames.variants[variant].icon
          )}
        </div>

        {children && (
          <div className={classNames.messageContainer}>{children}</div>
        )}

        {(isDismissible || actionButton) && (
          <div className={classNames.actionButtonsContainer}>
            {actionButton && (
              <button
                className={classNames.actionButton({
                  hasDismissButton: isDismissible,
                })}
                onClick={() => {
                  actionButton.onClick()
                  handleDismiss()
                }}
              >
                {actionButton.label}
              </button>
            )}
            {isDismissible && (
              <button
                className={classNames.dismissButton({
                  hasActionButton: Boolean(actionButton),
                })}
                onClick={handleDismiss}
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </CollapsibleBox>
  )
}
