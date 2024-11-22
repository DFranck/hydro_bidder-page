"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { Toasts } from "@/components/Toasts"
import Link from "next/link"
import { CellContentDescriptor, upcomingAirdrops } from "./upcomingAirdrops"

function CellContentRenderer({
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
      return <StyledText>{descriptor.label}</StyledText>
  }
}

export default function AirdropsPage() {
  const rows = upcomingAirdrops.map((airdropDescriptor) => {
    const {
      projectName,
      projectDetails,
      isConfirmed,
      steps,
      check,
      registration,
      claim,
    } = airdropDescriptor

    return {
      _airdropDescriptor: airdropDescriptor,
      projectName,
      projectDetails,
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
      eligibilityCheck: <CellContentRenderer descriptor={check} />,
      registration: <CellContentRenderer descriptor={registration} />,
      claimMethod: <CellContentRenderer descriptor={claim} />,
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
      key: "eligibilityCheck",
      label: "Eligibility Check",
      propsForCells: {
        className: "relative",
      },
    },
    {
      key: "registration",
      label: "Registration",
      propsForCells: {
        className: "relative",
      },
    },
    {
      key: "claimMethod",
      label: "Claim Method",
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
        <StyledText variant="h2">Upcoming Airdrops for Hydro Users</StyledText>
        <div className="prose prose-invert">
          Hydro participants are some of the most active & engaged users. They
          also have the ability to vote on the deployments of liquidity through
          the ecosystem. Many projects see value in airdropping a portion of
          their token supply specifically to Hydro lockers. The projects below
          have publicly shared their intention to do so. The list is updated by
          the Hydro product team on a regular basis.
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
