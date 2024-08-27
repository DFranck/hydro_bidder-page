"use client"
// import Button from "../../Button";
import { Switch } from "../../../../components/ui/switch";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

enum LockupPeriod {
    "1m" = "1m",
    "3m" = "3m",
    "6m" = "6m",
    "12m" = "12m",
}

export const Convert = () => {
    const formSchema = z.object({
        nativeBalance: z.boolean(),
        lockupPeriod: z.nativeEnum(LockupPeriod),
        atom: z.coerce.number().min(0),
        statom: z.coerce.number().min(0),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nativeBalance: false,
            lockupPeriod: LockupPeriod["1m"],
            atom: 0,
            statom: 0,
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
                    <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px] mb-[10px]">Step 1: Convert ATOM to stATOM</DialogTitle>
                    <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
                        Stake your ATOM tokens in exchange for stATOM which you can deploy around the ecosystem. You can liquid stake half of your balance, if you’re going to LP.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 mt-5 [&>*:last-child]:mt-[30px]">
                        <FormField
                            control={form.control}
                            name="nativeBalance"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-start items-center gap-[10px]">
                                        <FormControl>
                                            <Switch />
                                        </FormControl>
                                        <FormLabel className="text-xl not-italic font-normal leading-[150%]">Pull from natively staked balance</FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lockupPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <div className=" gap-[56px] flex justify-start items-center">
                                        <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[55px]">Lock-up period:</FormLabel>
                                        <FormControl>
                                            <ToggleGroup type="single" className="gap-[10px]" defaultValue={form.getValues("lockupPeriod")}>
                                                {Object.entries(LockupPeriod).map(([value, label]) => (
                                                    <ToggleGroupItem key={value} value={value} className="text-[#080815] text-center text-base not-italic font-medium leading-[21px] inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 bg-[rgba(255,255,255,0.40)] px-4 py-0 rounded-[100px]">
                                                        {label}
                                                    </ToggleGroupItem>
                                                ))}
                                            </ToggleGroup>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="atom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormDescription>
                                        Amount to Stake
                                    </FormDescription>
                                    <div className="flex justify-between items-center">
                                        <FormLabel className="text-xl not-italic font-normal leading-[150%]">ATOM:</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="flex w-[505px] h-10 items-center gap-2.5 shrink-0 border opacity-60 px-4 py-0 rounded-[10px] border-solid border-white bg-transparent" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="statom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormDescription>
                                        What You’ll Get
                                    </FormDescription>
                                    <div className="flex justify-between items-center">
                                        <FormLabel className="text-xl not-italic font-normal leading-[150%]">stATOM:</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="flex w-[505px] h-10 items-center gap-2.5 shrink-0 border opacity-60 px-4 py-0 rounded-[10px] border-solid border-white bg-transparent" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant='secondary'>Connect Wallet</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}