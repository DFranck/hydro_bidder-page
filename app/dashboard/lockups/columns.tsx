"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Lockups = {
    id: string;
    votingPower: number;
    stATOMs: number;
    startDate: string;
    endDate: string;
    timeRemaining: string;
}

export const columns: ColumnDef<Lockups>[] = [
    {
        accessorKey: "id",
        header: "Lockup ID",
    },
    {
        accessorKey: "votingPower",
        header: "Voting Power",
    },
    {
        accessorKey: "stATOMs",
        header: "stATOMs",
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
    },
    {
        accessorKey: "endDate",
        header: "End Date",
    },
    {
        accessorKey: "timeRemaining",
        header: "Time Remaining",
    },
    {
        accessorKey: "lockupActions",
        header: "Lockup Actions",
    }
]
