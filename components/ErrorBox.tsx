import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { IconString } from "@/components/Icon/types"
import { StyledText } from "@/components/StyledText"

export function ErrorBox({
  children,
  iconName = "duotone:face-thinking",
}: {
  children: React.ReactNode
  iconName?: IconString
}) {
  return (
    <ContentContainer className="relative h-full py-6">
      <BlurryBackdropBox
        className="
          absolute
          inset-6
          flex
          flex-col
          items-center
          justify-center
          gap-6
          bg-palette-red/20
          p-12
          text-center
        "
      >
        <StyledText
          as="div"
          variant="icon.huge"
          className="text-palette-red/80"
        >
          <Icon name={iconName} />
        </StyledText>

        <div>{children}</div>
      </BlurryBackdropBox>
    </ContentContainer>
  )
}
