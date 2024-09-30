"use client"

import { useEffect, useState } from "react"

export function useIsDocumentScrolled() {
    const [isDocumentScrolled, setIsDocumentScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsDocumentScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)

        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return isDocumentScrolled
}
