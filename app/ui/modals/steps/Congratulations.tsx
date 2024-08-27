'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Image from "next/image"
import { useRouter } from 'next/navigation'


export const Congratulations = () => {
    const router = useRouter()

    return (
        <Dialog>
            <DialogTrigger>see congrats modal</DialogTrigger>
            <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
                <DialogHeader className="pb-[34px]">
                    <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px] mb-[10px]">Congratulations</DialogTitle>
                    <DialogDescription className="text-white/50 text-xl not-italic font-normal leading-[150%]">
                        You have successfully locked up your stATOM. Now you can start voting and earning rewards.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center">
                    <Image src={'/images/Polygon1.svg'} alt='hex' width={87} height={100} className="mt-[55px] mb-[55px]" />
                    <p className="text-center text-xl not-italic font-bold leading-[150%]">
                        Your stATOM is now locked and you are ready to vote!
                    </p>
                    <Button onClick={() => router.push('/dashboard')} variant='secondary' className="w-full py-[10px] mt-[55px]">Go to Dashboard</Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}
