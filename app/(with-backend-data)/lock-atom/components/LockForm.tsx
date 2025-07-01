import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { InputForLockupPeriod } from "@/components/InputForLockupPeriod"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { Toast, useToasts } from "@/components/Toasts"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { Validator } from "@/contract-apis/fetchWalletValidators"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useWalletValidators } from "@/contract-apis/useWalletValidators"
import { formatAmount } from "@/lib/formatAmount"
import { scaleLockupPower } from "@/lib/scaleLockupPower"
import { ChainContext } from "@cosmos-kit/core"
import floor from "lodash/floor"
import isNumber from "lodash/isNumber"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"
import { classNames } from "../classNames"
import { ValidatorListItem } from "../components/ValidatorListItem"
import { calculateLsmCapacity } from "../functions/calculateLsmCapacity"
import { getValidatorMoniker } from "../functions/getValidatorMoniker"
import { useGlobalLockupCapacityInfo } from "@/contract-apis/useGlobalLockupCapacityInfo"

export function LockForm({
  onSubmit,
  hubChain,
  validatorMap,
  validatorLiquidStakingCap,
}: {
  onSubmit: (validator: string, amount: string, duration: number) => void
  hubChain: ChainContext
  validatorMap: Map<string, Validator>
  validatorLiquidStakingCap: string
}) {
  const { lockedAtomEpochInNanos, lockedAtomMaxWallet, lockedAtomTotalWallet } =
    useBackendData()
  const {
    data: { lockedAtomTotalGlobal, lockedAtomRemainingCapacityGlobal },
  } = useGlobalLockupCapacityInfo()
  const { setToasts } = useToasts()
  const [validator, setValidator] = useState("")
  const [selectedDuration, setSelectedDuration] = useState(
    lockedAtomEpochInNanos
  )
  const { data: validators } = useWalletValidators(
    hubChain,
    hubChain.address || ""
  )
  const delegationBalance = Number(
    validators?.find((v) => v.validator.operator_address === validator)
      ?.delegation_balance.amount ?? 0
  )
  const usersLimitRemainder = Math.max(
    0,
    lockedAtomMaxWallet - lockedAtomTotalWallet
  )
  const minAtomToBeLocked = floor(
    1 / 1e6,
    DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
  )
  const maxAtomToBeLocked = floor(
    Math.min(
      delegationBalance ? delegationBalance / 1e6 : Infinity, // no more than they have
      usersLimitRemainder, // no more than their limit
      lockedAtomRemainingCapacityGlobal // no more than the global limit
    ),
    DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
  )

  const [amount, setAmount] = useState<string>("")

  useEffect(() => {
    if (maxAtomToBeLocked > 0 && lockedAtomRemainingCapacityGlobal > 0) {
      setAmount(String(maxAtomToBeLocked))
    } else if (
      lockedAtomTotalGlobal &&
      (maxAtomToBeLocked === 0 || lockedAtomRemainingCapacityGlobal === 0)
    ) {
      setAmount(String(0))
      setToasts([toastMessages.lockupCapacityFull])
    }
  }, [maxAtomToBeLocked, lockedAtomRemainingCapacityGlobal])

  useEffect(() => {
    const numericAmount = parseFloat(amount)

    if (isNumber(numericAmount) && validator && validators) {
      const selectedValidator = validators.find(
        (v) => v.validator.operator_address === validator
      )
      if (selectedValidator) {
        const lsmCapacity = calculateLsmCapacity(
          selectedValidator.validator.delegator_shares,
          validatorLiquidStakingCap
        )
        if (lsmCapacity < parseFloat(amount) && parseFloat(amount) > 0) {
          console.warn("Selected amount exceeds LSM capacity")
        }
      }
    }
  }, [amount, validator, validators])

  function clearSelectedValidator() {
    setValidator("")
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    // Allow empty string, numbers, and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  // Clamp the user's manually-typed value between min and max
  function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    const typedValue = floor(
      parseFloat(e.target.value) || 0,
      DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
    )

    if (typedValue !== 0 && typedValue < minAtomToBeLocked) {
      setAmount(String(minAtomToBeLocked))
    } else {
      setAmount(String(Math.min(typedValue, maxAtomToBeLocked)))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const uatomAmount = parseFloat(amount) * 1e6
    const maxUatomToBeLocked = maxAtomToBeLocked * 1e6
    const actualUatomToLock = Math.min(uatomAmount, maxUatomToBeLocked)

    onSubmit(
      validator,
      BigInt(Math.round(actualUatomToLock)).toString(),
      selectedDuration
    )
  }

  return (
    <Card>
      {validators?.length === 0 ? (
        <Card.Body className={classNames.cardContent}>
          <p>
            You need some staked ATOM to participate in Hydro. You can go to
            Keplr staking interface and stake some ATOM to any active validator
          </p>
          <p>
            Stake now:{" "}
            <StyledText
              variant="link"
              as="a"
              href="https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake"
              target="_blank"
            >
              https://www.mintscan.io/wallet/stake?chain=cosmos&type=stake{" "}
              <Icon name="solid:arrow-up-right" />
            </StyledText>
          </p>
        </Card.Body>
      ) : (
        <>
          <Card.Header title="Get Voting Power" />
          <Card.Body className={classNames.cardContent}>
            <Toast variant="info">
              Once locked, your staked ATOMs are inaccessible for the duration
              of the lock. They will continue to accrue staking rewards but you
              will not be able to vote in Cosmos Hub governance.
            </Toast>

            <form onSubmit={handleSubmit}>
              {!validator && validators && (
                <div className={classNames.formContainer}>
                  <div className="space-y-3">
                    <StyledText variant="label">
                      How to get voting power:
                    </StyledText>

                    <ol className="list-inside list-decimal">
                      <li>
                        Your ATOM staked to a validator can be locked in Hydro
                      </li>
                      <li>You get voting power</li>
                      <li>You continue to earn staking rewards</li>
                    </ol>

                    {validators.length > 1 && (
                      <p>
                        Since you have multiple validators, you will need to
                        select one with staked ATOM to use for your voting
                        power.
                      </p>
                    )}
                  </div>

                  <div className={classNames.cardContent}>
                    <p>
                      <StyledText as="label" variant="label">
                        Select a Validator:
                      </StyledText>
                    </p>

                    {validators.map((v) => (
                      <ValidatorListItem
                        key={v.validator.operator_address}
                        validator={v}
                        selectedValue={validator}
                        onChange={setValidator}
                        selectedAmount={parseFloat(amount)}
                        validatorLiquidStakingCap={validatorLiquidStakingCap}
                      />
                    ))}
                  </div>
                </div>
              )}

              {validator && (
                <div className="grid grid-cols-[min-content_auto] items-center gap-6">
                  <div className="col-span-2 grid grid-cols-subgrid items-center">
                    <StyledText as="label" variant="label">
                      Your Validator:
                    </StyledText>
                    <div className="flex items-center gap-2">
                      <span>
                        {getValidatorMoniker(validator, validatorMap)}
                      </span>
                      <StyledText
                        as="button"
                        variant="link"
                        onClick={clearSelectedValidator}
                      >
                        Change
                      </StyledText>
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid items-center">
                    <StyledText as="label" variant="label">
                      Amount:
                    </StyledText>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <StyledText
                          as="input"
                          className="peer"
                          type="text"
                          pattern="^\d+(\.\d{1,6})?$"
                          variant="input.text"
                          value={amount}
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
                            Max: <strong>{maxAtomToBeLocked}</strong> ATOM
                          </StyledText>
                        </div>

                        {parseFloat(amount) < maxAtomToBeLocked && (
                          <StyledText
                            as="button"
                            type="button"
                            variant="link"
                            className="text-xs"
                            onClick={() => setAmount(String(maxAtomToBeLocked))}
                          >
                            Set to Max
                          </StyledText>
                        )}
                      </div>

                      <StyledText as="p" variant="footnote" className="text-xs">
                        Available capacity: {maxAtomToBeLocked} ATOM
                      </StyledText>
                    </div>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid items-center">
                    <StyledText as="label" variant="label">
                      Lockup:
                    </StyledText>

                    <InputForLockupPeriod
                      selectedDuration={selectedDuration}
                      onChange={setSelectedDuration}
                    />
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid items-center">
                    <StyledText as="label" variant="label">
                      Voting Power:
                    </StyledText>
                    <strong>
                      {(() => {
                        const amountInUatom = BigInt(
                          Math.round(parseFloat(amount) * 1e6 || 0)
                        )
                        const lockupPower = scaleLockupPower({
                          lockedAtomEpochInNanos: lockedAtomEpochInNanos,
                          lockupTime: selectedDuration,
                          rawPower: amountInUatom,
                        })
                        return formatAmount(lockupPower, 6)
                      })()}
                    </strong>
                  </div>

                  <div className="col-span-2 flex flex-row-reverse items-center gap-6">
                    <StyledText
                      as="button"
                      disabled={
                        !validator ||
                        !amount ||
                        !selectedDuration ||
                        parseFloat(amount) > maxAtomToBeLocked ||
                        parseFloat(amount) === 0
                      }
                      variant="button.primary"
                      type="submit"
                    >
                      Lock ATOM
                    </StyledText>

                    <StyledText as={Link} href="/lockups" variant="link">
                      Cancel
                    </StyledText>
                  </div>
                </div>
              )}
            </form>
          </Card.Body>
        </>
      )}
    </Card>
  )
}
