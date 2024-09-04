"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

enum LockupPeriod {
    "1m" = "1m",
    "3m" = "3m",
    "6m" = "6m",
    "12m" = "12m",
}

const mockValidators = [
    {
        name: 'Golden Ratio Staking',
        funds: {
            amount: 5000,
            denom: "atom"
        }
    },
    {
        name: 'Informal Staking',
        funds: {
            amount: 5000,
            denom: "atom"
        }
    },
    {
        name: 'Ludicrously long validator name | Why? Because 😎s get attention and so on',
        funds: {
            amount: 10000000,
            denom: "atom"
        }
    },
]

export const Convert = () => {
    const formSchema = z.object({
        nativeBalance: z.boolean(),
        lockupPeriod: z.nativeEnum(LockupPeriod),
        atom: z.coerce.number().min(0),
        hatom: z.coerce.number().min(0),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nativeBalance: false,
            lockupPeriod: LockupPeriod["1m"],
            atom: 0,
            hatom: 0,
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <Dialog>
            <DialogTrigger className="flex h-[60px] justify-center items-center gap-2.5 text-[#080815] text-center text-xl not-italic font-medium leading-[21px] bg-white px-6 py-5 rounded-[10px]">
                Get Started
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
                <DialogHeader className="pb-[34px]">
                    <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px] mb-[10px]">Step 1: Select your Validator</DialogTitle>
                    <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
                        Lock your staked ATOM tokens for Voting Power, which you can use to vote on liquidity proposals and potentially earn rewards. Your locked ATOM will be converted to LSM shares and sent to Neutron for Voting Power. If you don’t have staked ATOM, stake them first before returning to Hydro.
                    </DialogDescription>
                </DialogHeader>
                <p className="text-xl not-italic font-bold leading-[150%]">
                    Once locked, your ATOM remains inaccessible until the lockup expires.
                </p>
                <p className="text-white/50 text-xl not-italic font-semibold leading-[150%]">
                    You can only pull from your natively staked balance.
                </p>
                <p className="text-white/50 text-xl not-italic font-semibold leading-[150%]">
                    Choose the validator to pull from:
                </p>
                <div className="flex flex-col gap-[35px]">
                    {mockValidators.map((validator, index) => (
                        <div key={index} className="w-full flex justify-between items-center">
                            <div className="flex flex-col">
                                <p className="text-xl not-italic font-bold leading-[150%] max-w-[405px] truncate ...">
                                    {validator.name}
                                </p>
                                <div className="text-white/60 text-sm not-italic font-normal leading-[150%]">
                                    Available <span>{validator.funds.amount.toLocaleString('en-US')} </span>
                                    <span className="uppercase">{validator.funds.denom}</span>
                                </div>
                            </div>
                            <Button className="h-[48px] px-6 rounded-[10px] text-[#080815] text-center text-xl not-italic font-medium leading-[21px]" variant="secondary">Select</Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>

    )
}