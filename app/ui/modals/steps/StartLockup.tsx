import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LockupSteper from "../../Stepper";

const StartLockup = () => {
    return (
        <Dialog>
            <DialogTrigger>Lockup With Stepper</DialogTrigger>
            <DialogContent className="bg-neutral-900 bg-[linear-gradient(90deg,#171717_43%,#292929_43%)] rounded-[10px] border-none w-[894px] p-12">
                <div className="flex flex-row">
                    <div className="w-[384px]">
                        <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px]">Final Approval</DialogTitle>
                        <LockupSteper />
                    </div>
                    <div className="w-[375px] flex flex-col gap-4">
                        <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px]">Let the Liquidity Flow!</DialogTitle>
                        <p className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-normal leading-[150%]">Your selected validator: Golden Ratio Staking</p>
                        <p className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-normal leading-[150%]">ATOM to Lock Up: 12,000</p>
                        <p className="text-[rgba(255,255,255,0.50)] text-sm not-italic font-normal leading-[150%]">Lock-up Period: 6 months</p>
                        <p className="text-2xl not-italic font-bold leading-[120%] tracking-[-0.4px]">VOTING POWER: 120,000</p>
                        <p className="text-base not-italic font-normal leading-[150%]">Once locked, your ATOM remains inaccessible until the lockup expires.</p>
                        <Button variant="secondary" className="w-full hover:bg-neutral-900 hover:text-white hover:border hover:border-white rounded-[10px]">Start Lock Up</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default StartLockup;
