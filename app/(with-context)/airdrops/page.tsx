"use client"

import { AirdropDetailsModal } from "@/app/(with-context)/airdrops/AirdropDetailsModal"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Tooltip } from "@/components/Tooltip"
import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { CellContentRenderer } from "./CellContentRenderer"
import { upcomingAirdrops } from "./upcomingAirdrops"

export interface UpcomingAirdrop {
  projectName: string
  projectDetails: string
  confirmationStatus: string
  eligibilitySummary: string
  nextSteps: string
  actionType: string
  actionLabel: string
  actionURL: string
  actionContentsDisabled: string
}

export type CellContentDescriptor =
  | ButtonCellContentDescriptor
  | TextCellContentDescriptor

type ButtonCellContentDescriptor = {
  type: "button"
  href: string
  disabled?: boolean
  label: string
}

type TextCellContentDescriptor = {
  type: "text"
  label: string
}

const loadedUpcomingAirdrops = upcomingAirdrops
  .trim()
  .split("\n")
  .map((line) => line.split("\t"))

export default function AirdropsPage() {
  const [dontShowAirdropModal, setDontShowAirdropModal] = useLocalStorage(
    "dont-show-airdrops-modal",
    false
  )

  const [isAirdropDetailsModalOpen, setIsAirdropDetailsModalOpen] =
    useState(false)

  useEffect(() => {
    if (dontShowAirdropModal) {
      return
    }

    setIsAirdropDetailsModalOpen(true)
  }, [dontShowAirdropModal])

  const rows = loadedUpcomingAirdrops.map((airdropRowData) => {
    const [
      projectName,
      projectDetails,
      confirmationStatus,
      eligibilitySummary,
      nextSteps,
      actionType,
      actionLabel,
      actionURL,
      actionContentsDisabled,
    ] = airdropRowData

    return {
      _airdropDescriptor: airdropRowData,
      confirmationStatus: (
        <Tooltip
          tipContents={confirmationStatus}
          classNamesForTooltip="text-center w-min"
        >
          {confirmationStatus === "Confirmed" ? (
            <span className="inline-flex items-center gap-2 text-2xl font-bold text-palette-green">
              <Icon name="circle-check" />
              <span className="sr-only">Confirmed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-2xl font-bold text-palette-beige">
              <Icon name="circle-question" />
              <span className="sr-only">Unconfirmed</span>
            </span>
          )}
        </Tooltip>
      ),
      projectNameAndDescription: (
        <div className="flex flex-col gap-1">
          <StyledText as="h3" variant="h4">
            {projectName}
          </StyledText>
          <MarkdownContainer
            content={projectDetails}
            className="prose-sm opacity-70"
          />
        </div>
      ),
      eligibilitySummary: <MarkdownContainer content={eligibilitySummary} />,
      nextSteps: <MarkdownContainer content={nextSteps} />,
      action: (
        <CellContentRenderer
          descriptor={{
            type: actionType === "Button" ? "button" : "text",
            href: actionURL,
            label: actionLabel,
            disabled: actionContentsDisabled === "TRUE",
          }}
        />
      ),
    }
  })

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "confirmationStatus",
      label: "Status",
      isSortable: true,
      initialSortDirection: "DESC",
      textAlign: "center",
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._airdropDescriptor[2],
    },
    {
      key: "projectNameAndDescription",
      label: "Project Name",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._airdropDescriptor[0],
    },
    {
      key: "eligibilitySummary",
      label: "Eligibility Summary",
      isSortable: true,
      propsForCells: {
        className: "relative whitespace-nowrap",
      },
    },
    {
      key: "nextSteps",
      label: "Next Steps",
      propsForCells: {
        className: "relative",
      },
    },
    {
      key: "action",
      label: "Action",
      textAlign: "right",
      propsForCells: {
        className: "relative",
      },
    },
  ]

  return (
    <>
      <AirdropDetailsModal />

      <StatCards>
        <StatCards.NumberOfUniqueWallets />
        <StatCards.AverageATOMLockedPerWallet />
        <StatCards.AverageRoundsPerUser />
      </StatCards>

      <ContentContainer className="gap-6 py-12">
        <StyledText as="h2" variant="h2">
          Upcoming Airdrops for Hydro Users
        </StyledText>

        <BlurryBackdropBox>
          <StyledTable
            columns={columns}
            rows={rows}
            initialSortedColumnKey="confirmationStatus"
          />
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
