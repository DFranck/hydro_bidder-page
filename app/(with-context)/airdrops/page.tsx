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
import { twMerge } from "tailwind-merge"
import { upcomingAirdrops } from "./upcomingAirdrops"

export default function AirdropsPage() {
  const rows = upcomingAirdrops.map((row) => {
    return {
      _row: row,
      name: row.name,
      description: row.description,
      status: row.isConfirmed ? (
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
      actions: (
        <>
          <StyledText
            as={Link}
            variant="button.primary.small"
            href={row.url}
            target="_blank"
            className={twMerge(
              row.isConfirmed
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            )}
          >
            Claim <Icon name="arrow-up-right-from-square" />
          </StyledText>
        </>
      ),
    }
  })

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "name",
      label: "Name",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._row.name,
    },
    {
      key: "description",
      label: "Description",
      propsForCells: {
        className: "w-min",
      },
      customValueGetter: (row) => row._row.description,
    },
    {
      key: "status",
      label: "Status",
      isSortable: true,
      initialSortDirection: "DESC",
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._row.isConfirmed.toString(),
    },
    {
      key: "actions",
      label: "Actions",
      textAlign: "right",
      propsForCells: {
        className: "relative whitespace-nowrap",
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
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="prose prose-invert">
            Hydro participants are some of the most active & engaged users. They
            also have the ability to vote on the deployments of liquidity
            through the ecosystem. Many projects see value in airdropping a
            portion of their token supply specifically to Hydro lockers. The
            projects below have publicly shared their intention to do so. The
            list is updated by the Hydro product team on a regular basis.
          </div>
          <Toasts.Toast icon="solid:radio" isDismissible={false} variant="info">
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
        </div>
        <BlurryBackdropBox>
          <StyledTable
            columns={columns}
            rows={rows}
            initialSortedColumnKey="status"
          />
        </BlurryBackdropBox>
      </ContentContainer>
    </>
  )
}
