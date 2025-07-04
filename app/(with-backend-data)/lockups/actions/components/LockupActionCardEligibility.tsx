"use client"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { AugmentedLockup } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { Ubuntu_Mono } from "next/font/google"
import { getDisplayRoundId } from "../../utils/getDisplayRoundId"
import { getEligibilityIcon } from "../utils/getEligibilityIcon"
import LockupActionCardValue from "./LockupActionCardValue"

const UbuntuMonoFont = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
})

type LockupActionCardEligibilityProps = {
  lockup: AugmentedLockup
}

const LockupActionCardEligibility = ({
  lockup,
}: LockupActionCardEligibilityProps) => {
  const { tranches } = useBackendData()
  return (
    <LockupActionCardValue
      leftClassName="opacity-100 items-center"
      leftContent={
        <div className="flex flex-col">
          <label className="flex items-center opacity-60">
            <Icon name="circle-dashed" className="mr-3 min-w-4 text-base" />
            voting eligibility
          </label>
          <ul className={`${UbuntuMonoFont.className} text-[16px] font-normal`}>
            {tranches &&
              tranches.map((tranche) => {
                const meta = lockup.metaDataByTrancheId[tranche.id]
                const { icon, color } = getEligibilityIcon(meta)
                return (
                  <li key={tranche.id} className={color}>
                    {icon}
                    {tranche.name}
                  </li>
                )
              })}
          </ul>
        </div>
      }
      rightContent={
        <div className="flex flex-col">
          <label className="pointer-events-none opacity-0">Eligibility</label>
          <ul>
            {tranches &&
              tranches.map((tranche) => {
                const meta = lockup.metaDataByTrancheId[tranche.id]
                const canVoteToday = !meta.isTiedToDeployment
                return (
                  <li key={tranche.id}>
                    <StyledText
                      as={"label"}
                      variant="label.meta.faded"
                      className={`h-full whitespace-nowrap font-inter`}
                    >
                      {canVoteToday
                        ? "Can vote today"
                        : "Can vote in round " +
                          getDisplayRoundId(meta.nextRoundEligibleToVote || 0)}
                    </StyledText>
                  </li>
                )
              })}
          </ul>
        </div>
      }
    />
  )
}

export default LockupActionCardEligibility
