"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Proposal = {
    id: string;
    title: string;
    description: string;
    tributeAmount: number;
    tributeToken: string;
    currentVotingPower: number;
    votingPowerPercent: number;
}

export const columns: ColumnDef<Proposal>[] = [
    {
        accessorKey: "title",
        header: "Filter",
    },
    {
        accessorKey: "tributeAmount",
        header: "Tribute Amount",
    },
    {
        accessorKey: "tributeToken",
        header: "Tribute Token",
    },
    {
        accessorKey: "currentVotingPower",
        header: "Current Voting Power",
    },
    {
        accessorKey: "votingPowerPercent",
        header: "Voting Power %",
    }
]
