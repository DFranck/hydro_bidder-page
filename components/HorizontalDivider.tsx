import { twMerge } from "tailwind-merge"

export function HorizontalDivider({ className }: { className?: string }) {
  return (
    <div className={twMerge("my-12 flex w-full items-center py-5", className)}>
      <div className="grow border-t border-[#FFE1B8]"></div>
    </div>
  )
}
