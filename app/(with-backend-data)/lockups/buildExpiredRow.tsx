import { StyledText } from "@/components/StyledText"
import { Checkbox } from "@/components/ui/checkbox"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { getTimeBetweenDates } from "@/lib/getTimeBetweenDates"
import { LockupActionTrigger } from "./actions/components/LockupActionTrigger"
import { isListedMarketplaceLockup } from "./marketplace/utils/isListedMarketplaceLockup"
import {
  CircleSlash2,
  MoreHorizontal,
  RotateCw,
  SquaresUnite,
} from "lucide-react"
import { Tooltip } from "@/components/Tooltip"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import {
  mergeableDenomTooltip,
  mergeIndicatorTooltip,
} from "@/components/ToolTips"
import { getNftLockupImage } from "./config"
import { Avatar } from "@/components/Avatar"
import { Dropdown } from "./actions/components/Dropdown"
import { NFT_SIZES } from "./config/nft-sizes"

export function buildExpiredRow({
  lockup,
  mergeableLockups,
  selectedExpiredLockups,
  initMerge,
  onClickEdit,
  onClickSplit,
  setSelectedExpiredLockups,
  findMergeableLockup,
}: {
  lockup: AugmentedLockup
  mergeableLockups: number[]
  selectedExpiredLockups: number[]
  initMerge: boolean
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
  setSelectedExpiredLockups: (lockups: number[]) => void
  findMergeableLockup: (lockups: number[]) => AugmentedLockup
}) {
  const { daysLeft, dateStart, dateEnd } = lockup

  const originalDuration = getTimeBetweenDates(dateStart, dateEnd)

  const MENU_ITEMS = [
    {
      label: "Refresh",
      icon: <RotateCw className="text-palette-white  size-3" />,
      cta: (lockup: AugmentedLockup) => onClickEdit({ lockup }),
    },
    {
      label: "Split",
      icon: <CircleSlash2 className="text-palette-white size-3" />,
      cta: (lockup: AugmentedLockup) => onClickSplit({ lockup }),
    },
  ]

  const nftImage = getNftLockupImage(lockup.funds.amount, lockup.funds.denom)

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      if (!selectedExpiredLockups.includes(lockup.id)) {
        setSelectedExpiredLockups([...selectedExpiredLockups, lockup.id])
      }
    } else {
      setSelectedExpiredLockups(
        selectedExpiredLockups.filter((id) => id !== lockup.id)
      )
    }
  }

  const mergePair =
    mergeableLockups.length > 0 &&
    findMergeableLockup(mergeableLockups).funds.denom === lockup.funds.denom

  const nftSize = !NFT_SIZES.includes(lockup.funds.amount)

  const amount = (
    <div className="flex items-center gap-1">
      <StyledText>
        {formatAmount(
          lockup.funds.amount * 1e6,
          undefined,
          DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS
        )}
      </StyledText>
      <StyledText variant="footnote">
        {lockup.funds.denomInfo?.humanReadableDenom}
      </StyledText>
      {nftImage ? (
        <Avatar
          url={nftImage.image}
          alt={`${nftImage.displayDenom} NFT`}
          className="size-4 rounded-sm"
        />
      ) : null}
    </div>
  )

  const cells = {
    _lockup: { ...lockup, daysLeft },

    select: (
      <div className="flex w-10 items-center gap-2">
        <ConditionalWrapper
          condition={initMerge && mergeableLockups.length !== 0 && !mergePair}
          wrapper={(children) => (
            <Tooltip
              classNamesForTooltip="translate-x-1 md:w-96"
              tipContents={mergeableDenomTooltip({
                lockup: {
                  denom: lockup.funds.denomInfo?.humanReadableDenom,
                  validator: lockup.funds.denomInfo?.raw,
                },
                selectedLockup: {
                  denom:
                    findMergeableLockup(mergeableLockups).funds.denomInfo
                      ?.humanReadableDenom,
                  validator:
                    findMergeableLockup(mergeableLockups).funds.denomInfo?.raw,
                },
              })}
            >
              <div className="pointer-events-none cursor-not-allowed opacity-50">
                {children}
              </div>
            </Tooltip>
          )}
        >
          <Checkbox
            checked={selectedExpiredLockups?.includes(lockup.id)}
            onCheckedChange={handleCheckboxChange}
            disabled={initMerge && mergeableLockups.length !== 0 && !mergePair}
          />
        </ConditionalWrapper>

        {mergePair && initMerge ? (
          <Tooltip
            tipContents={mergeIndicatorTooltip}
            classNamesForTooltip="translate-x-1 md:w-96"
          >
            <SquaresUnite className="size-3.5 animate-pulse" />
          </Tooltip>
        ) : null}
      </div>
    ),

    amount: (
      <>
        {nftSize ? (
          amount
        ) : (
          <LockupActionTrigger lockup={lockup} action="transfer">
            {amount}
          </LockupActionTrigger>
        )}
      </>
    ),

    originalDuration,

    expiredDaysAgo: `${Math.abs(daysLeft)} days ago`,

    actions: (
      <Dropdown
        trigger={<MoreHorizontal className="text-white" />}
        className="px-2 text-gray-500 hover:text-gray-800"
      >
        {isListedMarketplaceLockup(lockup) && (
          <LockupActionTrigger lockup={lockup} action="unlist" />
        )}
        <LockupActionTrigger lockup={lockup} action="list" />
        <LockupActionTrigger lockup={lockup} action="transfer" />
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            className="text-palette-white hover:bg-palette-green/70 hover:text-palette-text relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors [&_svg]:pointer-events-none [&_svg]:size-4"
            onClick={() => item.cta(lockup)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </Dropdown>
    ),
  }

  return cells
}
