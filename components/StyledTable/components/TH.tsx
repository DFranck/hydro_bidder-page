import { Icon } from "@/components/Icon"
import { ComponentProps, useEffect, useRef } from "react"
import { twMerge } from "tailwind-merge"

export function TH({
  children,
  className,
  isSortable,
  isSorted,
  sortDirection,
  textAlign,
  ...otherProps
}: ComponentProps<"th"> & {
  isSortable?: boolean
  isSorted?: boolean
  sortDirection?: "ASC" | "DESC"
  textAlign?: "center" | "left" | "right"
}) {
  const prevDirectionRef = useRef(sortDirection)

  useEffect(() => {
    if (isSorted && sortDirection) {
      prevDirectionRef.current = sortDirection
    }
  }, [isSorted, sortDirection])

  const effectiveDirection = isSorted ? sortDirection : prevDirectionRef.current

  return (
    <th
      className={twMerge(
        `
          group/table-cell
          flex-grow
          cursor-default
          py-1
          text-sm
          font-normal
          text-neutral-200
          max-sm:block
          sm:px-3
          xl:px-5
        `,
        isSortable &&
          `
            cursor-pointer
            hover:bg-palette-beige/10
          `,
        textAlign === "center"
          ? "sm:text-center"
          : textAlign === "right"
            ? "sm:text-right"
            : "sm:text-left",
        className
      )}
      {...otherProps}
    >
      <span
        className={twMerge(
          `
            relative
            inline-flex
            flex-row
            items-center
            gap-1
            whitespace-nowrap
            opacity-60
            transition-all
            duration-500
          `,
          textAlign === "center"
            ? "text-center"
            : textAlign === "right"
              ? "text-right"
              : "text-left",
          isSorted && "opacity-100",
          textAlign === "center" && "group-hover/table-cell:gap-1",
          textAlign === "center" && isSortable && !isSorted && "gap-0"
        )}
      >
        {children ?? <>&nbsp;</>}
        {isSortable && (
          <div
            className={twMerge(
              `
                origin-center
                transition-all
                duration-500
                group-hover/table-cell:opacity-50
              `,
              isSorted ? "!opacity-100" : "opacity-0",
              effectiveDirection === "ASC" ? "rotate-0" : "rotate-180",
              textAlign === "right" && "-order-1",
              textAlign === "center" && "group-hover/table-cell:max-w-6",
              textAlign === "center" && (isSorted ? "max-w-6" : "max-w-0")
            )}
          >
            <Icon name="solid:chevron-up" />
          </div>
        )}
      </span>
    </th>
  )
}
