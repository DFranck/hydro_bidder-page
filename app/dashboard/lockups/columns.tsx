"use client"

import Button from "@/app/ui/Button";
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";

export type Lockup = {
    id: string;
    votingPower: number;
    stATOMs: number;
    startDate: string;
    endDate: string;
    timeRemaining: string;
}

export interface LockupColumnProps {
    onEditLockup: (lockup: Lockup) => void;
}

export const columns = ({ onEditLockup }: LockupColumnProps): ColumnDef<Lockup>[] => [
    {
        accessorKey: "id",
        header: "Lockup ID",
        cell: ({ row }) => <div className="flex flex-row gap-2"><Image src={'/images/Lock.svg'} alt='lock' width={20} height={20} /> {row.getValue<string>('id')}</div>,
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
        id: 'actions',
        cell: ({ row }) => <Button className="px-6 py-0 h-[40px]" type='secondary' style="filled" title="Edit" onClick={() => onEditLockup(row.original)} />
    }
]
