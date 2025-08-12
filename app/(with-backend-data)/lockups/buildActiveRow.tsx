import { Tranche } from "@/app/ts_types/HydroBase.types"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { formatAmount } from "@/lib/formatAmount"
import { pluralize } from "@/lib/pluralize"
import { LockupStatus } from "./LockupStatus"
import { DECIMAL_PRECISION_FOR_LOCKING_AMOUNTS } from "@/config"
import { LockupActionTrigger } from "./actions/components/LockupActionTrigger"
import { isListedMarketplaceLockup } from "./marketplace/utils/isListedMarketplaceLockup"
import {
  CircleSlash2,
  MoreHorizontal,
  RotateCw,
  SquaresUnite,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Icon } from "@/components/Icon"
import Link from "next/link"
import { TOKEN_DENOMS } from "@/lib/tokenDenoms"

export function buildActiveRow({
  lockup,
  mergeableLockups,
  selectedActiveLockups,
  initMerge,
  tranches,
  onClickEdit,
  onClickSplit,
  setSelectedActiveLockups,
  findMergeableLockup,
}: {
  lockup: AugmentedLockup
  selectedActiveLockups: number[]
  mergeableLockups: number[]
  initMerge: boolean
  tranches: Tranche[]
  onClickEdit: ({ lockup }: { lockup: AugmentedLockup }) => void
  onClickSplit: ({ lockup }: { lockup: AugmentedLockup }) => void
  setSelectedActiveLockups: (lockups: number[]) => void
  findMergeableLockup: (lockups: number[]) => AugmentedLockup
}) {
  const { daysLeft } = lockup

  const statusCells = Object.fromEntries(
    tranches.map(({ id }) => {
      return [
        `trancheStatus${id}` as const,
        <LockupStatus
          key={`trancheStatus${id}`}
          lockupId={lockup.id}
          trancheId={id}
        />,
      ]
    })
  )

  const MENU_ITEMS = [
    {
      label: "Refresh",
      icon: <RotateCw className="text-palette-white  size-3" />,
      cta: (lockup: AugmentedLockup) => onClickEdit({ lockup }),
    },
    {
      label: "Split",
      icon: <CircleSlash2 className="text-palette-white  size-3" />,
      cta: (lockup: AugmentedLockup) => onClickSplit({ lockup }),
    },
  ]

  const nftImage = getNftLockupImage(lockup.funds.amount, lockup.funds.denom)

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      if (!selectedActiveLockups.includes(lockup.id)) {
        setSelectedActiveLockups([...selectedActiveLockups, lockup.id])
      }
    } else {
      setSelectedActiveLockups(
        selectedActiveLockups.filter((id) => id !== lockup.id)
      )
    }
  }

  const mergePair =
    mergeableLockups.length > 0 &&
    findMergeableLockup(mergeableLockups).funds.denom === lockup.funds.denom

  const nftSize = !(
    lockup.funds.denomInfo?.humanReadableDenom !==
      TOKEN_DENOMS.ATOM.displayDenom && NFT_SIZES.includes(lockup.funds.amount)
  )

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
            checked={selectedActiveLockups?.includes(lockup.id)}
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
          <div className="flex items-center gap-1">
            <LockupActionTrigger
              lockup={lockup}
              action="transfer"
              className="cursor-pointer hover:font-medium"
              showActionPanel={false}
            >
              {amount}
            </LockupActionTrigger>
            {!isListedMarketplaceLockup(lockup) && (
              <StyledText
                variant="link"
                href={`/lockups/marketplace/${lockup.id}`}
                as={Link}
                className="mx-1.5"
                tooltip="This NFT is listed for sale on the marketplace. Click to view the listing"
              >
                <Icon
                  name="solid:tag"
                  className={`hover:text-palette-green/80 mr-3 cursor-pointer text-base `}
                />
              </StyledText>
            )}
          </div>
        )}
      </>
    ),

    timeLeft: pluralize({
      count: daysLeft,
      prefixCount: true,
      singular: "day",
    }),

    ...statusCells,

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
