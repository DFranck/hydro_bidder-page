import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StyledText } from "@/components/StyledText"
import Link from "next/link"
import { CellContentDescriptor } from "./upcomingAirdrops"

export function CellContentRenderer({
  descriptor,
}: {
  descriptor: CellContentDescriptor
}) {
  switch (descriptor.type) {
    case "button":
      return (
        <StyledText
          as={Link}
          variant="button.primary.small"
          href={descriptor.href}
          target="_blank"
          className={
            descriptor.disabled ? "pointer-events-none opacity-50" : ""
          }
        >
          {descriptor.label}
          <Icon name="arrow-up-right-from-square" />
        </StyledText>
      )
    case "text":
      return <MarkdownContainer content={descriptor.label} />
  }
}
