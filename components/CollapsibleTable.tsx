"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { pluralize } from "@/lib/pluralize"
import { ReactNode, useState } from "react"
import { twJoin } from "tailwind-merge"
import { useCopyToClipboard } from "usehooks-ts"

export function CollapsibleTable({
  children,
  id,
  title,
  numRows,
}: {
  children: ReactNode
  id: string
  title: ReactNode
  numRows: number
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [hasCopied, setHasCopied] = useState(false)

  const handleCopyLink = () => {
    const tableUrl = new URL(`#${id}`, window.location.href)
    copyToClipboard(tableUrl.toString())
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <BlurryBackdropBox id={id} key={id} className="group flex flex-col gap-3">
      <div
        className={twJoin(
          "flex items-center justify-between",
          "rounded-t-md bg-palette-beige/20",
          "-mx-2 -my-1 px-6 py-3",
          "transition-all",
          "group-has-[.js-collapsible-table-content[data-collapsed]]:rounded-b-md"
        )}
      >
        <StyledText variant="h4">{title}</StyledText>

        <div className="flex flex-row-reverse items-center gap-6 text-xs">
          <StyledText
            as="button"
            variant="button.secondary.small"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Icon name={isCollapsed ? "square-plus" : "square-minus"} />
            <span>{isCollapsed ? "Expand" : "Collapse"}</span>
          </StyledText>

          <StyledText
            as="button"
            variant={hasCopied ? undefined : "link"}
            className="inline-flex items-center gap-1"
            onClick={handleCopyLink}
          >
            <Icon name={hasCopied ? "solid:check" : "solid:link"} />
            <span>{hasCopied ? "Copied!" : "Copy Link"}</span>
          </StyledText>
        </div>
      </div>

      <CollapsibleBox
        isCollapsed={!isCollapsed}
        className="[&[data-collapsed]]:opacity-0"
      >
        <StyledText
          variant="footnote"
          className={twJoin("block text-center", "pb-1 pt-3")}
        >
          <StyledText
            as="button"
            variant="link"
            className="inline-flex items-center gap-0.5"
            onClick={() => setIsCollapsed(false)}
          >
            <Icon name="square-plus" />
            <span>Expand</span>
          </StyledText>{" "}
          {pluralize({
            count: numRows,
            singular: "Row",
            prefixCount: true,
          })}
        </StyledText>
      </CollapsibleBox>

      <CollapsibleBox
        isCollapsed={isCollapsed}
        className="js-collapsible-table-content [&[data-collapsed]]:opacity-0"
      >
        {children}
      </CollapsibleBox>
    </BlurryBackdropBox>
  )
}
