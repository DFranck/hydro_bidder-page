import Image from "next/image"
import { useConfig } from "nextra-theme-docs"

const themeConfig = {
  darkMode: true,
  nextThemes: {
    defaultTheme: "dark",
  },
  notFound: { component: null },
  editLink: { component: null },
  feedback: { content: null },
  footer: { component: null },
  head() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { frontMatter, normalizePagesResult } = useConfig()
    const dynamicTitle =
      ([...normalizePagesResult.activePath] || [])
        .reverse()
        .map((x) => x.title)
        .join(" - ") || "Hydro Documentation"
    const description =
      frontMatter.description ||
      "Hydro is a Cosmos Hub liquidity platform that allows you to lock your ATOM and participate in the growth of the Cosmos ecosystem."

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <meta property="og:title" content={dynamicTitle} />
        <meta property="og:description" content={description} />
        <title>{dynamicTitle}</title>
      </>
    )
  },
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
  nextThemes: {
    attribute: "class",
    enableSystem: true,
  },
}

export default themeConfig
