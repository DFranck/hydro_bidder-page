import { twMerge } from "tailwind-merge"

interface InputWithCustomUnitProps {
  value: number | string
  onChange: (v: number) => void
  unit?: string
  min?: number
  max?: number
  id?: string
  ariaLabel?: string
  maxLength?: number
  className?: string
  inputClassName?: string
  disabled?: boolean
}

export function InputWithCustomUnit({
  value,
  onChange,
  unit = "%",
  min = 0,
  max = undefined,
  maxLength = undefined,
  id,
  ariaLabel,
  className,
  inputClassName,
  disabled,
}: InputWithCustomUnitProps) {
  const getPadding = (unit?: string) => {
    const base = 12
    const unitLength = unit?.length || 0
    return base + unitLength * 7.5
  }
  const getWidth = (unit?: string) => {
    const base = 50
    const unitLength = unit?.length || 0
    return base + unitLength * 7
  }

  return (
    <div className={twMerge("relative inline-block", className)}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        aria-label={ariaLabel ?? (unit ? `Value in ${unit}` : undefined)}
        disabled={disabled}
        maxLength={maxLength}
        style={{ paddingRight: getPadding(unit), width: getWidth(unit) }}
        onChange={(e) => {
          let raw = e.target.value.replace(/\D/g, "")
          if (raw.length > 1) raw = raw.replace(/^0+/, "")
          let num =
            raw === ""
              ? ""
              : Math.max(
                  min,
                  max !== undefined ? Math.min(Number(raw), max) : Number(raw),
                )
          onChange(num as number)
        }}
        className={twMerge(
          "rounded-[4px] border bg-transparent",
          "h-[28px]",
          "text-right",
          "[appearance:textfield]",
          "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          inputClassName,
        )}
      />
      {unit && (
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white/60">
          {unit}
        </span>
      )}
    </div>
  )
}
