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
import Image from "next/image"
import Button from "../ui/Button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    height?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    height = 'auto'
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const renderTableCell = (cell: any) => {
        const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
        if (cell.column.columnDef.header === 'Lockup ID') {
            return <div className="flex flex-row gap-2"><Image src={'/images/Lock.svg'} alt='lock' width={20} height={20} /> {cellContent}</div>
        } else if (cell.column.columnDef.header === 'Proposal Actions') {
            return <Button className="px-6 py-0 h-[40px]" type='primary' style="filled" title="Vote Now" onClick={() => { undefined }} />
        } else if (cell.column.columnDef.header === 'Lockup Actions') {
            return <Button className="px-6 py-0 h-[40px]" type='secondary' style="filled" title="Edit" onClick={() => { undefined }} />
        }

        return flexRender(cell.column.columnDef.cell, cell.getContext())
    }

    const renderHeaderCell = (cell: any) => {
        const actionCells = ['Proposal Actions', 'Lockup Actions']
        if (actionCells.includes(cell.column.columnDef.header)) {
            return null
        }
        return flexRender(
            cell.column.columnDef.header,
            cell.getContext()
        )
    }

    return (
        <div >
            <Table className={`flex flex-col w-[calc(100%-10px)] ${height}`}>
                <TableHeader className="w-full">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="w-full table table-fixed">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : renderHeaderCell(header)
                                        }
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="flex-auto block overflow-y-auto overflow-x-hidden pr-[10px]">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="w-full table table-fixed"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {renderTableCell(cell)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
