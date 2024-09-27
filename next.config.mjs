import Nextra from "nextra"

const withNextra = Nextra({
    theme: "nextra-theme-docs",
    themeConfig: "./theme.config.jsx",
    latex: true
})

export default withNextra()
