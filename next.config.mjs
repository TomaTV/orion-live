/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [];
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
