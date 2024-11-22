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
import Link from "next/link"
import { CellContentRenderer } from "./CellContentRenderer"
import { upcomingAirdrops } from "./upcomingAirdrops"

export default function AirdropsPage() {
  const rows = upcomingAirdrops.map((airdropDescriptor) => {
    const {
      projectName,
      projectDetails,
      isConfirmed,
      steps,
      action,
      nextSteps,
    } = airdropDescriptor

    return {
      _airdropDescriptor: airdropDescriptor,
      projectName: (
        <StyledText as="h3" variant="h4">
          {projectName}
        </StyledText>
      ),
      projectDetails: <MarkdownContainer content={projectDetails} />,
      confirmationStatus: isConfirmed ? (
        <span className="flex items-center gap-2 text-lg font-bold text-palette-green">
          <Icon name="circle-check" />
          Confirmed
        </span>
      ) : (
        <span className="flex items-center gap-2 text-lg font-bold text-palette-beige">
          <Icon name="circle-question" />
          Unconfirmed
        </span>
      ),
      eligibilitySummary:
        steps.length >= 2 ? (
          <ul>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        ) : (
          <StyledText>{steps[0]}</StyledText>
        ),
      nextSteps: <CellContentRenderer descriptor={nextSteps} />,
      action: <CellContentRenderer descriptor={action} />,
    }
  })

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "projectName",
      label: "Project Name",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._airdropDescriptor.projectName,
    },
    {
      key: "projectDetails",
      label: "Description",
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._airdropDescriptor.projectDetails,
    },
    {
      key: "confirmationStatus",
      label: "Status",
      isSortable: true,
      initialSortDirection: "DESC",
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => String(row._airdropDescriptor.isConfirmed),
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
        <div className="flex justify-between gap-6">
          <StyledText as="h2" variant="h2">
            Upcoming Airdrops for Hydro Users
          </StyledText>

          <div className="prose prose-invert">
            Hydro participants are some of the most active & engaged users. They
            also have the ability to vote on the deployments of liquidity
            through the ecosystem. Many projects see value in airdropping a
            portion of their token supply specifically to Hydro lockers. The
            projects below have publicly shared their intention to do so. The
            list is updated by the Hydro product team on a regular basis.
          </div>
        </div>

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
    </>
  )
}
