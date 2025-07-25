"use client"

import { Icon } from "@/components/Icon"
import { twMerge } from "tailwind-merge"

type CheckboxWithCustomCheckProps = React.ComponentPropsWithoutRef<"input"> & {
  checked: boolean
}

export function CheckboxWithCustomCheck({
  className,
  checked,
  disabled,
  ...props
}: CheckboxWithCustomCheckProps) {
  return (
    <span className="relative flex items-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className={twMerge(
          "peer size-4 appearance-none rounded border-2 outline-none",
          "checked:border-transparent checked:bg-palette-green",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
        {...props}
      />
      <span className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
        <Icon name="solid:check" className="text-[10px] font-bold text-black" />
      </span>
    </span>
  )
}
