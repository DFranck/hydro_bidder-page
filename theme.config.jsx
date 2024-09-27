import Image from "next/image"
import "@/app/globals.css"

const themeConfig = {
    logo: (
        <Image
            src="/images/logo.svg"
            alt="Hydro Logo"
            className="h-[40px]"
            width={180}
            height={50}
        />
    ),
    logoLink: "/docs",
    project: {
        link: "/docs",
    },
    head: (
        <>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta property="og:title" content="Hydro Documentation" />
            <meta
                property="og:description"
                content="Hydro is a Cosmos Hub liquidity platform that allows you to lock your ATOM and participate in the growth of the Cosmos ecosystem."
            />
        </>
    ),
    // ... other theme options
}

export default themeConfig
