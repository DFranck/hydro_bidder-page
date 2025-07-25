"use client"
import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { StyledText } from "@/components/StyledText"
import { Ubuntu_Mono } from "next/font/google"
import { twMerge } from "tailwind-merge"
const UbuntuMonoFont = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
})
type LockupActionCardValueProps = {
  className?: string
  icon?: IconString
  fullContent?: React.ReactNode
  leftContent?: React.ReactNode
  leftClassName?: string
  rightContent?: React.ReactNode
}

const LockupActionCardValue = ({
  className = "",
  icon,
  fullContent = "",
  leftContent = "",
  leftClassName = "",
  rightContent = "",
}: LockupActionCardValueProps) => {
  if (fullContent) {
    return fullContent
  } else {
    return (
      <div
        className={twMerge(
          `flex w-full justify-between gap-6 bg-gradient-to-r from-palette-beige/0 to-palette-beige/20 p-3 pl-6 `,
          className,
        )}
      >
        <div className={`flex`}>
          {icon && (
            <Icon
              name={icon}
              className={`mr-3 flex h-full min-w-4 items-center opacity-60 ${leftClassName}`}
            />
          )}
          <StyledText
            as={"label"}
            variant="label.meta.faded"
            className={`flex whitespace-nowrap ${leftClassName}`}
          >
            {leftContent}
          </StyledText>
        </div>
        <div
          className={`${UbuntuMonoFont.className} flex items-center whitespace-nowrap text-right`}
        >
          {rightContent}
        </div>
      </div>
    )
  }
}

export default LockupActionCardValue
