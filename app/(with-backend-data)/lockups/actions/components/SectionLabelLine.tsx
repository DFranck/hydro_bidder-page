"use client"

import { twMerge } from "tailwind-merge"

interface SectionLabelLineProps {
  label: string
  className?: string
}

export default function SectionLabelLine({
  label,
  className,
}: SectionLabelLineProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wide text-white/60",
        className,
      )}
    >
      <div className="h-[2px] flex-1 bg-white/20" />
      <span>{label}</span>
      <div className="h-[2px] flex-1 bg-white/20" />
    </div>
  )
}
