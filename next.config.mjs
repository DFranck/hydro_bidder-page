import Nextra from "nextra"

const withNextra = Nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  latex: true,
})

const nextConfig = withNextra({
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
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lodash", "@cosmjs/cosmwasm-stargate"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
})

export default nextConfig
