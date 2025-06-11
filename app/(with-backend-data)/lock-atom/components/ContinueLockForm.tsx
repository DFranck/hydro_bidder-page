import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { StyledText } from "@/components/StyledText"
import { ChangeEvent, useState } from "react"
import { formatAmount } from "@/lib/formatAmount"

export function ContinueLockForm({
  validator,
  selectedDuration,
  amount,
  onChange,
  maxAmount,
  handleNewAmount,
}: {
  validator: string
  selectedDuration?: number
  amount: string
  maxAmount: string
  onChange?: (duration: number) => void
  handleNewAmount: (amount: string) => void
}) {
  const [lockedAmount, setLockedAmount] = useState<string>(formatAmount(amount))

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    // Allow empty string, numbers, and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLockedAmount(value)

      handleNewAmount(Math.round(Number(value) * 1e6).toString())
    }
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(e.target.value) || 0
    const minAmount = 1 / 1e6
    if (value < minAmount && value !== 0) {
      setLockedAmount(minAmount.toFixed(6))
    } else {
      setLockedAmount(Math.min(value, Number(amount)).toFixed(6))
    }
  }

  return (
    <div>
      {validator && (
        <div className="grid grid-cols-[min-content,auto] items-center gap-6">
          <div className="col-span-2 block grid-cols-subgrid items-center ">
            <StyledText as="label" variant="label">
              Amount:
            </StyledText>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col justify-start gap-3  md:flex-row md:items-center">
                <StyledText
                  as="input"
                  className="peer"
                  type="text"
                  max={maxAmount}
                  pattern="^\d+(\.\d{1,6})?$"
                  variant="input.text"
                  value={lockedAmount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />

                <StyledText
                  as="p"
                  className="
                            hidden
                            text-palette-red
                            peer-invalid:block
                          "
                  variant="footnote"
                >
                  <Icon name="triangle-exclamation" /> Invalid amount
                </StyledText>

                <div className="flex items-center gap-1">
                  <StyledText as="span" variant="footnote">
                    Max: <strong>{formatAmount(maxAmount)}</strong> ATOM
                  </StyledText>
                </div>

                {Number(lockedAmount) === 0 ||
                parseFloat(formatAmount(maxAmount)) < Number(lockedAmount) ? (
                  <StyledText
                    as="button"
                    type="button"
                    variant="link"
                    className="text-xs"
                    onClick={() => {
                      handleNewAmount(maxAmount)
                      setLockedAmount(formatAmount(maxAmount))
                    }}
                  >
                    Set to Max
                  </StyledText>
                ) : null}
              </div>

              {Number(amount) > Number(maxAmount) && (
                <StyledText
                  as="p"
                  className="text-palette-red"
                  variant="footnote"
                >
                  <Icon name="triangle-exclamation" /> Cannot exceed the
                  Available Capacity
                </StyledText>
              )}

              <StyledText as="p" variant="footnote" className="text-xs">
                Available capacity: {formatAmount(maxAmount)} ATOM
              </StyledText>
            </div>
          </div>

          {!!selectedDuration && (
            <div className="col-span-2 block  grid-cols-subgrid items-center md:grid">
              <StyledText as="label" variant="label">
                Select Lock Duration:
              </StyledText>

              <InputForLockupPeriod
                selectedDuration={selectedDuration}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
