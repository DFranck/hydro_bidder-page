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
import { Proposal } from "@/app/ts_types/HydroBase.types";
import { Tribute } from "@/app/ts_types/TributeBase.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    height?: string,
    theme?: 'light' | 'dark'
}

export function DataTable<TData, TValue>({
    columns,
    data,
    theme = 'dark'
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div >
            <Table className={`flex flex-col`}>
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
                <TableBody className="flex-auto pr-4 space-y-4">
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

export type ProposalColumnDef = {
    proposal: Proposal,
    summedTributes: { denom: string, amount: number }[],
}

export function makeProposalColumnDef(proposal: Proposal, tributes: Tribute[]): ProposalColumnDef {
    return {
        proposal: proposal,
        summedTributes: sumTributeAmounts(tributes),
    }
}

// Calculates and formats the total tribute amounts for each token in a list of tributes.
// 
// This function takes an array of Tribute objects and processes them to:
// 1. Sum up the amounts for each unique token (denom).
// 2. Preserve the order in which tokens first appear.
// 3. Return an array of objects, each containing a token and its total amount.
// 
// The returned array maintains the original order of token appearance and
// provides a clear summary of total tributes per token type.
function sumTributeAmounts(tributes: Tribute[]): { denom: string, amount: number }[] {
    // Sum up tributes by denom, maintaining order of first appearance
    const denomSums = new Map<string, number>();
    const denomOrder: string[] = [];

    tributes.forEach(tribute => {
        const { denom, amount } = tribute.funds;
        if (!denomSums.has(denom)) {
            denomSums.set(denom, 0);
            denomOrder.push(denom);
        }
        denomSums.set(denom, denomSums.get(denom)! + parseInt(amount));
    });

    return denomOrder.map(denom => ({
        denom,
        amount: denomSums.get(denom)!
    }));
}

export const proposalColumns = (onClick: (proposal: Proposal) => void): ColumnDef<ProposalColumnDef>[] => [
    {
        accessorKey: "title",
        header: "",
        cell: ({ row }) => {
            return (<div className="flex flex-col">
                <p className="text-xl not-italic font-bold leading-[150%]">{row.original.proposal.title}</p>
            </div>
            )
        },
    },
    {
        accessorKey: "tribute",
        header: () => <div className="text-center">Tribute Amount</div>,
        cell: ({ row }) => <div className="text-center">{row.original.summedTributes.map((tribute, index) =>
            <div key={index} className="text-center">
                {`${(tribute.amount / 1000000).toFixed(2)} ${tribute.denom.length > 20 ? tribute.denom.slice(0, 17) + '...' : tribute.denom}`}
            </div>)
        }</div>,
    },
    {
        accessorKey: "votingPowerPercent",
        header: () => <div className="text-center">Voting Power %</div>,
        cell: ({ row }) => <div className="text-center">{row.original.proposal.percentage}</div>,
    },
    {
        accessorKey: "link",
        header: "",
        cell: ({ row }) => {
            return (<Link href={`/dashboard/proposals/${row.original.proposal.proposal_id}`}><Button>View Proposal</Button></Link>)
        }
    }
]
