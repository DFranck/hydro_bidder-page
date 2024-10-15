"use client"

import { useEffect, useState } from "react"

export function useIsDocumentScrolled() {
    const [isDocumentScrolled, setIsDocumentScrolled] = useState(false)
    const [canDocumentScroll, setCanDocumentScroll] = useState(false)

    useEffect(() => {
        function handleScroll() {
            setIsDocumentScrolled(window.scrollY > 50)
            setCanDocumentScroll(
                window.innerHeight < document.body.scrollHeight
            )
        }

        window.addEventListener("scroll", handleScroll)

        const interval = setInterval(() => {
            handleScroll()
        }, 1000)

        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
            clearInterval(interval)
        }
    }, [])

    return { isDocumentScrolled, canDocumentScroll }
}
