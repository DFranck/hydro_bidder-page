"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
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
    <ContentContainer className="gap-6 py-12">
      <StyledText variant="h2">Upcoming Airdrops for Hydro Users</StyledText>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="prose prose-invert">
          As a Hydro participant, you may qualify for airdrops from various
          ecosystem projects. Stay informed about potential token distributions
          below.
        </div>

        <Toasts.Toast icon="solid:radio" isDismissible={false} variant="info">
          Stay tuned for updates! Confirmed airdrops will be distributed
          automatically based on your participation in Hydro.
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
  )
}
