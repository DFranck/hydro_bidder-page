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
    ],
  },
<<<<<<< HEAD
=======
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/holdings",
        destination:
          "https://hydro-deployment-tracking-2fitd.ondigitalocean.app/holdings/",
      },
    ]
  },
>>>>>>> cbde222 (Implemented initial tracking page)
})

export default nextConfig
