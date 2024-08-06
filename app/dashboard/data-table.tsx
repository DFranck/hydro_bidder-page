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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    height?: string,
    theme?: 'light' | 'dark'
}

export function DataTable<TData, TValue>({
    columns,
    data,
    height = 'auto',
    theme = 'dark'
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div >
            <Table className={`flex flex-col ${height}`}>
                <TableHeader className="w-full [&_tr]:border-b-0  pr-4">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="w-full table table-fixed">
                            {headerGroup.headers.map((header, index) => {
                                return (
                                    <TableHead key={header.id} >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="flex-auto block overflow-y-auto overflow-x-hidden pr-4 space-y-4">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (<TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            className="w-full table table-fixed h-[82px] border-b-0"
                        >
                            {row.getVisibleCells().map((cell, index, row) => (
                                <TableCell key={cell.id} className={`py-[14px] px-[24px] ${index === 0 ? 'rounded-[10px_0_0_10px]' : row.length === index + 1 ? 'rounded-[0_10px_10px_0]' : ''} bg-[${theme === 'light' ? '#fff' : '#303132'}] text-[${theme === 'light' ? '#080815' : '#fff'}]`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            )
                            )}
                        </TableRow>
                        )
                        )
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
