"use client"
// import Button from "../../Button";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

enum LockupPeriod {
    "1m" = "1m",
    "3m" = "3m",
    "6m" = "6m",
    "12m" = "12m",
}

export const GetHAtom: React.FC<{ action?: () => void }> = ({ action }) => {
    const formSchema = z.object({
        lockupPeriod: z.nativeEnum(LockupPeriod),
        atom: z.coerce.number().min(0),
        statom: z.coerce.number().min(0),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lockupPeriod: LockupPeriod["1m"],
            atom: 0,
            statom: 0,
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("2");

        action && action();
    }
    return (
        <Dialog>
            <DialogTrigger className="flex justify-center items-center gap-2.5 border text-white text-center text-xl not-italic font-medium leading-[21px] px-6 py-5 rounded-[10px] border-solid border-white">
                Lock your stATOM
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
                <DialogHeader className="pb-[34px]">
                    <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px] mb-[10px]">Step 2: Get hATOM</DialogTitle>
                    <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
                        Lock up your stATOM to get hATOM, which will give you Voting Power based on the lock-up period.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-[30px] mt-5 [&>*:last-child]:mt-[85px]">
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
                                    <div className=" flex justify-between items-center">
                                        <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[55px]">stATOM to lock:</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="flex w-[491px] h-10 items-center shrink-0 border px-4 py-0 rounded-[10px] border-solid border-white bg-transparent" {...field} />
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
                                    <div className=" flex justify-between items-center">
                                        <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[55px]">Estimated hATOM:</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="flex w-[491px] h-10 items-center gap-2.5 shrink-0 border px-4 py-0 rounded-[10px] border-solid border-white bg-transparent" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant='secondary'>Lock stATOM</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}