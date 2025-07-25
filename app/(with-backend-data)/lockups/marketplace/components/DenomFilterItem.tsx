"use client"

import { StyledText } from "@/components/StyledText"
import { CheckboxWithCustomCheck } from "./CheckboxWithCustomCheck"

interface DenomFilterItemProps {
  denom: string
  count?: number
  checked: boolean
  onToggle: () => void
}

export function DenomFilterItem({
  denom,
  count = 0,
  checked,
  onToggle,
}: DenomFilterItemProps) {
  const id = `denom-${denom.toLowerCase()}`
  return (
    <div className="flex items-center justify-between">
      <StyledText as="label" htmlFor={id} variant="label">
        {denom}
      </StyledText>
      <div className="flex gap-2">
        {checked && (
          <StyledText
            as="output"
            aria-label={`${count} lockups with ${denom}`}
            className="flex h-4 w-4 items-center justify-center rounded-full  bg-white text-[10px] font-black text-black"
          >
            {count}
          </StyledText>
        )}
        <CheckboxWithCustomCheck
          id={id}
          checked={checked}
          onChange={onToggle}
        />
      </div>
    </div>
  )
}
