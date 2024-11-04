import { cn } from "@/lib/utils"

export function HorizontalDivider({ className }: { className?: string }) {
  return (
    <div className={cn("my-12 flex w-full items-center py-5", className)}>
      <div className="flex-grow border-t border-[#FFE1B8]"></div>
    </div>
  )
}
