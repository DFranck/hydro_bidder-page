"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { ModalWindow } from "@/components/ModalWindow"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Toasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"
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

        <Toasts.Toast
          icon="solid:parachute-box"
          isDismissible={false}
          variant="info"
          className="items-center justify-center text-center"
        >
          Are you a project planning an airdrop? We&apos;re here to help.{" "}
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
      </ContentContainer>

      <ModalWindow
        isOpen={isAirdropDetailsModalOpen}
        onClose={() => setIsAirdropDetailsModalOpen(false)}
      >
        <Card>
          <Card.Header>About Airdrops for Hydro Users</Card.Header>
          <Card.Body>
            <div>
              Hydro participants are some of the ecosystem&apos;s most active
              and engaged users, and they have the ability to vote on liquidity
              deployments throughout it. As a result, many projects see value in
              airdropping a portion of their token supply specifically to Hydro
              lockers.
            </div>
            <div>
              These are projects that have publicly shared their intention to
              airdrop to Hydro users, and is updated regularly by the Hydro
              team.
            </div>
          </Card.Body>
          <Card.Footer className="justify-between">
            <StyledText
              variant="button.primary"
              as="button"
              onClick={() => setIsAirdropDetailsModalOpen(false)}
            >
              Close
            </StyledText>

            <label className="flex items-center gap-2">
              <StyledText
                as="input"
                type="checkbox"
                variant="input.checkbox"
                checked={dontShowAirdropModal}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setDontShowAirdropModal(event.target.checked)
                }
              />
              <StyledText variant="label">
                Don&rsquo;t show this again
              </StyledText>
            </label>
          </Card.Footer>
        </Card>
      </ModalWindow>
    </>
  )
}
