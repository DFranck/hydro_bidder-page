"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Toasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import Link from "next/link"
import { twJoin } from "tailwind-merge"
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
          <div
            className={twJoin(
              `
                rounded-full
                px-2
                py-0.5
                text-xs
                font-bold
                text-palette-text
              `,
              confirmationStatus === "Confirmed"
                ? "bg-palette-green"
                : "bg-palette-beige"
            )}
          >
            {confirmationStatus}
          </div>
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
      initialSortDirection: "ASC",
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
      textAlign: "center",
      propsForCells: {
        className: "relative text-balance",
      },
    },
    {
      key: "nextSteps",
      label: "Next Steps",
      textAlign: "center",
      propsForCells: {
        className: "relative text-balance",
      },
    },
    {
      key: "action",
      label: "Action",
      textAlign: "center",
      isSortable: true,
      propsForCells: {
        className: "relative text-balance",
      },
      customValueGetter: (row) => row._airdropDescriptor[6],
    },
  ]

  return (
    <>
      <StatCards>
        <StatCards.NumberOfUniqueWallets />
        <StatCards.AverageAtomLockedPerWallet />
        <StatCards.AverageRoundsPerUser />
      </StatCards>

      <ContentContainer className="gap-12 py-12">
        <BlurryBackdropBox className="flex items-center justify-center text-balance py-6 text-center">
          <h2 className="sr-only">Airdrops for Hydro Users</h2>
          <p className="prose prose-invert mx-auto gap-6">
            Hydro participants are some of the most active and engaged users.
            They also have the ability to vote on the deployments of liquidity
            through the ecosystem. Many projects see value in airdropping a
            portion of their token supply specifically to Hydro lockers. The
            projects below have publicly shared their intention to do so. The
            list is updated by the Hydro product team on a regular basis.
          </p>
        </BlurryBackdropBox>

        <Toasts.Toast
          className="mx-auto my-0 w-fit"
          icon="solid:parachute-box"
          isDismissible={false}
          variant="info"
        >
          Are you a project planning an airdrop? We&rsquo;re here to help.{" "}
          <StyledText
            className="inline-flex items-center gap-1"
            as={Link}
            variant="link"
            href="https://calendly.com/actional/hydro"
            target="_blank"
          >
            <span>Get in touch with us here</span>
            <Icon name="arrow-up-right-from-square" />
          </StyledText>
          .
        </Toasts.Toast>

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
