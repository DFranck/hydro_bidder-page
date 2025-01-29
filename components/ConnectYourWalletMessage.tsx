import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"

export function ConnectYourWalletMessage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ContentContainer className="flex min-h-[50vh] items-center justify-center">
      <div>
        {children} <Icon name="arrow-up-right" />
      </div>
    </ContentContainer>
  )
}
