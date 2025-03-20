import { Icon } from "@/components/Icon"
import { twJoin } from "tailwind-merge"

export const classNamesAndVariants = {
  variants: {
    error: {
      container: "bg-palette-red/90",
      icon: <Icon name="light:circle-exclamation" />,
    },
    success: {
      container: "bg-palette-green/90 text-palette-text",
      icon: <Icon name="light:circle-check" />,
    },
    info: {
      container: "bg-palette-blue/90",
      icon: <Icon name="light:circle-info" />,
    },
    neutral: {
      container: "bg-white/90 text-palette-text",
      icon: <Icon name="light:circle-info" />,
    },
    warning: {
      container: "bg-palette-beige/90 text-palette-text",
      icon: <Icon name="light:circle-exclamation" />,
    },
    working: {
      container: "bg-palette-beige/90 text-palette-text",
      icon: (
        <div className="inline-flex animate-spin">
          <Icon name="light:loader" />
        </div>
      ),
    },
    workingInBackground: {
      container: "bg-black text-white rounded-full w-min pr-3 ml-auto",
      icon: (
        <div className="inline-flex animate-spin">
          <Icon name="light:loader" />
        </div>
      ),
    },
  },
  iconContainer: twJoin(`
    row-span-2
    flex
    h-full
    flex-col
    p-3
    pr-0
    text-2xl
  `),
  messageContainer: twJoin(`
    row-span-2
    overflow-x-auto
    text-balance
    p-3
  `),
  actionButtonsContainer: twJoin(`
    row-span-2
    grid
    grid-rows-subgrid
    overflow-hidden
    rounded-r-md
    border-l-2
    border-white/20
  `),
  actionButton: twJoin(`
    row-span-1
    px-3
    py-1
    bg-blend-overlay
    only:row-span-2
    hover:bg-black/10
    [&+&]:border-t-2
    [&+&]:border-white/20
  `),
}
