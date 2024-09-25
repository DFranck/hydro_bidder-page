import { Truck } from "lucide-react"

export default function LoadingState() {
    return (
        <div
            className="
                bg-white
                fixed
                inset-0
                text-palette-text
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
                <Truck size={40} />
            </div>
        </div>
    )
}
