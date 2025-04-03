"use client"

import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { EmptyBox } from "@/components/EmptyBox"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { fetchExperimentalDeployments } from "@/contract-apis/fetchExperimental"
import { ExperimentalItem, ExperimentalRow } from "@/contract-apis/types"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useEffect, useState } from "react"
import { ExperimentalTableItem } from "./ExperimentalTableItem"
import { getExperimentalTableRows } from "./getExperimentalTableRows"
import { classNames } from "./classNames"

export default function ExperimentalTable() {
  const [isLoadingExperimental, setIsLoadingExperimental] = useState(false)
  const [experimentalItems, setExperimentalItems] = useState<
    ExperimentalItem[]
  >([])
  const [openedRows, setOpenedRows] = useState<number[]>([])
  const { isLoading } = useBackendData()

  const toggleRow = (experimentalId: number) => {
    setOpenedRows((prev) =>
      prev.includes(experimentalId)
        ? prev.filter((id) => id !== experimentalId)
        : [...prev, experimentalId],
    )
  }

  const columns: ColumnObject<ExperimentalRow, keyof ExperimentalRow>[] = [
    {
      key: "logoAndName",
      label: "Deployment",
      textAlign: "left",
      isSortable: true,
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._experimental.name,
    },
    {
      key: "startDate",
      label: "Start Date",
      isSortable: true,
      initialSortDirection: "DESC",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._experimental.start_timestamp,
    },
    {
      key: "status",
      label: "Status",
      isSortable: true,
      initialSortDirection: "DESC",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) => row._experimental.end_timestamp,
    },
    {
      key: "initialAddressHoldings",
      label: "Initial Address Holdings",
      isSortable: true,
      initialSortDirection: "DESC",
      textAlign: "right",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) =>
        row._experimental.initial_address_holdings.total_atom,
    },
    {
      key: "deploymentAPR",
      label: "Deployment APR",
      isSortable: true,
      initialSortDirection: "DESC",
      textAlign: "right",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
      customValueGetter: (row) =>
        row._experimental.current_address_holdings.total_atom,
    },
    {
      key: "actions",
      label: "",
      isSortable: false,
      textAlign: "right",
      propsForCells: {
        className: classNames.classNamesForCells,
      },
    },
  ]

  const experimentalRows = getExperimentalTableRows(
    openedRows,
    toggleRow,
    experimentalItems,
  )

  useEffect(() => {
    const getExperimentalDeployments = async () => {
      setIsLoadingExperimental(true)
      const experimentalResponseItems = await fetchExperimentalDeployments()
      setExperimentalItems(experimentalResponseItems || [])
      setIsLoadingExperimental(false)
    }
    getExperimentalDeployments()
  }, [])

  return (
    <>
      <LoadingSpinner isLoading={isLoading || isLoadingExperimental} />

      {!isLoading && !isLoadingExperimental && !experimentalItems.length && (
        <BlurryBackdropBox>
          <EmptyBox>
            There are no experimental items available at this moment.
          </EmptyBox>
        </BlurryBackdropBox>
      )}

      {!isLoading && !isLoadingExperimental && experimentalItems.length > 0 && (
        <BlurryBackdropBox>
          <StyledTable
            className="border-collapse border-spacing-y-0 [&>tbody]:gap-0 [&>tbody]:max-sm:gap-1"
            initialSortedColumnKey="logoAndName"
            columns={columns}
            rows={experimentalRows}
            renderRow={(props) => (
              <ExperimentalTableItem
                key={props.row._experimental.experimental_id}
                {...props}
              />
            )}
          />
        </BlurryBackdropBox>
      )}
    </>
  )
}
