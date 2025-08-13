import { Icon } from "@/components/Icon";
import { StyledText } from "@/components/StyledText";
import { useEffect, useMemo, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";
import { Dropdown } from "./Dropdown";

const DEFAULT_PRESETS = [10, 20, 50] as const;

type LockupPremiumSelectProps = {
  value?: number;
  onChange: (value: number) => void;
  presets?: readonly number[]; 
  defaultCustom?: number; 
  min?: number; 
  max?: number| null; 
  step?: number;
  label?: string; 
  className?: string;
};

export default function LockupPremiumSelect({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  defaultCustom = 50,
  min = 0,
  max = null,
  step = 1,
  label = "PREMIUM",
  className = "",
}: LockupPremiumSelectProps) {
  const isCustom = useMemo(
    () => typeof value === "number" && !presets.includes(value),
    [value, presets]
  );

  const [custom, setCustom] = useState<number>(isCustom && value !== undefined ? value : defaultCustom);

  const [shouldFocusCustom, setShouldFocusCustom] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocusCustom && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      setShouldFocusCustom(false);
    }
  }, [shouldFocusCustom]);


  const applyPreset = (p: number) => {
    onChange(p);
  };

    const clamp = (n: number) => {
    const lo = min ?? -Infinity;
    const hi = max ?? Infinity;   
    return Math.min(Math.max(n, lo), hi);
  };

  const handleCustomInput = (val: string) => {
    const n = Number(val.replace(",", "."));
    if (Number.isFinite(n)) {
      const c = clamp(n);
      setCustom(c);
      onChange(c);
    } else {
      setCustom(NaN);
    }
  };

  const handleCustomKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      (e.currentTarget as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      (e.currentTarget as HTMLInputElement).blur();
    }
  };useEffect(() => {
  if (typeof value === "number") {
    setCustom(value)
  }
}, [value])

const percentLabel = useMemo(() => {
  const v = typeof value === "number" ? value : presets[0]
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(v) + "%";
}, [value, presets])

const formattedCustom = useMemo(() => {
  return Number.isFinite(custom)
    ? new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false,
      }).format(custom)
    : "";
}, [custom]);

const Trigger = useMemo(() => (
  <div className={twJoin("flex flex-col items-center cursor-pointer mr-2","border border-white/20 rounded px-2", className)}>
    <span className="text-[14px] font-light text-white">{percentLabel} <Icon name="solid:caret-down" className="text-white" /></span>
    <StyledText as="span" variant="label.meta.faded">{label}</StyledText>
  </div>
), [className, label, percentLabel])
const onOpenChange = (open: boolean) => {
  if (open && isCustom) {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }
};
  return (
    <Dropdown
      trigger={
        Trigger
      }
      onOpenChange={onOpenChange}
    >
      {/* Presets */}
      {presets.map((p) => {
        const active = value === p;
        return (
          <button
            key={p}
            onClick={() => applyPreset(p)}
            className={twJoin(
              "px-4 py-2 text-center text-sm w-full",
              active ? "bg-palette-green font-bold text-palette-text" : "text-white hover:bg-palette-green/20"
            )}
            aria-pressed={active}
          >
            {p}%
          </button>
        );
      })}

      {/* Custom */}
       <div className="pt-2" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className={twJoin(
              "rounded border border-border bg-transparent px-3 py-1.5 text-sm text-white text-center",
              "focus:outline-none focus:ring-2 focus:ring-primary/30",
              "pr-6",
              "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              "[-moz-appearance:textfield] [appearance:textfield]"
            )}
            min={min}
            max={max ? max : undefined}
            step={step}
            value={formattedCustom}
            placeholder={String(defaultCustom)}
            onChange={(e) => handleCustomInput(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="pointer-events-none absolute right-4 inset-y-0 flex items-center text-xs text-muted-foreground">
            %
          </span>
        </div>
      </div>

    </Dropdown>
  );
}
