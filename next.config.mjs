import BundleAnalyzer from "@next/bundle-analyzer"
import Nextra from "nextra"

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const withNextra = Nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  latex: true,
})

const nextConfig = withBundleAnalyzer(
  withNextra({
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.netlify.app",
        },
        {
          protocol: "https",
          hostname: "*.github.com",
        },
        {
          protocol: "https",
          hostname: "*.githubusercontent.com",
        },
      ],
    },
  })
)

export default nextConfig
