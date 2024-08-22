"use client"

import { Proposal } from "@/app/ts_types/HydroBase.types";
import Button from "@/app/ui/Button";
import { ColumnDef } from "@tanstack/react-table"
import { Tribute } from "@/app/ts_types/TributeBase.types";

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
        header: "Filter",
        cell: ({ row }) => {
            return (<div className="flex flex-col">
                <p className="text-xl not-italic font-bold leading-[150%]">{row.original.proposal.title}</p>
                <p className="text-base not-italic font-medium leading-[150%]">{row.original.proposal.description}</p>
            </div>
            )
        },
    },
    {
        accessorKey: "tribute",
        header: () => "Tribute Amount",
        cell: ({ row }) => <div className="text-center">{row.original.summedTributes.map(tribute =>
            <div className="text-center">
                {`${(tribute.amount / 1000000).toFixed(2)} ${tribute.denom.length > 20 ? tribute.denom.slice(0, 17) + '...' : tribute.denom}`}
            </div>)
        }</div>,
    },
    {
        accessorKey: "power",
        header: "Current Voting Power",
        cell: ({ row }) => <div className="text-center">{parseFloat(row.original.proposal.power)}</div>,
    },
    {
        accessorKey: "votingPowerPercent",
        header: "Voting Power %",
        cell: ({ row }) => <div className="text-center">{row.original.proposal.percentage}</div>,
    }
]

export const deployedProposalColumns: ColumnDef<ProposalColumnDef>[] = [
    {
        accessorKey: "title",
        header: "",
    },
    {
        accessorKey: "tribute",
        header: "Tribute Amount",
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