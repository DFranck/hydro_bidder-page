import "@/app/globals.css"
import Image from "next/image"
import { useConfig } from "nextra-theme-docs"
import { useEffect } from "react"

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
  editLink: {
    component: null,
  },
  feedback: {
    content: null,
  },
  nextThemes: {
    defaultTheme: "dark",
  },
  footer: {
    component: null,
  },
  head() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { frontMatter } = useConfig()
    const title = frontMatter.title || "Hydro Documentation"
    const description =
      frontMatter.description ||
      "Hydro is a Cosmos Hub liquidity platform that allows you to lock your ATOM and participate in the growth of the Cosmos ecosystem."

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const interval = setInterval(() => {
        window.document.title = window.document.title.replace(" – Nextra", "")
      }, 250)

      return () => clearInterval(interval)
    }, [])

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </>
    )
  },
  // ... other theme options
}

export default themeConfig
