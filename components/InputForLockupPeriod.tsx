import { StyledText } from "@/components/StyledText"
import { Toast } from "@/components/Toasts"
import { AllowedLockupPeriodInEpochs } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import { getLockupPeriodMultiplier } from "@/lib/getLockupPeriodMultiplier"
import { getTimeUnitFromNanos } from "@/lib/getTimeUnitFromNanos"
import { pluralize } from "@/lib/pluralize"
import isNumber from "lodash/isNumber"
import { MouseEvent, useState } from "react"
import { twMerge } from "tailwind-merge"

export function InputForLockupPeriod({
  className,
  classNamesForButtons,
  currentLockupEndDate,
  selectedDuration,
  onChange,
}: {
  className?: string
  classNamesForButtons?: string
  currentLockupEndDate?: Date
  selectedDuration: number
  onChange?: (value: number) => void
}) {
  const { lockedAtomEpochInNanos } = useBackendData()
  const [innerSelectedDuration, setInnerSelectedDuration] = useState(
    selectedDuration || lockedAtomEpochInNanos
  )

  const lockupPeriodOptions = Object.values(AllowedLockupPeriodInEpochs)
    .filter(isNumber)
    .map((epochCount) => {
      const { value, unit } = getTimeUnitFromNanos(
        epochCount * lockedAtomEpochInNanos
      )
      return {
        label: `${pluralize({
          count: value,
          prefixCount: true,
          singular: unit,
        })}`,
        duration: epochCount * lockedAtomEpochInNanos,
      }
    })
    // Don't show an option to refresh a lockup to a time before its current end time
    .filter((option) => {
      const newEndDate = new Date((Date.now() * 1e6 + option.duration) / 1e6)
      return !currentLockupEndDate ? true : currentLockupEndDate < newEndDate
    })

  function handleClick(duration: number, event: MouseEvent) {
    event.preventDefault()
    setInnerSelectedDuration(duration)
    onChange?.(duration)
  }

  return (
    <>
      {lockupPeriodOptions.length === 0 ? (
        <Toast variant="error" className="w-full">
          This lockup cannot be refreshed at this time
        </Toast>
      ) : (
        <>
          <div className={twMerge("flex w-min", className)}>
            {lockupPeriodOptions.map(({ label, duration }, index) => {
              const isSelected = innerSelectedDuration === duration

              return (
                <StyledText
                  variant={isSelected ? "button.primary" : "button.secondary"}
                  as="button"
                  key={duration + index}
                  onClick={handleClick.bind(null, duration)}
                  className={twMerge(
                    `scale-100!`,
                    `flex flex-col items-center justify-center gap-0`,
                    `rounded-none border-r-0 backdrop-blur-none`,
                    `first:rounded-l-md last:rounded-r-md last:border-r-2`,
                    classNamesForButtons
                  )}
                >
                  <span>{label}</span>
                  <StyledText className="text-xs opacity-60">
                    {getLockupPeriodMultiplier({
                      lockedAtomEpochInNanos,
                      lockupTime: duration,
                    })}
                    &thinsp;&times;
                  </StyledText>
                </StyledText>
              )
            })}
          </div>
          <input type="hidden" value={innerSelectedDuration} />
        </>
      )}
    </>
  )
}
