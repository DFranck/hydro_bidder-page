import { Loader } from "lucide-react"

export default function LoadingState() {
    return (
        <div
            className="
                fixed
                inset-0
                text-white
                bg-palette-text
                flex
                items-center
                justify-center
            "
        >
            <div
                className="
                    animate-spin
                    animate
                "
            >
                <Loader size={40} />
            </div>
        </div>
    )
}
