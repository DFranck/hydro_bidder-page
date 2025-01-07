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
  toastsContainer: twJoin(`
    group/toasts-container
    fixed
    bottom-6
    right-6
    top-6
    z-50
    flex
    w-96
    flex-col-reverse
    items-end
    gap-3
    transition-opacity
    [&:not(:has(.js-toast))]:pointer-events-none
    [&:not(:has(.js-toast))]:opacity-0
    [&_.js-toast-container]:w-full
  `),
  toastContainer: twJoin(`
    grid
    grid-cols-[min-content,auto,min-content]
    grid-rows-2
    items-center
    rounded-md
    text-xs
    text-white
    backdrop-blur-md
  `),
  gradientOverlay: twJoin(`
    pointer-events-none
    absolute
    -bottom-6
    -right-6
    -z-10
    h-1/3
    w-screen
    bg-gradient-to-tl
    from-palette-text
    via-transparent
    to-transparent
  `),
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
