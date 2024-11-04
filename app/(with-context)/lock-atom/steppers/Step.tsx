import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { ReactNode } from "react"

export function Step({
  title,
  contents,
  buttons,
  isWorking,
}: {
  title?: ReactNode
  contents: ReactNode
  buttons?: {
    label: ReactNode
    onClick?: () => void
    className?: string
  }[]
  isWorking?: boolean
}) {
  return (
    <Card
      className={`
                mx-auto
                max-w-screen-sm
            `}
    >
      {title && <Card.Header title={title} />}

      {contents && (
        <Card.Body>
          <ConditionalWrapper
            condition={!!isWorking}
            wrapper={(children) => (
              <div className="flex items-center gap-6">
                <div className="shrink-0 animate-spin text-2xl">
                  <Icon name="solid:loader" />
                </div>
                <div className="flex flex-col gap-3">{children}</div>
              </div>
            )}
          >
            {contents}
          </ConditionalWrapper>
        </Card.Body>
      )}

      {buttons && (
        <Card.Footer>
          {buttons.map((button, index) => (
            <StyledText
              as="button"
              key={index}
              className={button.className}
              variant={index === 0 ? "button.primary" : "button.secondary"}
              onClick={button.onClick}
            >
              {button.label}
            </StyledText>
          ))}
        </Card.Footer>
      )}
    </Card>
  )
}
