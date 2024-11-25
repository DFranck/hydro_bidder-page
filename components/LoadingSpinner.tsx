import { Icon } from "@/components/Icon"
import { twMerge } from "tailwind-merge"

export function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={twMerge(
        `
          pointer-events-none
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-4xl
          opacity-0
          transition-all
        `,
        isLoading && "opacity-100"
      )}
    >
      <Icon className="animate-spin" name="solid:loader" />
    </div>
  )
}
