import { StyledText } from "@/components/StyledText"
import { AllowedLockupPeriodInEpochs } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"
import { isNumber } from "lodash"
import { MouseEvent, useState } from "react"
import { twMerge } from "tailwind-merge"

export function InputForLockupPeriod({
  selectedDuration,
  onChange,
}: {
  selectedDuration: number
  onChange?: (value: number) => void
}) {
  const { lockupEpochLength } = useBackendData()
  const [innerSelectedDuration, setInnerSelectedDuration] = useState(
    selectedDuration || lockupEpochLength
  )

  const lockupPeriodOptions = Object.values(AllowedLockupPeriodInEpochs)
    .filter(isNumber)
    .map((epochCount) => {
      const { value, unit } = getTimeUnitFromNanos(
        epochCount * lockupEpochLength
      )
      return {
        label: `${pluralize({
          count: value,
          prefixCount: true,
          singular: unit,
        })}`,
        duration: epochCount * lockupEpochLength,
      }
    })

  function handleClick(duration: number, event: MouseEvent) {
    event.preventDefault()
    setInnerSelectedDuration(duration)
    onChange?.(duration)
  }

  return (
    <>
      <div className="flex w-min">
        {lockupPeriodOptions.map(({ label, duration }) => {
          const isSelected = innerSelectedDuration === duration
          return (
            <StyledText
              variant={isSelected ? "button.primary" : "button.secondary"}
              as="button"
              key={duration}
              onClick={handleClick.bind(null, duration)}
              className={twMerge(
                `
                  rounded-none
                  border-r-0
                  backdrop-blur-none
                  first:rounded-l-md
                  last:rounded-r-md
                  last:border-r-2
                  hover:scale-100
                `
              )}
            >
              {label}
            </StyledText>
          )
        })}
      </div>
      <input type="hidden" value={innerSelectedDuration} />
    </>
  )
}
