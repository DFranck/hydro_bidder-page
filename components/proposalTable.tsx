"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Proposal } from "@/app/ts_types/HydroBase.types"
import { Tribute } from "@/app/ts_types/TributeBase.types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { sumTributeAmounts } from "@/lib/utils"

export function DataTable<TData, TValue>({
    columns,
    data,
}: {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
            <Table className={`flex flex-col`}>
                <TableHeader className="w-full [&_tr]:border-b-0  pr-4">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="w-full table table-fixed"
                        >
                            {headerGroup.headers.map((header, index) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="flex-auto pr-4 space-y-4">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={`w-full table table-fixed h-[82px] border-b-0 hover:bg-[#303132}]`}
                            >
                                {row
                                    .getVisibleCells()
                                    .map((cell, index, row) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`py-[14px] px-[24px] ${
                                                index === 0
                                                    ? "rounded-[10px_0_0_10px]"
                                                    : row.length === index + 1
                                                    ? "rounded-[0_10px_10px_0]"
                                                    : ""
                                            } bg-[#303132]  text-[#fff}]`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export type ProposalColumnDef = {
    proposal: Proposal
    summedTributes: { denom: string; amount: number }[]
}

export function makeProposalColumnDef(
    proposal: Proposal,
    tributes: Tribute[]
): ProposalColumnDef {
    return {
        proposal: proposal,
        summedTributes: sumTributeAmounts(tributes),
    }
}
