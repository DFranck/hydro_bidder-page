"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { MarkdownContainer } from "@/components/MarkdownContainer"
import { AllTimeAverageAtomLockedPerWallet } from "@/components/StatCards/cards/AllTimeAverageAtomLockedPerWallet"
import { AllTimeAverageRoundsPerWallet } from "@/components/StatCards/cards/AllTimeAverageRoundsPerWallet"
import { CurrentRoundUniqueWallets } from "@/components/StatCards/cards/CurrentRoundUniqueWallets"
import { StatCardsContainer } from "@/components/StatCards/StatCardsContainer"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Toast } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import { HYDRO_TELEGRAM_COMMUNITY_URL } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import { range } from "lodash"
import Link from "next/link"
import { useState } from "react"
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
                : "bg-palette-beige",
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
      nextSteps: (
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
      key: "nextSteps",
      label: "Next Steps",
      textAlign: "center",
      propsForCells: {
        className: "relative text-balance",
      },
    },
  ]

  const confirmedRows = rows.filter(
    (row) => row._airdropDescriptor[2] === "Confirmed",
  )

  const otherRows = rows.filter(
    (row) => row._airdropDescriptor[2] !== "Confirmed",
  )

  const { currentRoundId } = useBackendData()
  const [selectedRound, setSelectedRound] = useState(currentRoundId - 1)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadSnapshot = async () => {
    try {
      setIsDownloading(true)
      // Add 1 to selectedRound because it's zero-based but the API expects 1-based round numbering
      const roundId = selectedRound + 1

      // Create a download link that points to our API endpoint
      const downloadUrl = `/api/round-snapshot?round_id=${roundId}`

      // Create a temporary link to trigger the download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", `hydro-round-${roundId}-snapshot.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to download snapshot:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <StatCardsContainer>
        <AllTimeAverageAtomLockedPerWallet />
        <AllTimeAverageRoundsPerWallet />
      </StatCardsContainer>

      <ContentContainer className="gap-12 py-6">
        <BlurryBackdropBox className="flex flex-col gap-12">
          <div className="grid grid-cols-[auto,1fr] items-center gap-12 px-6 py-6">
            <div className="flex flex-col gap-6">
              <StyledText as="h3" variant="h3">
                Confirmed Airdrops
              </StyledText>
              <p className="prose prose-invert text-balance">
                Hydro participants are some of the most active and engaged
                users. They also have the ability to vote on the deployments of
                liquidity through the ecosystem. Many projects see value in
                airdropping a portion of their token supply specifically to
                Hydro lockers. The projects below have publicly shared their
                intention to do so. The list is updated by the Hydro product
                team on a regular basis.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <Toast
                className="my-0 w-full"
                icon="solid:parachute-box"
                variant="info"
              >
                Are you a project planning an airdrop? We&rsquo;re here to help.{" "}
                <StyledText
                  className="inline-flex items-center gap-1"
                  as={Link}
                  variant="link"
                  href="https://calendly.com/patrick-hydrolabs"
                  target="_blank"
                >
                  <span>Get in Touch</span>
                  <Icon name="arrow-up-right-from-square" />
                </StyledText>
                .
              </Toast>

              <div className="flex flex-col gap-2">
                <StyledText as="span" variant="h4">
                  Airdrop Snapshots
                </StyledText>

                <div className="rounded-md border border-palette-beige border-opacity-20 bg-palette-beige bg-opacity-10 p-4">
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <StyledText
                        as="span"
                        variant="label"
                        className="whitespace-nowrap"
                      >
                        Round #:
                      </StyledText>
                      <div className="min-w-[80px] rounded-md bg-palette-beige px-3 py-1.5">
                        <select
                          className="w-full bg-transparent text-center text-palette-text"
                          value={selectedRound}
                          onChange={(e) =>
                            setSelectedRound(Number(e.target.value))
                          }
                          aria-label="Select airdrop round"
                        >
                          {/* round should go from 1 to current_round-1 */}
                          {range(currentRoundId).map((roundId) => (
                            <option key={roundId} value={roundId}>
                              {roundId + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <StyledText
                      as="button"
                      variant="button.primary"
                      onClick={handleDownloadSnapshot}
                      disabled={isDownloading}
                      className="flex w-full items-center justify-center gap-2 px-4 py-1.5 sm:w-auto"
                    >
                      {isDownloading ? (
                        <>
                          <Icon name="spinner" className="animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Icon name="download" />
                          <span>
                            Download Snapshot for Round {selectedRound + 1}
                          </span>
                        </>
                      )}
                    </StyledText>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <StyledTable
            columns={columns}
            rows={confirmedRows}
            initialSortedColumnKey="projectNameAndDescription"
          />
        </BlurryBackdropBox>

        <BlurryBackdropBox className="flex flex-col gap-12">
          <div className="grid grid-cols-[auto,1fr] items-center gap-12 px-6 py-6">
            <div className="flex flex-col gap-6">
              <StyledText as="h3" variant="h3">
                Rumored Airdrops
              </StyledText>
              <p className="prose prose-invert text-balance">
                The projects listed below have been rumored (some of them
                directly announcing it themselves) to target ATOM stakers in an
                upcoming airdrop. The Hydro product team will be (or already
                are) in contact with them to make the case for including Hydro
                participants.
              </p>
            </div>

            <Toast
              className="my-0 w-full"
              icon="solid:comment-lines"
              variant="info"
            >
              Got a rumor about an airdrop?{" "}
              <StyledText
                className="inline-flex items-center gap-1"
                as={Link}
                variant="link"
                href={HYDRO_TELEGRAM_COMMUNITY_URL}
                target="_blank"
              >
                <span>Drop it in the Telegram</span>
                <Icon name="arrow-up-right-from-square" />
              </StyledText>
              .
            </Toast>
          </div>

          <StyledTable
            columns={columns}
            rows={otherRows}
            initialSortedColumnKey="projectNameAndDescription"
          />
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
