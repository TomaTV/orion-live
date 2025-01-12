/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    windowHistorySupport: true,
    colorProfile: true,
  },
  async rewrites() {
    return [];
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;