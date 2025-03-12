import Nextra from "nextra"

const withNextra = Nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  latex: true,
})

const nextConfig = withNextra({
  experimental: {
    turbo: {},
  },
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
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
})

export default nextConfig
