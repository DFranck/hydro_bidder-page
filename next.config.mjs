const nextConfig = {
  experimental: {
    dynamicIO: true,
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
}

export default nextConfig
