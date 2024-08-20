"use client"

import { Proposal } from "@/app/ts_types/HydroBase.types";
// import { Proposal } from "@/app/ts_types/HydroBase.types";
import Button from "@/app/ui/Button";
import { ColumnDef } from "@tanstack/react-table"

export type ProposalColumnDef = {
    id: string;
    title: string;
    description: string;
    tributeAmount: number;
    tributeToken: string;
    currentVotingPower: number;
    votingPowerPercent: number;
}

export interface ActiveProposalsColumnProps {
    onVoteProposal: (proposal: Proposal) => void;
}

export const activeProposalColumns = ({ onVoteProposal }: ActiveProposalsColumnProps): ColumnDef<ProposalColumnDef>[] => [
    {
        accessorKey: "title",
        header: "Filter",
        cell: ({ row }) => {
            return (<div className="flex flex-col">
                <p className="text-xl not-italic font-bold leading-[150%]">{row.original.title}</p>
                <p className="text-base not-italic font-medium leading-[150%]">{row.original.description}</p>
            </div>
            )
        },
    },
    {
        accessorKey: "tributeAmount",
        header: () => "Tribute Amount",
        cell: ({ row }) => <div className="text-center">{row.getValue<string>('tributeAmount')}</div>,
    },
    {
        accessorKey: "tributeToken",
        header: "Tribute Token",
        cell: ({ row }) => <div className="text-center">{row.getValue<string>('tributeToken')}</div>,
    },
    {
        accessorKey: "currentVotingPower",
        header: "Current Voting Power",
        cell: ({ row }) => <div className="text-center">{row.getValue<string>('currentVotingPower')}</div>,
    },
    {
        accessorKey: "votingPowerPercent",
        header: "Voting Power %",
        cell: ({ row }) => <div className="text-center">{row.getValue<string>('votingPowerPercent')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <Button className="px-6 py-0 h-[40px]" type='primary' style="filled" title="Vote Now" onClick={() => onVoteProposal(row.original as unknown as Proposal)} />
    }
]

export const deployedProposalColumns: ColumnDef<ProposalColumnDef>[] = [
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
