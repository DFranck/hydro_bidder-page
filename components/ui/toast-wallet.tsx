import { AlertTriangleIcon, Loader2Icon } from "lucide-react"
import { toast } from "./use-toast"

export function ToastProcessing() {
    return toast({
        className:
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "Transaction submitted",
        description: (
            <div className="inline-flex">
                <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                Processing...
            </div>
        ),
        duration: 2000,
    })
}

export function ToastAborted(message?: string) {
    return toast({
        className:
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "Aborted",
        description: (
            <div className="inline-flex items-center">
                {message || "Transaction was not submitted"}
            </div>
        ),
        duration: 2000,
    })
}

export function ToastError(err: any) {
    return toast({
        className:
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "Exception",
        description: (
            <div className="inline-flex items-center">
                <AlertTriangleIcon className="w-8 h-8 text-yellow-400 mr-2" />
                {err && err?.message
                    ? `Transaction failed: ${err.message}`
                    : "Transaction failed - unkonwn error"}
            </div>
        ),
        variant: "destructive",
        duration: 5000,
    })
}

export function ToastExecutedTx(title?: string, message?: string) {
    return toast({
        className:
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: title || "Success",
        description: message || "Transaction executed successfully",
        duration: 2000,
    })
}
