"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { CollapsibleBox } from "@/components/CollapsibleBox"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { TableHeader } from "@/components/TableHeader"
import { pluralize } from "@/lib/pluralize"
import { ReactNode, useState } from "react"
import { twJoin } from "tailwind-merge"
import { useCopyToClipboard } from "usehooks-ts"
import { EmptyBox } from "./EmptyBox"

export function CollapsibleTable({
  children,
  id,
  title,
  numRows,
  showBidsWithoutTributes,
  setShowBidsWithoutTributes,
}: {
  children: ReactNode
  id: string
  title: ReactNode
  numRows: number
  showBidsWithoutTributes: boolean
  setShowBidsWithoutTributes(shouldShow: boolean): void
}) {
  const [isCollapsed, setIsCollapsed] = useState(numRows === 0)

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

  const toggleBids = () => {
    setShowBidsWithoutTributes(!showBidsWithoutTributes)
  }

  return (
    <BlurryBackdropBox id={id} key={id} className="group flex flex-col gap-3">
      <TableHeader
        leftSlot={<StyledText variant="h4">{title}</StyledText>}
        rightSlot={
          <div className="flex flex-row-reverse items-center gap-4 text-xs">
            <div className="flex flex-col items-center gap-2"> {/* stack buttons vertically and center */}
              <StyledText
                as="button"
                variant="button.secondary.small"
                className="self-end"
                onClick={() => setIsCollapsed(!isCollapsed)}
                disabled={numRows === 0}
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

            <div
              className="flex cursor-pointer flex-row items-center gap-2"
              onClick={toggleBids}
            >
              <StyledText
                as="input"
                variant="input.checkbox"
                type="checkbox"
                className="cursor-pointer"
                checked={showBidsWithoutTributes}
                onChange={toggleBids}
              />
              <StyledText>
                Show bids <br /> without rewards
              </StyledText>
            </div>
          </div>
        }
      />

      <CollapsibleBox
        isCollapsed={!isCollapsed}
        className="data-collapsed:opacity-0"
      >
        {numRows === 0 ? (
          <EmptyBox>
            <StyledText>
              There are no bids in here yet — check back soon!
            </StyledText>
          </EmptyBox>
        ) : (
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
              singular: "Bid",
              prefixCount: true,
            })}
          </StyledText>
        )}
      </CollapsibleBox>

      <CollapsibleBox
        isCollapsed={isCollapsed}
        className="js-collapsible-table-content data-collapsed:opacity-0"
      >
        {children}
      </CollapsibleBox>
    </BlurryBackdropBox>
  )
}
