import React, { FC } from "react"

type Props = {
    type: "primary" | "secondary"
    style: "outline" | "filled"
    title: string
    onClick?: (row: any) => void
    className?: string
}

export const Button: FC<Props> = ({
    type,
    style,
    title,
    onClick,
    className,
}) => {
    let buttonClass =
        "flex justify-center items-center w-fit gap-2.5 border rounded-[10px] border-solid text-center text-xl not-italic font-medium leading-[21px]"
    const providedPx = className?.match(/px-(\d+)/)
    const providedPy = className?.match(/py-(\d+)/)
    buttonClass += providedPx ? ` px-${providedPx[1]}` : " px-6"
    buttonClass += providedPy ? ` py-${providedPy[1]}` : " py-5"

    if (type === "primary" && style === "filled") {
        buttonClass +=
            " border-[#0061FF] bg-blue-500 hover:bg-blue-600 text-white"
    } else if (type === "primary" && style === "outline") {
        buttonClass +=
            " border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
    } else if (type === "secondary" && style === "filled") {
        buttonClass +=
            " border-[#131313] bg-white text-[#131313] hover:bg-gray-600 hover:text-[white]"
    } else if (type === "secondary" && style === "outline") {
        buttonClass +=
            " border border-gray-500 font-medium hover:bg-gray-500 hover:text-white"
    }

    return (
        <button className={`${buttonClass} ${className}`} onClick={onClick}>
            {title}
        </button>
    )
}
