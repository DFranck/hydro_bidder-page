import Nextra from "nextra"
import { dirname, resolve as pathResolve } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fileSystemCachePath = pathResolve(
  __dirname,
  "node_modules/next/dist/server/lib/incremental-cache/file-system-cache.js",
)

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
  cacheHandler: fileSystemCachePath,
  experimental: {
    optimizePackageImports: ["lodash", "@cosmjs/cosmwasm-stargate"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  compress: true,
})

export default nextConfig
